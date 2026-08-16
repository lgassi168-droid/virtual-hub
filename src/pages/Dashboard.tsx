import { Link } from 'react-router-dom'

const labs = [
  {
    title: 'Engineering & IoT Lab',
    path: '/lab/iot',
    icon: '⚡',
    description: 'Simulate embedded systems and real-world electronics safely.',
  },
  {
    title: 'Network & Cyber Lab',
    path: '/lab/network',
    icon: '🌐',
    description: 'Practice routing, switching, and defense scenarios in a controlled environment.',
  },
  {
    title: 'Robotics Lab',
    path: '/lab/robotics',
    icon: '🤖',
    description: 'Build robot logic and explore automation with interactive exercises.',
  },
  {
    title: 'Assembly Lab',
    path: '/lab/assembly',
    icon: '💻',
    description: 'Write and test assembly code while reading live CPU state.',
  },
  {
    title: 'Circuit Lab',
    path: '/lab/circuit',
    icon: '🔌',
    description: 'Design circuit layouts and test electrical behavior with visual components.',
  },
]

export default function Dashboard() {
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(480px 480px at 10% 10%, rgba(255,79,163,0.18), transparent 70%), linear-gradient(160deg, #190d2a 0%, #120a1d 50%, #0a0613 100%)', color: '#f3ebff', fontFamily: 'Poppins, "Segoe UI", sans-serif' }}>
      <style>{`
        * { box-sizing: border-box; }
        .dashboard-page { padding: 36px 28px 54px; }
        .dashboard-shell { max-width: 1200px; margin: 0 auto; }
        .dashboard-header {
          display: flex; align-items: center; justify-content: space-between;
          gap: 20px; padding: 0 4px 22px; border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .brand { font-size: 28px; font-weight: 800; letter-spacing: 0.04em; }
        .brand span { background: linear-gradient(90deg, #ff5fa8, #a855f7); -webkit-background-clip: text; color: transparent; }
        .nav-link {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 11px 18px; border-radius: 999px; color: #fff; text-decoration: none;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
        }
        .hero {
          display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 24px; margin-top: 28px;
        }
        .panel {
          background: rgba(26, 14, 39, 0.82); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px; box-shadow: 0 18px 50px rgba(0,0,0,0.22);
        }
        .hero-copy { padding: 28px; }
        .eyebrow { margin: 0 0 12px; font-size: 12px; letter-spacing: 0.2em; color: #ff98ce; font-weight: 700; text-transform: uppercase; }
        .hero-title { margin: 0; font-size: clamp(32px, 4vw, 52px); line-height: 1.05; }
        .hero-title span { background: linear-gradient(135deg, #ff5fa8, #c77ef2, #8b5cf6); -webkit-background-clip: text; color: transparent; }
        .hero-text { margin: 18px 0 0; color: #d9c8ef; line-height: 1.7; max-width: 620px; }
        .summary-box { padding: 24px; display: flex; flex-direction: column; gap: 18px; }
        .summary-card {
          background: linear-gradient(135deg, rgba(255,95,168,0.14), rgba(139,92,246,0.12));
          border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 18px;
        }
        .summary-label { font-size: 12px; letter-spacing: 0.12em; color: #bca4de; text-transform: uppercase; }
        .summary-value { margin-top: 8px; font-size: 28px; font-weight: 800; }
        .lab-grid { margin-top: 30px; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; }
        .lab-card {
          display: block; padding: 22px; text-decoration: none; color: inherit;
          background: rgba(20, 11, 30, 0.86); border: 1px solid rgba(255,255,255,0.08); border-radius: 22px;
          transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .lab-card:hover { transform: translateY(-2px); border-color: rgba(255,95,168,0.5); box-shadow: 0 18px 38px rgba(255,95,168,0.08); }
        .lab-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
        .lab-icon { width: 46px; height: 46px; display: flex; align-items: center; justify-content: center; border-radius: 14px; background: linear-gradient(135deg, rgba(255,95,168,0.22), rgba(139,92,246,0.22)); font-size: 22px; }
        .badge { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #ff9bc0; }
        .lab-title { margin: 0 0 10px; font-size: 20px; font-weight: 700; }
        .lab-description { margin: 0; color: #c9b9e1; line-height: 1.6; }
        .lab-footer { margin-top: 18px; color: #ff9bc0; font-weight: 700; }
        @media (max-width: 760px) {
          .hero { grid-template-columns: 1fr; }
          .dashboard-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="dashboard-page">
        <div className="dashboard-shell">
          <header className="dashboard-header">
            <div className="brand"><span>Virtual Hub</span> Dashboard</div>
            <Link className="nav-link" to="/">Back to Home</Link>
          </header>

          <section className="hero">
            <div className="panel hero-copy">
              <p className="eyebrow">Welcome back</p>
              <h1 className="hero-title"><span>Learn by doing.</span></h1>
              <p className="hero-text">
                Pick up a lab, explore the system, and continue building real-world engineering confidence through guided practice.
              </p>
            </div>

            <div className="panel summary-box">
              <div className="summary-card">
                <div className="summary-label">Active labs</div>
                <div className="summary-value">5</div>
              </div>
              <div className="summary-card">
                <div className="summary-label">Current focus</div>
                <div className="summary-value">IoT</div>
              </div>
            </div>
          </section>

          <section className="lab-grid">
            {labs.map((lab) => (
              <Link key={lab.path} to={lab.path} className="lab-card">
                <div className="lab-head">
                  <div className="lab-icon">{lab.icon}</div>
                  <div className="badge">Open</div>
                </div>
                <h2 className="lab-title">{lab.title}</h2>
                <p className="lab-description">{lab.description}</p>
                <div className="lab-footer">Continue →</div>
              </Link>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}
