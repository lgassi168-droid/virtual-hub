import { useState } from 'react'

export default function MadlyWidget() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Floating toggle button — visible on every page */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open Madly assistant"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 58,
          height: 58,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          background: 'linear-gradient(90deg, #ff4fa3, #9b4ff0)',
          color: '#fff',
          fontSize: 24,
          boxShadow: '0 10px 28px rgba(255,79,163,0.4)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform .15s ease'
        }}
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 96,
            right: 24,
            width: 'min(400px, calc(100vw - 32px))',
            height: 'min(620px, calc(100vh - 140px))',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            zIndex: 9998
          }}
        >
          <iframe
            src="/madly.html"
            title="Madly — AI Lab Assistant"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      )}
    </>
  )
}