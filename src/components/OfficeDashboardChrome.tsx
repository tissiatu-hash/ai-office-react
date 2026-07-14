import { setAgentState } from '@/scene/officeSceneBridge'
import { submitVisitAction } from '@/services/officeActionDispatcher'

const NAV_ITEMS = [
  { icon: '⌂', label: 'Project Dashboard', active: true, badge: undefined },
  { icon: '▤', label: 'Project Tasks', active: false, badge: 8 },
  { icon: '♙', label: 'Role Agents', active: false, badge: undefined },
  { icon: '□', label: 'PoC Documents', active: false, badge: undefined },
  { icon: '☆', label: 'Risk Register', active: false, badge: 3 },
  { icon: '◫', label: 'Dependencies', active: false, badge: undefined },
  { icon: '▱', label: 'Status Notes', active: false, badge: 2 },
  { icon: '□', label: 'Milestones', active: false, badge: undefined },
  { icon: '♢', label: 'Actions', active: false, badge: 1 },
] as const

const STATS = [
  { label: 'Active PoC', value: '1', hint: 'Scope alignment', online: false },
  { label: 'Open Actions', value: '8', hint: 'Phase 1 demo', online: false },
  { label: 'Key Risks', value: '3', hint: 'Need review', online: false },
  { label: 'Role Agents', value: '3/3', hint: 'Ready', online: true },
] as const

const TASKS = [
  { title: 'Customer requirements captured', owner: 'Commercial Agent', progress: 100, tone: 'green', status: 'Done' },
  { title: 'Commercial assumptions pending', owner: 'Commercial Agent', progress: 55, tone: 'orange', status: 'Review' },
  { title: 'Technical feasibility review', owner: 'Technical Agent', progress: 45, tone: 'blue', status: 'In progress' },
  { title: 'Solution architecture draft', owner: 'Technical Agent', progress: 35, tone: 'purple', status: 'Draft' },
  { title: 'Integration dependencies', owner: 'Technical Agent', progress: 30, tone: 'orange', status: 'Open' },
  { title: 'Delivery milestones', owner: 'Project Manager Agent', progress: 25, tone: 'blue', status: 'Pending' },
  { title: 'Risks and next actions', owner: 'Project Manager Agent', progress: 60, tone: 'purple', status: 'Review' },
  { title: 'Management summary', owner: 'Project Manager Agent', progress: 40, tone: 'green', status: 'Draft' },
] as const

const ACTIVITIES = [
  { agent: 'Commercial Agent', text: 'captured safe demo requirements for HomeHub PoC Demo', time: '09:42' },
  { agent: 'Technical Agent', text: 'reviewing third-party AI integration dependencies and architecture notes', time: '09:38' },
  { agent: 'Project Manager Agent', text: 'waiting to confirm milestones and next actions', time: '09:31' },
  { agent: 'Commercial Agent', text: 'flagged pricing and scope assumptions for review', time: '09:24' },
] as const

const WORKSPACES = ['HomeHub PoC Demo', 'Commercial Scope', 'Technical Review', 'PM Control Room'] as const

const QUICK_TOOLS = [
  { icon: '□', label: 'PoC Brief' },
  { icon: '◎', label: 'Risk Review' },
  { icon: '⌗', label: 'Dependency Map' },
  { icon: '♩', label: 'Status Summary' },
] as const

const TOOLBAR_ITEMS = [
  { icon: 'Ⅰ', label: 'Commercial Review', primary: false },
  { icon: 'Ⅱ', label: 'Technical Review', primary: false },
  { icon: 'Ⅲ', label: 'PM Summary', primary: false },
  { icon: '□', label: 'Align SOW', primary: false },
  { icon: '+', label: 'Run Demo Flow', primary: true },
  { icon: '⇩', label: 'Export Status', primary: false },
] as const

const DEMO_PROJECT = {
  name: 'HomeHub PoC Demo',
  customer: 'Demo Telco',
  stage: 'PoC scope alignment',
  commercialStatus: 'Pricing and scope under review',
  technicalStatus: 'Architecture and integration dependencies under review',
  pmStatus: 'Pending milestone confirmation',
  risks: [
    'Scope creep',
    'Unclear third-party AI integration requirements',
    'Dependency on technical documents',
  ],
  nextAction: 'Align PoC SOW before adding new integration scope',
} as const

const WORKFLOW_STEPS = [
  'Commercial Agent reviews customer requirements',
  'Commercial Agent hands off scope notes to Technical Agent',
  'Technical Agent reviews feasibility and dependencies',
  'Technical Agent hands off delivery inputs to Project Manager Agent',
  'Project Manager Agent creates status summary and next actions',
] as const

function runCommercialReview() {
  setAgentState(
    'commercial-agent',
    'working',
    'Reviewing customer requirements, commercial scope and pricing assumptions…',
  )
}

function runTechnicalHandoff() {
  submitVisitAction({
    type: 'desk_visit',
    visitor: 1,
    host: 2,
    message: 'Technical Agent, customer requirements and commercial assumptions are ready for feasibility review.',
  })
}

function runTechnicalReview() {
  setAgentState(
    'technical-agent',
    'thinking',
    'Reviewing architecture, third-party AI integration dependencies and technical risks…',
  )
}

function runPmHandoff() {
  submitVisitAction({
    type: 'desk_visit',
    visitor: 2,
    host: 3,
    message: 'Project Manager Agent, feasibility findings and dependencies are ready for milestone planning.',
  })
}

function runPmSummary() {
  setAgentState(
    'project-manager-agent',
    'working',
    'Creating status summary, milestone actions and risk follow-ups…',
  )
}

