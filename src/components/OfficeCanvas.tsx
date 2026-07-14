import { useEffect, useRef, useState } from 'react'
import { OfficeScene, type OfficeAgentClick } from '@/scene/OfficeScene'
import type { Agent, AgentState } from '@/types/agent'

type AgentMenuState = {
  agent: Agent
  rosterNo: number
  x: number
  y: number
  agents: Agent[]
  pickingTarget: boolean
}

const STATE_ACTIONS: Array<{
  label: string
  state: AgentState
  task?: string
}> = [
  { label: '开始工作', state: 'working', task: '处理当前任务…' },
  { label: '进入思考', state: 'thinking', task: '思考下一步…' },
  { label: '暂时空闲', state: 'idle' },
]

export function OfficeCanvas() {
  const hostRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<OfficeScene | null>(null)
  const readyRef = useRef(false)
  const [menu, setMenu] = useState<AgentMenuState | null>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const handleAgentClick = (event: OfficeAgentClick) => {
      const rect = host.getBoundingClientRect()
      const menuWidth = 220
      const menuHeight = 260
      setMenu({
        agent: event.agent,
        rosterNo: event.rosterNo,
        x: Math.max(12, Math.min(event.clientX - rect.left, rect.width - menuWidth - 12)),
        y: Math.max(12, Math.min(event.clientY - rect.top, rect.height - menuHeight - 12)),
        agents: sceneRef.current?.getAgents() ?? [],
        pickingTarget: false,
      })
    }

    const scene = new OfficeScene({ onAgentClick: handleAgentClick })
    sceneRef.current = scene

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      if (width <= 0 || height <= 0) return

      if (!readyRef.current) {
        readyRef.current = true
        void scene.init(host, width, height)
        return
      }

      sceneRef.current?.resize(width, height)
    })

    ro.observe(host)

    return () => {
      ro.disconnect()
      readyRef.current = false
      scene.destroy()
      sceneRef.current = null
    }
  }, [])

  useEffect(() => {
    const close = (event: PointerEvent) => {
      const target = event.target
      if (target instanceof Element && target.closest('.agent-action-menu')) {
        return
      }
      setMenu(null)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenu(null)
    }

    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const applyState = (state: AgentState, task?: string) => {
    if (!menu) return
    sceneRef.current?.setAgentState(menu.agent.id, state, task)
    setMenu(null)
  }

  const startInteraction = (targetRosterNo: number, targetName: string) => {
    if (!menu || targetRosterNo === menu.rosterNo) return
    sceneRef.current?.requestDeskVisit(
      menu.rosterNo,
      targetRosterNo,
      `${targetName}，我来和你同步一下。`,
    )
    setMenu(null)
  }

  return (
    <div ref={hostRef} className="office-canvas">
      {menu && (
        <div
          className="agent-action-menu"
          style={{ left: menu.x, top: menu.y }}
        >
          <div className="agent-action-head">
            <span className="agent-action-name">{menu.agent.name}</span>
            <span className="agent-action-state">{menu.agent.state}</span>
          </div>

          {!menu.pickingTarget ? (
            <>
              <div className="agent-action-group">
                {STATE_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    className="agent-action-btn"
                    onClick={() => applyState(action.state, action.task)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              <div className="agent-action-group">
                <button
                  type="button"
                  className="agent-action-btn primary"
                  onClick={() =>
                    setMenu((current) =>
                      current ? { ...current, pickingTarget: true } : current,
                    )
                  }
                >
                  互动…
                </button>
              </div>
            </>
          ) : (
            <div className="agent-action-group">
              <button
                type="button"
                className="agent-action-btn subtle"
                onClick={() =>
                  setMenu((current) =>
                    current ? { ...current, pickingTarget: false } : current,
                  )
                }
              >
                返回动作
              </button>
              {menu.agents
                .map((agent, index) => ({ agent, rosterNo: index + 1 }))
                .filter(({ agent }) => agent.id !== menu.agent.id)
                .map(({ agent, rosterNo }) => (
                  <button
                    key={agent.id}
                    type="button"
                    className="agent-action-btn"
                    onClick={() => startInteraction(rosterNo, agent.name)}
                  >
                    和 {agent.name} 互动
                  </button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
