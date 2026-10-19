import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FiArrowUpRight, FiCheck, FiChevronDown, FiFileText, FiMap, FiMenu, FiMessageSquare, FiMic, FiX } from 'react-icons/fi'
import LoginModel from '../components/LoginModel'

const Home = ({ user, setUser }) => {
  const [loginOpen, setLoginOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('modal-open', loginOpen || menuOpen)
    return () => document.body.classList.remove('modal-open')
  }, [loginOpen, menuOpen])

  const openLogin = () => {
    setMenuOpen(false)
    setLoginOpen(true)
  }

  return (
    <main className="home-page aura-shell">
      <nav className="site-nav" aria-label="Main navigation">
        <a className="brand-mark" href="/" aria-label="Voxen home">
          <span className="brand-mark__symbol">V</span>
          <span>voxen</span>
        </a>
        <div className="nav-links">
          <a href="#method">How it works</a>
          <a href="#signal">For candidates</a>
          <a href="#about">About</a>
        </div>
        <button className="nav-login" onClick={openLogin}>{user ? `Hi, ${user.name || 'there'}` : 'Log in'} <FiArrowUpRight /></button>
        <button className="nav-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen}><FiMenu /></button>
      </nav>
      <div className="aura-caption aura-caption--top">Grainy gradient<br />texture</div>
      <div className="aura-caption aura-caption--left">AI practice file</div>
      <div className="aura-caption aura-caption--right">Voxen / 01</div>

      <section className="hero aura-hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            AI interview practice / 01
          </motion.p>
          <motion.h1 id="hero-title" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.7 }}>
            Meet the version of you that gets <em>the offer.</em>
          </motion.h1>
          <motion.p className="hero-lede" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.7 }}>
            Realistic AI interviews, useful feedback, and a clear next move. Build the confidence to think out loud when it matters.
          </motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.7 }}>
            <button className="primary-button" onClick={openLogin}>Start practicing <FiArrowUpRight /></button>
            <a className="text-link" href="#method">See the method <FiChevronDown /></a>
          </motion.div>
          <div className="hero-note"><FiCheck /> No credit card. Start with one interview.</div>
        </div>

        <motion.div className="interview-stage aura-stage" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18, duration: 0.9 }}>
          <div className="stage-topline"><span>LIVE PRACTICE</span><span className="stage-status"><i /> recording</span></div>
          <div className="stage-portrait" role="img" aria-label="Abstract interview portrait" />
          <div className="stage-question">“Tell me about a time you changed your mind.”</div>
          <div className="stage-footer"><span className="stage-time">00:42</span><span className="stage-wave"><i /><i /><i /><i /><i /><i /><i /></span><span className="stage-signal">signal / clear</span></div>
          <div className="floating-feedback"><span>feedback after</span><strong>every answer</strong></div>
        </motion.div>
      </section>

      <section className="proof-strip" id="signal">
        <span>Built for the moments that decide</span>
        <div className="proof-metrics" aria-label="Voxen platform metrics">
          <b><strong>12k+</strong> practice sessions</b>
          <b><strong>4.9/5</strong> candidate rating</b>
          <b><strong>24/7</strong> private practice</b>
        </div>
      </section>
      <section className="achievement-section" aria-labelledby="achievement-title">
        <div className="achievement-heading">
          <span>02 — Your momentum</span>
          <p id="achievement-title">Small practice wins become <em>career-changing confidence.</em></p>
        </div>
        <div className="achievement-grid">
          <article className="achievement-card achievement-card--featured">
            <span className="achievement-card__number">01</span>
            <strong>12k+</strong>
            <p>practice sessions completed by candidates building sharper answers.</p>
          </article>
          <article className="achievement-card">
            <span className="achievement-card__number">02</span>
            <strong>4.9/5</strong>
            <p>average candidate rating for focused, useful feedback.</p>
          </article>
          <article className="achievement-card">
            <span className="achievement-card__number">03</span>
            <strong>24/7</strong>
            <p>private access to a practice room whenever momentum strikes.</p>
          </article>
        </div>
      </section>
      <section className="method-line" id="method"><span>01 — Your practice room</span><p>Less memorizing. More thinking on your feet.</p></section>
      <section className="agents-section" id="agents" aria-labelledby="agents-title">
        <div className="agents-heading">
          <span>04 — Your AI interview team</span>
          <div>
            <h2 id="agents-title">Four agents. One clearer path to <em>the offer.</em></h2>
            <p>Each agent handles a different part of your preparation, so every practice session turns into a useful next step.</p>
          </div>
        </div>
        <div className="agents-grid">
          <article className="agent-card">
            <div className="agent-card__topline"><FiFileText aria-hidden="true" /><span>Agent 01</span></div>
            <h3>Resume agent</h3>
            <p>Turn your experience into a focused story. Get role-specific suggestions that make your resume clearer, stronger, and easier to defend in an interview.</p>
            <span className="agent-card__result">Sharper positioning</span>
          </article>
          <article className="agent-card">
            <div className="agent-card__topline"><FiMic aria-hidden="true" /><span>Agent 02</span></div>
            <h3>Interview agent</h3>
            <p>Practice realistic conversations tailored to your role. Handle behavioral, technical, and follow-up questions in a private room available anytime.</p>
            <span className="agent-card__result">Realistic practice</span>
          </article>
          <article className="agent-card">
            <div className="agent-card__topline"><FiMessageSquare aria-hidden="true" /><span>Agent 03</span></div>
            <h3>Feedback agent</h3>
            <p>See what is working and what is holding your answer back. Receive specific signals on clarity, structure, confidence, and communication.</p>
            <span className="agent-card__result">Actionable signals</span>
          </article>
          <article className="agent-card">
            <div className="agent-card__topline"><FiMap aria-hidden="true" /><span>Agent 04</span></div>
            <h3>Roadmap agent</h3>
            <p>Know what to do next. Build a practical preparation plan from your goals, performance, and gaps, with progress you can see over time.</p>
            <span className="agent-card__result">A clear next move</span>
          </article>
        </div>
      </section>
      <section className="about-section" id="about" aria-labelledby="about-title">
        <span>03 — About Voxen</span>
        <div>
          <h2 id="about-title">A quieter way to get <em>ready.</em></h2>
          <p>Voxen turns interview preparation into a repeatable ritual: realistic conversations, honest signals, and a clear next step after every answer.</p>
        </div>
      </section>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div className="menu-backdrop" onClick={() => setMenuOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.aside className="side-menu" aria-label="Mobile navigation" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
              <div className="side-menu__topline"><span>Explore Voxen</span><button className="modal-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><FiX /></button></div>
              <div className="side-menu__links">
                <a href="#method" onClick={() => setMenuOpen(false)}>How it works <FiArrowUpRight /></a>
                <a href="#signal" onClick={() => setMenuOpen(false)}>For candidates <FiArrowUpRight /></a>
                <a href="#about" onClick={() => setMenuOpen(false)}>About <FiArrowUpRight /></a>
              </div>
              <div className="side-menu__footer">
                <p>{user ? 'Your practice room is ready.' : 'Practice with privacy built in.'}</p>
                <button className="primary-button" onClick={openLogin}>Log in <FiArrowUpRight /></button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>{loginOpen && <LoginModel onClose={() => setLoginOpen(false)} setUser={setUser} />}</AnimatePresence>
    </main>
  )
}

export default Home
