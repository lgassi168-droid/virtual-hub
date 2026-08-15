import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { Auth } from './components/Auth'
import AIAgent from './components/AIAgent'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import EmbeddedLab from './pages/EmbeddedLab'
import NetworkLab from './pages/NetworkLab'
import RoboticsLab from './pages/RoboticsLab'
import ChangePassword from './pages/ChangePassword'
import EditProfile from './pages/EditProfile'
import Settings from './pages/Settings'
import AssemblyLab from './pages/AssemblyLab'
import CircuitLab from './pages/CircuitLab'
import './App.css'

function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLElement>(null)

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

  useEffect(() => {
    if (!menuOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        !hamburgerRef.current?.contains(e.target as Node) &&
        !menuRef.current?.contains(e.target as Node)
      ) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [menuOpen])

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
      <header className="topbar">
        <div className="topbar-left">
          <button
            ref={hamburgerRef}
            className={`hamburger${menuOpen ? ' open' : ''}`}
            aria-label="Menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span></span><span></span><span></span>
          </button>
          <Link to="/" className="logo display">
            <span className="bolt">⚡</span>
            <span className="brand">Virtual Hub</span>
          </Link>
        </div>
        <div className="topbar-right">
          <div className="avatar">{session.user.email[0]}</div>
          <span className="user-email">{session.user.email}</span>
          <button className="btn-signout" onClick={() => supabase.auth.signOut()}>
            Sign Out
          </button>
        </div>
      </header>

      <nav ref={menuRef} className={`menu-panel${menuOpen ? ' open' : ''}`}>
        <Link to="/settings" onClick={() => setMenuOpen(false)}>⚙️ Settings</Link>
        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
        <Link to="/" onClick={() => setMenuOpen(false)}>🧪 All Labs</Link>
        <a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false) }}>❓ Help &amp; Support</a>
      </nav>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lab/iot" element={<EmbeddedLab />} />
        <Route path="/lab/network" element={<NetworkLab />} />
        <Route path="/lab/robotics" element={<RoboticsLab />} />
        <Route path="/lab/assembly" element={<AssemblyLab />} />
        <Route path="/lab/circuit" element={<CircuitLab />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>

      <AIAgent />
    </Router>
  )
}

export default App
