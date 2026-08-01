import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (isSignUp) {
      if (password !== confirmPassword) {
        alert('Passwords do not match!')
        setLoading(false)
        return
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      })
      if (error) alert(error.message)
      else alert('Account created! Please check your email.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert(error.message)
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      })
      if (error) alert(error.message)
    } catch (err: any) {
      alert(err.message || 'Google sign-in failed')
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; font-family: 'Poppins', sans-serif; }
        .auth-input { width: 100%; height: 55px; border: none; outline: none; border-radius: 40px; padding: 0 20px; margin-bottom: 18px; font-size: 16px; background: #fff; color: #333; display: block; }
        .auth-btn { width: 100%; height: 55px; border: none; border-radius: 40px; margin-top: 10px; background: linear-gradient(90deg,#ff69b4,#e91e8c); color: white; font-size: 18px; font-weight: 600; cursor: pointer; transition: .3s; }
        .auth-btn:hover { transform: scale(1.03); box-shadow: 0 0 20px #ff69b4; }
        .auth-btn-google { background: transparent !important; border: 2px solid #9b59b6 !important; margin-top: 10px; }
        .auth-btn-google:hover { background: #9b59b6 !important; }
        @keyframes float { 0% { transform: translateY(0); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0); } }
        .robot-img { width: 350px; animation: float 3s ease-in-out infinite; }
        @media(max-width:900px) { .auth-container { flex-direction: column !important; } .robot-img { width: 200px !important; } .auth-form { width: 100% !important; } }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#0a0015,#1a0030,#0f0020)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        overflow: 'hidden', position: 'relative'
      }}>
        {/* Glow effects */}
        <div style={{ position: 'absolute', width: '450px', height: '450px', background: '#ff69b4', borderRadius: '50%', filter: 'blur(170px)', top: '-120px', right: '-120px', opacity: .35 }} />
        <div style={{ position: 'absolute', width: '450px', height: '450px', background: '#9b59b6', borderRadius: '50%', filter: 'blur(170px)', bottom: '-120px', left: '-120px', opacity: .35 }} />

        {/* Container */}
        <div className="auth-container" style={{
          width: '1050px', maxWidth: '90%',
          background: 'rgba(255,255,255,.05)',
          border: '2px solid rgba(255,105,180,.4)',
          borderRadius: '30px', backdropFilter: 'blur(12px)',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '50px',
          boxShadow: '0 0 40px rgba(255,105,180,.3)',
          position: 'relative', zIndex: 2, gap: '30px'
        }}>

          {/* Form */}
          <div className="auth-form" style={{ width: '420px' }}>
            <h1 style={{ color: '#fff', fontSize: '48px' }}>
              {isSignUp ? 'Create ' : 'Welcome '}
              <span style={{ color: '#ff69b4' }}>{isSignUp ? 'Account' : 'Back'}</span>
            </h1>
            <p style={{ color: '#ddd', margin: '15px 0 25px' }}>
              {isSignUp ? 'Join us and start your journey' : 'Login to continue your journey'}
            </p>

            {/* تم وضع الحقول وزر الإرسال داخل form لضمان عمل زر Enter */}
            <form onSubmit={handleAuth}>
              {isSignUp && (
                <input className="auth-input" type="text" placeholder="Full Name" required
                  value={fullName} onChange={e => setFullName(e.target.value)} />
              )}

              <input className="auth-input" type="email" placeholder="Email" required
                value={email} onChange={e => setEmail(e.target.value)} />

              <input className="auth-input" type="password" placeholder="Password" required
                value={password} onChange={e => setPassword(e.target.value)} />

              {isSignUp && (
                <input className="auth-input" type="password" placeholder="Confirm Password" required
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              )}

              {!isSignUp && (
                <div style={{ marginBottom: '10px' }}>
                  <a href="#" style={{ color: '#ff69b4', textDecoration: 'none', fontSize: '14px' }}>
                    Forgot Password?
                  </a>
                </div>
              )}

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Login'}
              </button>
            </form>

            <div style={{ textAlign: 'center', color: 'white', margin: '15px 0' }}>OR</div>

            {/* زر جوجل المفعل */}
            <button type="button" className="auth-btn auth-btn-google" onClick={handleGoogleLogin}>
              {isSignUp ? 'Sign Up with Google' : 'Login with Google'}
            </button>

            <p style={{ textAlign: 'center', marginTop: '20px', color: '#ddd', fontSize: '14px' }}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <button type="button" onClick={() => setIsSignUp(!isSignUp)} style={{
                background: 'transparent', border: 'none',
                color: '#ff69b4', cursor: 'pointer', fontSize: '14px',
                fontFamily: 'inherit'
              }}>
                {isSignUp ? 'Login' : 'Sign Up'}
              </button>
            </p>
          </div>

          {/* Robot Image */}
          <div style={{ width: '400px', display: 'flex', justifyContent: 'center' }}>
            <img
              className="robot-img"
              src={isSignUp ? '/images/robot sign.png' : '/images/robot log.png'}
              alt="Robot"
            />
          </div>

        </div>
      </div>
    </>
  )
}