import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0015 0%, #1a0030 50%, #0a0015 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{
          fontSize: '64px',
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #ff69b4, #9b59b6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px'
        }}>
          Virtual Hub
        </h1>
        <p style={{ fontSize: '20px', color: '#cc99ff', marginBottom: '8px' }}>
          A Multi-Disciplinary Virtual Engineering Lab Platform
        </p>
        <p style={{ fontSize: '16px', color: '#888', maxWidth: '600px', lineHeight: '1.6' }}>
          Practice engineering concepts safely, anytime, anywhere —
          with real-time AI guidance and no risk of damaging expensive hardware.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        maxWidth: '900px',
        width: '100%',
        marginBottom: '48px'
      }}>
        {[
          {
            title: 'Engineering & IoT Lab',
            desc: 'Simulate Arduino, ESP32, and electronics circuits safely with real-time AI feedback.',
            icon: '⚡',
            path: '/lab/iot',
            color: '#ff69b4'
          },
          {
            title: 'Network & Cyber Lab',
            desc: 'Build router and switch topologies and practice cyber defense scenarios.',
            icon: '🌐',
            path: '/lab/network',
            color: '#9b59b6'
          },
          {
            title: 'Robotics & Automation Lab',
            desc: 'Simulate robotic arms and path planning with kinematic visualization.',
            icon: '🤖',
            path: '/lab/robotics',
            color: '#e91e8c'
          }
        ].map((lab) => (
          <div
            key={lab.path}
            onClick={() => navigate(lab.path)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${lab.color}44`,
              borderRadius: '16px',
              padding: '32px 24px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.background = `${lab.color}22`
              ;(e.currentTarget as HTMLDivElement).style.borderColor = lab.color
              ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)'
              ;(e.currentTarget as HTMLDivElement).style.borderColor = `${lab.color}44`
              ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>{lab.icon}</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: lab.color, marginBottom: '12px' }}>
              {lab.title}
            </h3>
            <p style={{ fontSize: '14px', color: '#aaa', lineHeight: '1.6' }}>{lab.desc}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/dashboard')}
        style={{
          background: 'linear-gradient(90deg, #ff69b4, #9b59b6)',
          border: 'none',
          borderRadius: '12px',
          padding: '16px 48px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        View My Dashboard →
      </button>

      <p style={{ marginTop: '48px', color: '#555', fontSize: '14px' }}>
        ctrl+innovate • JSYP Hackathon 2026
      </p>
    </div>
  )
}