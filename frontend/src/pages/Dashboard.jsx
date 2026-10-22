import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { Link } from 'react-router-dom'
import {
  FiArrowUpRight,
  FiBarChart2,
  FiBookOpen,
  FiCheck,
  FiChevronDown,
  FiFileText,
  FiGrid,
  FiLogOut,
  FiMap,
  FiMenu,
  FiMic,
  FiPlus,
  FiSettings,
  FiTarget,
  FiTrendingUp,
  FiUser,
  FiX,
} from 'react-icons/fi'
import { logoutUser } from '../apis/user.api'
import { auth } from '../utils/firebase'
import coinImage from '../assets/coins.jfif'

const scoreHistory = [
  { label: 'May 06', score: 58 },
  { label: 'May 10', score: 64 },
  { label: 'May 14', score: 61 },
  { label: 'May 18', score: 72 },
  { label: 'May 22', score: 69 },
  { label: 'May 26', score: 78 },
  { label: 'May 30', score: 84 },
]

const skillScores = [
  { label: 'Correctness', value: 86 },
  { label: 'Creativity', value: 72 },
  { label: 'Communication', value: 81 },
  { label: 'Clarity', value: 88 },
  { label: 'Problem solving', value: 76 },
  { label: 'Efficiency', value: 69 },
  { label: 'Detail', value: 74 },
  { label: 'Relevance', value: 91 },
]

const services = [
  { title: 'Resume builder', detail: 'Create a sharper story', icon: FiFileText },
  { title: 'Resume scorer', detail: 'See your role fit', icon: FiTarget },
  { title: 'Roadmap builder', detail: 'Plan your next move', icon: FiMap },
]

const activityMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const activityWeeks = Array.from({ length: 53 }, (_, weekIndex) => (
  Array.from({ length: 7 }, (_, dayIndex) => (weekIndex * 3 + dayIndex * 2) % 5 === 0 ? 0 : (weekIndex * 5 + dayIndex * 3) % 4)
))

const getActivityWindow = (windowOffset) => {
  const startDate = new Date(2025, 5 + windowOffset * 12, 1)
  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(startDate.getFullYear(), startDate.getMonth() + index, 1)
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1)
    const days = Math.round((nextMonth - date) / 86400000)
    return {
      label: `${activityMonthNames[date.getMonth()]} ${date.getFullYear()}`,
      start: date,
      days,
      weekStart: Math.floor(index * 53 / 12) + 1,
      weekSpan: Math.ceil((index + 1) * 53 / 12) - Math.floor(index * 53 / 12),
    }
  })

  return { months, startDate }
}

const linePoints = scoreHistory.map((point, index) => {
  const x = 18 + (index * 364) / (scoreHistory.length - 1)
  const y = 168 - ((point.score - 50) / 45) * 130
  return `${x},${y}`
}).join(' ')

const radarPoints = (scale) => skillScores.map((skill, index) => {
  const angle = (-Math.PI / 2) + (index * Math.PI * 2) / skillScores.length
  const radius = 108 * ((skill.value / 100) * scale)
  return `${150 + Math.cos(angle) * radius},${142 + Math.sin(angle) * radius}`
}).join(' ')

