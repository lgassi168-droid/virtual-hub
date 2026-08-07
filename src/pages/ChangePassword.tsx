import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match!")
      return
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.")
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !user.email) throw new Error("No authenticated user found.")

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })
      if (signInError) throw new Error("Current password is incorrect.")

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
      if (updateError) throw updateError

      setMessage("Password updated successfully! Redirecting...")
      setTimeout(() => navigate(-1), 2000)

    } catch (err: any) {
      setError(err.message || "Failed to update password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#0a0015', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: "'Poppins', sans-serif", color: 'white', padding: '30px', boxSizing: 'border-box' }}>
      <div style={{ width: '500px', background: '#1a0030', borderRadius: '25px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,.35)' }}>
        
        <div onClick={() => navigate(-1)} style={{ color: '#ff69b4', cursor: 'pointer', marginBottom: '25px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
          ← Back
        </div>

        <h1 style={{ color: 'white', marginBottom: '10px', fontSize: '24px' }}>
          🔒 Change Password
        </h1>
        <p style={{ color: '#cfcfcf', marginBottom: '30px', lineHeight: '1.6', fontSize: '14px' }}>
          Update your password to keep your account secure.
        </p>

        {error && (
          <div style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}
        {message && (
          <div style={{ background: 'rgba(0,255,128,0.1)', border: '1px solid #00ff80', color: '#00ff80', padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Current Password', value: currentPassword, setter: setCurrentPassword, placeholder: 'Enter current password' },
            { label: 'New Password', value: newPassword, setter: setNewPassword, placeholder: 'Enter new password' },
            { label: 'Confirm Password', value: confirmPassword, setter: setConfirmPassword, placeholder: 'Confirm new password' },
          ].map(field => (
            <div key={field.label} style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <label style={{ marginBottom: '8px', color: 'white', fontWeight: 500 }}>{field.label}</label>
              <input
                type="password"
                placeholder={field.placeholder}
                value={field.value}
                onChange={e => field.setter(e.target.value)}
                required
                style={{ padding: '14px', border: '2px solid transparent', outline: 'none', borderRadius: '12px', background: '#0f0020', color: 'white', fontSize: '15px' }}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '15px', border: 'none', borderRadius: '30px', cursor: 'pointer', background: 'linear-gradient(90deg,#ff69b4,#9b59b6)', color: 'white', fontSize: '17px', fontWeight: 600, marginTop: '10px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}