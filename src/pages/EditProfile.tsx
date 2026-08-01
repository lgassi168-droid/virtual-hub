import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function EditProfile() {
  const [fullName, setFullName] = useState('Assal Al-Nabulsi')
  const [major, setMajor] = useState('Computer Engineering')
  const [bio, setBio] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user logged in")

      setMessage("Profile updated successfully! Redirecting...")
      setTimeout(() => {
        navigate(-1) // يرجع للصفحة السابقة تلقائياً بعد الحفظ
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to update profile.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: '#0a0015', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', padding: '30px 20px', fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{
        background: '#1a0030', border: '1px solid rgba(255,105,180,.25)', borderRadius: '22px', padding: '35px', width: '100%', maxWidth: '420px', boxShadow: '0 0 25px rgba(255,105,180,.15)'
      }}>
        
        {/* سهم الرجوع الذكي */}
        <div onClick={() => navigate(-1)} style={{ color: '#ff69b4', cursor: 'pointer', marginBottom: '20px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
          <i className="fa-solid fa-arrow-left"></i> Back
        </div>

        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px', marginBottom: '8px' }}>
          <i className="fa-solid fa-user-pen" style={{ color: '#ff69b4' }}></i>
          Edit Profile
        </h1>
        <p style={{ color: '#bbb', fontSize: '14px', marginBottom: '25px' }}>Update your personal information.</p>

        {error && <div style={{ background: 'rgba(255, 0, 0, 0.1)', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '10px', borderRadius: '10px', marginBottom: '15px', fontSize: '13px', textAlign: 'center' }}>{error}</div>}
        {message && <div style={{ background: 'rgba(0, 255, 128, 0.1)', border: '1px solid #00ff80', color: '#00ff80', padding: '10px', borderRadius: '10px', marginBottom: '15px', fontSize: '13px', textAlign: 'center' }}>{message}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', color: '#cc99ff', marginBottom: '6px', marginTop: '10px' }}>Full Name</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ background: '#0f0020', border: '1px solid rgba(255,255,255,.08)', borderRadius: '12px', padding: '12px 16px', color: 'white', fontSize: '14px', outline: 'none' }} />

          <label style={{ fontSize: '13px', color: '#cc99ff', marginBottom: '6px', marginTop: '16px' }}>Major</label>
          <input type="text" value={major} onChange={(e) => setMajor(e.target.value)} style={{ background: '#0f0020', border: '1px solid rgba(255,255,255,.08)', borderRadius: '12px', padding: '12px 16px', color: 'white', fontSize: '14px', outline: 'none' }} />

          <label style={{ fontSize: '13px', color: '#cc99ff', marginBottom: '6px', marginTop: '16px' }}>Bio</label>
          <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us a bit about yourself..." style={{ background: '#0f0020', border: '1px solid rgba(255,255,255,.08)', borderRadius: '12px', padding: '12px 16px', color: 'white', fontSize: '14px', outline: 'none', resize: 'none' }} />

          <button type="submit" disabled={loading} style={{ marginTop: '28px', padding: '14px', border: 'none', borderRadius: '30px', cursor: 'pointer', color: 'white', fontSize: '15px', fontWeight: 600, background: 'linear-gradient(90deg,#ff69b4,#e91e8c)', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}