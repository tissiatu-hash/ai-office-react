import type { Agent, AgentState, Desk } from '@/types/agent'

export const SCENE_WIDTH = 960
export const SCENE_HEIGHT = 640

export const COLORS = {
  floor: 0xffffff,
  wall: 0xe8e6e1,
  desk: 0xffffff,
  deskShadow: 0x00000014,
  monitor: 0x2a2a2a,
  chair: 0xd4d2cc,
  agentBody: 0x1a1a1a,
} as const

/** 3-role Telco Project Office workbench */
const DESK_COLS = 3
const DESK_ROWS = 1
const DESK_COL_GAP = 150
const DESK_ROW_GAP = 140
const DESK_BLOCK_WIDTH = (DESK_COLS - 1) * DESK_COL_GAP
const DESK_BLOCK_HEIGHT = (DESK_ROWS - 1) * DESK_ROW_GAP
/** 工位阵列在场景内水平/垂直居中 */
const DESK_ORIGIN_X = (SCENE_WIDTH - DESK_BLOCK_WIDTH) / 2
const DESK_ORIGIN_Y = (SCENE_HEIGHT - DESK_BLOCK_HEIGHT) / 2
export const SEAT_OFFSET_Y = 45

function buildDesks(): Desk[] {
  const desks: Desk[] = []
  let n = 0
  for (let row = 0; row < DESK_ROWS; row++) {
    for (let col = 0; col < DESK_COLS; col++) {
      const x = DESK_ORIGIN_X + col * DESK_COL_GAP
      const y = DESK_ORIGIN_Y + row * DESK_ROW_GAP
      desks.push({
        id: `desk-${n}`,
        x,
        y,
        seatX: x,
        seatY: y + SEAT_OFFSET_Y,
      })
      n++
    }
  }
  return desks
}

export const DESKS: Desk[] = buildDesks()

export type AgentRosterEntry = {
  id: string
  name: string
  color: number
  task: string
}

/** 3 Telco Project Office role agents (roster numbers 1–3) */
export const AGENT_ROSTER: AgentRosterEntry[] = [
  {
    id: 'commercial-agent',
    name: 'Commercial Agent',
    color: 0xe85d4a,
    task: 'Customer requirements, commercial scope, pricing assumptions and contract risks',
  },
  {
    id: 'technical-agent',
    name: 'Technical Agent',
    color: 0x4a90d9,
    task: 'Solution architecture, feasibility, integration dependencies and technical risks',
  },
  {
    id: 'project-manager-agent',
    name: 'Project Manager Agent',
    color: 0x9b6dd7,
    task: 'Timeline, owners, milestones, risks, next actions and status summary',
  },
]

const BOOT_STATES: AgentState[] = [
  'working',
  'thinking',
  'working',
]

function buildInitialAgents(): Agent[] {
  return AGENT_ROSTER.map((entry, i) => {
    const desk = DESKS[i]
    const state = BOOT_STATES[i] ?? 'idle'
    return {
      id: entry.id,
      name: entry.name,
      color: entry.color,
      x: desk.seatX,
      y: desk.seatY,
      state,
      currentTask: state === 'idle' ? undefined : entry.task,
      assignedDeskId: desk.id,
      facing: i % 2 === 0 ? 1 : -1,
      viewFacing:
        state === 'working' || state === 'thinking' ? ('back' as const) : ('front' as const),
    }
  })
}

export const INITIAL_AGENTS: Agent[] = buildInitialAgents()

/** 交接流程中的状态标签（头顶 / 侧栏） */
export const HANDOFF_STATUS = {
  delivering: 'Delivering project handoff…',
  handingOff: 'Sharing project context…',
  receiving: 'Receiving project inputs…',
  wrappingUp: 'Wrapping up project handoff…',
  planning: 'Planning next project action…',
} as const

/** Safe demo handoff messages for the scripted Telco Project Office flow */
export const HANDOFF_VISIT_MESSAGES: ((hostName: string) => string)[] = [
  (n) => `${n}, please review the HomeHub PoC Demo scope and next actions.`,
  (n) => `${n}, the PoC handoff is ready with demo-only assumptions and risks.`,
  (n) => `${n}, please align feasibility, milestones and dependencies for the status summary.`,
]

export function pickHandoffVisitMessage(
  hostName: string,
  hostRosterNo: number,
): string {
  const i = Math.abs(hostRosterNo - 1) % HANDOFF_VISIT_MESSAGES.length
  return HANDOFF_VISIT_MESSAGES[i]!(hostName)
}
