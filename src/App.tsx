import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { Auth } from './components/Auth'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import IoTLab from './pages/IoTLab'
import NetworkLab from './pages/NetworkLab'
import RoboticsLab from './pages/RoboticsLab'
import ChangePassword from './pages/ChangePassword'
import EditProfile from './pages/EditProfile'
import Settings from './pages/Settings'

function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{
        background: '#0a0015', color: '#ff69b4',
        height: '100vh', display: 'flex',
        justifyContent: 'center', alignItems: 'center',
        fontSize: '24px', fontFamily: 'Poppins, sans-serif'
      }}>
        Loading...
      </div>
    )
  }

  if (!session) {
    return <Auth />
  }

  return (
    <Router>
      {/* Navbar */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,105,180,0.3)',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Link to="/" style={{ color: '#ff69b4', fontWeight: 'bold', fontSize: '20px', textDecoration: 'none' }}>
          ⚡ Virtual Hub
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/settings" style={{ color: '#aaa', fontSize: '14px', textDecoration: 'none' }}>
            ⚙️ Settings
          </Link>
          <span style={{ color: '#aaa', fontSize: '14px' }}>
            👤 {session.user.email}
          </span>
          <button
            onClick={() => supabase.auth.signOut()}
            style={{
              background: 'linear-gradient(90deg, #ff69b4, #e91e8c)',
              border: 'none', borderRadius: '20px',
              padding: '8px 20px', color: 'white',
              cursor: 'pointer', fontSize: '14px', fontWeight: 'bold'
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lab/iot" element={<IoTLab />} />
        <Route path="/lab/network" element={<NetworkLab />} />
        <Route path="/lab/robotics" element={<RoboticsLab />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  )
}

export default App