function runDemoFlow() {
  runCommercialReview()
  submitVisitAction({
    type: 'desk_visit_tour',
    visitor: 1,
    hosts: [2, 3],
    message: 'HomeHub PoC Demo handoff: align scope, dependencies, milestones and next actions.',
  })
  runTechnicalReview()
  runPmSummary()
}

export function OfficeSidebar() {
  return (
    <aside className="office-sidebar">
      <div className="sidebar-brand">
        <span className="brand-mark">T</span>
        <span>Telco Project Office</span>
      </div>

      <div className="sidebar-search">
        <span>⌕</span>
        <span>Search projects, actions, risks…</span>
        <kbd>⌘K</kbd>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`nav-item ${item.active ? 'active' : ''}`}
          >
            <span className="nav-main">
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </span>
            {item.badge ? (
              <span className="nav-badge">{item.badge}</span>
            ) : null}
          </button>
        ))}
      </nav>

      <div className="sidebar-section">
        <p className="section-title">WORKSPACES</p>
        {WORKSPACES.map((workspace, index) => (
          <div
            key={workspace}
            className={`workspace-row ${index === 0 ? 'active' : ''}`}
          >
            {index === 0 ? <span className="agent-dot online" /> : <span className="dot-spacer" />}
            <span>{workspace}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="user-card">
          <span className="user-avatar">PO</span>
          <span>
            <strong>Project Office</strong>
            <em><span className="agent-dot online" />Demo mode</em>
          </span>
        </div>
        <div className="system-status">
          <span className="agent-dot online" />
          <span>Local prototype</span>
          <span>☼</span>
        </div>
      </div>
    </aside>
  )
}

export function OfficeHeaderStats() {
  return (
    <header className="office-header-stats">
      {STATS.map((stat) => (
        <section key={stat.label} className="stat-card">
          <span className="stat-label">{stat.label}</span>
          <strong className="stat-value">{stat.value}</strong>
          <span className={`stat-hint ${stat.online ? 'online-hint' : ''}`}>
            {stat.online ? <span className="agent-dot online" /> : null}
            {stat.hint}
          </span>
        </section>
      ))}
      <section className="stat-card resource-card project-stage-card">
        <span className="stat-label">Demo Project</span>
        <strong>{DEMO_PROJECT.name}</strong>
        <span>{DEMO_PROJECT.stage}</span>
      </section>
    </header>
  )
}

export function OfficeRightPanel() {
  return (
    <aside className="office-right-panel">
      <section className="panel-section project-card">
        <h2>{DEMO_PROJECT.name}</h2>
        <dl>
          <div><dt>Customer</dt><dd>{DEMO_PROJECT.customer}</dd></div>
          <div><dt>Stage</dt><dd>{DEMO_PROJECT.stage}</dd></div>
          <div><dt>Commercial</dt><dd>{DEMO_PROJECT.commercialStatus}</dd></div>
          <div><dt>Technical</dt><dd>{DEMO_PROJECT.technicalStatus}</dd></div>
          <div><dt>PM</dt><dd>{DEMO_PROJECT.pmStatus}</dd></div>
        </dl>
        <div className="risk-list">
          <strong>Risks</strong>
          {DEMO_PROJECT.risks.map((risk) => <span key={risk}>{risk}</span>)}
        </div>
        <p className="next-action"><strong>Next action:</strong> {DEMO_PROJECT.nextAction}</p>
      </section>

      <section className="panel-section workflow-card">
        <h2>Scripted Phase 1 Workflow</h2>
        <ol>
          {WORKFLOW_STEPS.map((step) => <li key={step}>{step}</li>)}
        </ol>
        <div className="workflow-actions">
          <button type="button" onClick={runCommercialReview}>1. Commercial review</button>
          <button type="button" onClick={runTechnicalHandoff}>2. Hand off to Technical</button>
          <button type="button" onClick={runTechnicalReview}>3. Technical review</button>
          <button type="button" onClick={runPmHandoff}>4. Hand off to PM</button>
          <button type="button" onClick={runPmSummary}>5. PM summary</button>
          <button type="button" className="primary" onClick={runDemoFlow}>Run demo flow</button>
        </div>
      </section>

      <section className="panel-section panel-grow">
        <h2>Project task stream</h2>
        <div className="task-list">
          {TASKS.map((task) => (
            <article key={task.title} className="task-card">
              <div className="task-title-row">
                <strong>{task.title}</strong>
                <span className={task.status === 'In progress' ? 'task-status active' : 'task-status'}>
                  {task.status}
                </span>
              </div>
              <p>{task.owner}</p>
              <div className="task-progress">
                <span className={`tone-${task.tone}`} style={{ width: `${task.progress}%` }} />
              </div>
              <em className="task-percent">{task.progress}%</em>
            </article>
          ))}
        </div>
      </section>

      <section className="panel-section">
        <h2>Recent demo activity</h2>
        <ul className="activity-list">
          {ACTIVITIES.map((activity) => (
            <li key={`${activity.agent}-${activity.time}`}>
              <span className="activity-dot" />
              <p>
                <strong>{activity.agent}</strong> {activity.text}
                <time>{activity.time}</time>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel-section">
        <h2>Prototype tools</h2>
        <div className="quick-tools">
          {QUICK_TOOLS.map((tool) => (
            <button key={tool.label} type="button" className="quick-tool">
              <span>{tool.icon}</span>
              <strong>{tool.label}</strong>
            </button>
          ))}
        </div>
      </section>
    </aside>
  )
}

export function OfficeBottomToolbar() {
  return (
    <div className="office-bottom-toolbar">
      <div className="toolbar-inner">
        {TOOLBAR_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`toolbar-btn ${item.primary ? 'primary' : ''}`}
            onClick={item.label === 'Run Demo Flow' ? runDemoFlow : undefined}
          >
            <span className="toolbar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