const Dashboard = ({ user, setUser }) => {
  const [loggingOut, setLoggingOut] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [range, setRange] = useState('30 days')
  const [activityWindowOffset, setActivityWindowOffset] = useState(0)

  const displayName = user?.name || 'Alex Morgan'
  const email = user?.email || 'alex.morgan@example.com'
  const initials = displayName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
  const activityWindow = getActivityWindow(activityWindowOffset)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logoutUser()
    } catch (error) {
      console.error('[auth] Logout failed:', error)
    } finally {
      try {
        await signOut(auth)
      } catch (error) {
        console.error('[auth] Firebase sign-out failed:', error)
      }
      setUser(null)
    }
  }

  return (
    <main className="dashboard-page">
      <aside className={`dashboard-sidebar${sidebarOpen ? ' is-open' : ''}`}>
        <div className="dashboard-brand"><span>V</span><strong>voxen</strong><small>AI INTERVIEW LAB</small></div>
        <button className="dashboard-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><FiX /></button>
        <nav className="dashboard-nav" aria-label="Dashboard navigation">
          <span className="dashboard-nav-label">Workspace</span>
          <a className="is-active" href="#overview" onClick={() => setSidebarOpen(false)}><FiGrid /> Overview</a>
          <a href="#interviews" onClick={() => setSidebarOpen(false)}><FiMic /> My interviews <b>12</b></a>
          <a href="#analytics" onClick={() => setSidebarOpen(false)}><FiBarChart2 /> Analytics</a>
          <span className="dashboard-nav-label dashboard-nav-label--spaced">Build with Voxen</span>
          {services.map(({ title, icon: Icon }) => title === 'Resume scorer'
            ? <Link to="/resumeScorer" key={title} onClick={() => setSidebarOpen(false)}><Icon /> {title}</Link>
            : <a href={`#${title.toLowerCase().replace(' ', '-')}`} key={title} onClick={() => setSidebarOpen(false)}><Icon /> {title}</a>)}
        </nav>
        <div className="dashboard-sidebar-bottom">
          <a href="#settings"><FiSettings /> Settings</a>
          <button className="dashboard-logout" onClick={handleLogout} disabled={loggingOut}><FiLogOut /> {loggingOut ? 'Signing out...' : 'Sign out'}</button>
        </div>
      </aside>

      {sidebarOpen && <button className="dashboard-sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}

      <section className="dashboard-content">
        <header className="dashboard-topbar">
          <button className="dashboard-menu-button" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><FiMenu /></button>
          <div className="dashboard-breadcrumb"><span>Workspace</span><b>/</b><strong>Overview</strong></div>
          <div className="dashboard-profile">
            <div className="dashboard-profile__avatar">{initials || <FiUser />}</div>
            <div><strong>{displayName}</strong><span>{email}</span></div>
            <FiChevronDown />
          </div>
        </header>

        <div className="dashboard-main" id="overview">
          <div className="dashboard-welcome">
            <div className="dashboard-welcome__copy">
              <span className="dashboard-eyebrow">Monday, June 02, 2025</span>
              <h1>Good morning, <em>{displayName.split(' ')[0]}.</em></h1>
              <p>Your preparation is gaining momentum. Here is your progress at a glance.</p>
            </div>
            <div className="dashboard-launch-card">
              <div className="dashboard-launch-card__coins"><img className="dashboard-coin-image" src={coinImage} alt="" aria-hidden="true" /><span><small>Interview coins</small><strong>24</strong></span></div>
              <button className="dashboard-primary-button"><FiPlus /> Create interview <small>· 50 coins</small></button>
            </div>
          </div>

          <section className="dashboard-stats" aria-label="Interview summary">
            <article><span>Total interviews <FiTrendingUp /></span><strong>12</strong><small><b>+3</b> this month</small></article>
            <article><span>Average score <FiTrendingUp /></span><strong>78<span>/100</span></strong><small><b>+12%</b> from last month</small></article>
            <article><span>Best performance <FiTrendingUp /></span><strong>91<span>/100</span></strong><small>System design interview</small></article>
          </section>

          <div className="dashboard-grid dashboard-grid--primary">
            <section className="dashboard-panel score-panel" id="analytics">
              <div className="dashboard-panel-heading"><div><span className="dashboard-section-label">Performance trend</span><h2>Your score is moving up</h2></div><select value={range} onChange={(event) => setRange(event.target.value)} aria-label="Select score range"><option>30 days</option><option>90 days</option><option>All time</option></select></div>
              <div className="score-chart">
                <div className="score-chart__axis"><span>100</span><span>75</span><span>50</span><span>25</span></div>
                <svg viewBox="0 0 400 190" role="img" aria-label="Interview score trend rising from 58 to 84">
                  <defs><linearGradient id="score-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#c8a24a" stopOpacity=".24" /><stop offset="100%" stopColor="#c8a24a" stopOpacity="0" /></linearGradient></defs>
                  <line x1="18" y1="38" x2="382" y2="38" /><line x1="18" y1="103" x2="382" y2="103" /><line x1="18" y1="168" x2="382" y2="168" />
                  <polygon points={`18,168 ${linePoints} 382,168`} fill="url(#score-fill)" />
                  <polyline points={linePoints} fill="none" stroke="#c8a24a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  {scoreHistory.map((point, index) => <circle key={point.label} cx={18 + (index * 364) / (scoreHistory.length - 1)} cy={168 - ((point.score - 50) / 45) * 130} r="4" fill="#17171b" stroke="#c8a24a" strokeWidth="2" />)}
                </svg>
                <div className="score-chart__labels">{scoreHistory.map((point) => <span key={point.label}>{point.label}</span>)}</div>
              </div>
              <div className="score-chart__callout"><FiTrendingUp /><span>You're outperforming <b>68%</b> of candidates at your experience level.</span></div>
            </section>

            <section className="dashboard-panel readiness-panel">
              <div className="dashboard-panel-heading"><div><span className="dashboard-section-label">Readiness score</span><h2>Interview profile</h2></div><button className="dashboard-icon-button" aria-label="View readiness details"><FiArrowUpRight /></button></div>
              <div className="readiness-content">
                <div className="radar-chart">
                  <svg viewBox="0 0 300 284" role="img" aria-label="Radar chart showing interview skills">
                    {[1, .75, .5, .25].map((scale) => <polygon key={scale} points={radarPoints(scale)} fill="none" stroke="#d6d1c4" strokeWidth="1" />)}
                    {skillScores.map((_, index) => { const angle = (-Math.PI / 2) + (index * Math.PI * 2) / skillScores.length; return <line key={index} x1="150" y1="142" x2={150 + Math.cos(angle) * 108} y2={142 + Math.sin(angle) * 108} stroke="#ded9cd" strokeWidth="1" /> })}
                    <polygon points={radarPoints(1)} fill="#c8a24a" fillOpacity=".3" stroke="#a27b26" strokeWidth="2" />
                  </svg>
                  {skillScores.map((skill, index) => <span className={`radar-label radar-label--${index + 1}`} key={skill.label}>{skill.label}</span>)}
                </div>
                <div className="readiness-score"><strong>78</strong><span>/100</span><small>Strong foundation</small></div>
              </div>
            </section>
          </div>

          <div className="dashboard-grid dashboard-grid--secondary">
            <section className="dashboard-panel activity-panel" id="interviews">
              <div className="activity-panel-topline">
                <div><h2><strong>1,078</strong> interviews <span>in the past one year</span></h2><p>Keep showing up. Consistency compounds.</p></div>
                <div className="activity-summary"><span><b>214</b> total active days</span><span><b>89</b> max streak</span><select value={activityWindowOffset} onChange={(event) => setActivityWindowOffset(Number(event.target.value))} aria-label="Select activity period"><option value="0">Current</option><option value="-1">Previous year</option><option value="-2">2 years ago</option></select></div>
              </div>
              <div className="activity-chart"><div className="activity-body"><div className="activity-days"><span>Mon</span><span>Wed</span><span>Fri</span></div><div className="activity-grid">{activityWindow.months.map((month, monthIndex) => <div className="activity-month-group" key={month.label}>{activityWeeks.slice(month.weekStart - 1, month.weekStart - 1 + month.weekSpan).flatMap((week, weekIndex) => week.map((level, dayIndex) => { const date = new Date(activityWindow.startDate); date.setDate(date.getDate() + (month.weekStart - 1 + weekIndex) * 7 + dayIndex); const dateLabel = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); const interviews = level; return <i className={`activity-cell activity-cell--${level}`} key={`${monthIndex}-${weekIndex}-${dayIndex}`} title={`${interviews} interview${interviews === 1 ? '' : 's'} on ${dateLabel}`} aria-label={`${interviews} interview${interviews === 1 ? '' : 's'} on ${dateLabel}`} /> }))}</div>)}</div></div><div className="activity-months">{activityWindow.months.map((month) => <span key={month.label}>{month.label.split(' ')[0]}</span>)}</div><div className="activity-legend"><span>Less</span><i className="activity-cell activity-cell--0" /><i className="activity-cell activity-cell--1" /><i className="activity-cell activity-cell--2" /><i className="activity-cell activity-cell--3" /><span>More</span></div></div>
              <div className="activity-footer"><FiCheck /> You've practiced 4 days this week. Keep the streak going.</div>
            </section>

            <section className="dashboard-panel services-panel">
              <div className="dashboard-panel-heading"><div><span className="dashboard-section-label">Your toolkit</span><h2>Build with Voxen</h2></div></div>
              <div className="dashboard-service-list">{services.map(({ title, detail, icon: Icon }) => <a href={`#${title.toLowerCase().replace(' ', '-')}`} key={title}><span className="dashboard-service-icon"><Icon /></span><span><strong>{title}</strong><small>{detail}</small></span><FiChevronDown /></a>)}</div>
            </section>
          </div>

          <section className="dashboard-next-step"><div className="dashboard-next-step__icon"><FiBookOpen /></div><div><span className="dashboard-section-label">Recommended next step</span><h2>Practice your system design story</h2><p>Your clarity score is strong. A focused system design session could take your overall readiness above 82.</p></div><button className="dashboard-secondary-button">Start session <FiArrowUpRight /></button></section>
        </div>
      </section>
    </main>
  )
}

export default Dashboard
