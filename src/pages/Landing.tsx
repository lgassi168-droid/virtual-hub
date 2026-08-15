import { useNavigate } from 'react-router-dom'
import './Landing.css'

const LABS = [
  {
    num: '01',
    title: 'Engineering & IoT Lab',
    desc: 'Simulate Arduino, ESP32, and electronics circuits safely with real-time AI feedback.',
    icon: '⚡',
    path: '/lab/iot',
    featured: true,
  },
  {
    num: '02',
    title: 'Network & Cyber Lab',
    desc: 'Build router and switch topologies and practice cyber defense scenarios.',
    icon: '🌐',
    path: '/lab/network',
  },
  {
    num: '03',
    title: 'Robotics & Automation Lab',
    desc: 'Simulate robotic arms and path planning with kinematic visualization.',
    icon: '🤖',
    path: '/lab/robotics',
  },
  {
    num: '04',
    title: 'Assembly Lab',
    desc: 'Write and simulate 8086 Assembly code with real-time CPU register visualization.',
    icon: '💻',
    path: '/lab/assembly',
  },
  {
    num: '05',
    title: 'Circuit Lab',
    desc: 'Build and simulate electrical circuits with drag & drop components and real-time calculations.',
    icon: '🔌',
    path: '/lab/circuit',
  },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <>
    <main className="page">
      <section className="mission">
        <p className="eyebrow">FOR STUDENTS, BY STUDENTS</p>
        <h1 className="headline display">Virtual Hub</h1>
        <p>
          We know the fear of breaking equipment and falling behind. Virtual Hub gives you a calm,
          judgment-free space to practice, get it wrong, and actually learn — with real-time AI
          guidance, whenever you're ready.
        </p>
        <button className="btn-cta" onClick={() => navigate('/dashboard')}>
          View My Dashboard →
        </button>
      </section>

      <section className="labs">
        <h2 className="display">Labs &amp; Experiments</h2>
        <p className="sub">Pick up where you left off</p>

        {LABS.map((lab) => (
          <button
            key={lab.path}
            className={`lab-row${lab.featured ? ' featured' : ''}`}
            onClick={() => navigate(lab.path)}
          >
            <span className="lab-num">{lab.num}</span>
            <span className="lab-icon">{lab.icon}</span>
            <span>
              <p className="lab-title">{lab.title}</p>
              <p className="lab-desc">{lab.desc}</p>
              {lab.featured && <span className="lab-continue">CONTINUE →</span>}
            </span>
            <span className="lab-arrow">›</span>
          </button>
        ))}

        <button className="view-all" onClick={() => navigate('/dashboard')}>
          <span className="plus-circle">+</span>
          <span>
            <p className="vt">View All Labs</p>
            <p className="vs">See the full catalog</p>
          </span>
        </button>
      </section>
    </main>

    <footer className="footer-note">ctrl+innovate • JSYP Hackathon 2026</footer>
    </>
  )
}
