import { useEffect, useRef, useState } from 'react'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

const WELCOME: ChatMessage = {
  role: 'assistant',
  content:
    "Hi! I'm Madly, your AI lab assistant. Ask me about IoT, networking, robotics, assembly, or circuits — or where to start in any lab.",
}

export default function AIAgent() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading, open])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const nextMessages = [...messages, { role: 'user', content: text } as ChatMessage]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Sorry, I couldn't reach the AI agent. Please try again in a moment." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, fontFamily: 'Poppins, sans-serif' }}>
      {open && (
        <div
          style={{
            width: '340px',
            height: '460px',
            marginBottom: '16px',
            background: 'linear-gradient(180deg, #1a0030 0%, #0a0015 100%)',
            border: '1px solid rgba(255,105,180,0.35)',
            borderRadius: '16px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '14px 16px',
              background: 'rgba(255,255,255,0.05)',
              borderBottom: '1px solid rgba(255,105,180,0.3)',
              color: '#ff69b4',
              fontWeight: 'bold',
              fontSize: '15px',
            }}
          >
            ⚡ Madly — AI Lab Assistant
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  background:
                    m.role === 'user' ? 'linear-gradient(90deg, #ff69b4, #9b59b6)' : 'rgba(255,255,255,0.08)',
                  color: m.role === 'user' ? '#fff' : '#e6d9ff',
                }}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', color: '#aaa', fontSize: '13px', padding: '8px 12px' }}>
                Madly is thinking…
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', padding: '12px', borderTop: '1px solid rgba(255,105,180,0.2)' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask about your labs..."
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,105,180,0.25)',
                borderRadius: '20px',
                padding: '8px 14px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                background: 'linear-gradient(90deg, #ff69b4, #9b59b6)',
                border: 'none',
                borderRadius: '20px',
                padding: '8px 18px',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !input.trim() ? 0.6 : 1,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle AI lab assistant"
        style={{
          marginLeft: 'auto',
          display: 'block',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, #ff69b4, #9b59b6)',
          color: '#fff',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(233,30,140,0.45)',
        }}
      >
        {open ? '✕' : '🤖'}
      </button>
    </div>
  )
}
