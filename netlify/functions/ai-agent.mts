import Anthropic from '@anthropic-ai/sdk'
import type { Config } from '@netlify/functions'

const SYSTEM_PROMPT = `You are Madly, the friendly AI lab assistant embedded in Virtual Hub — a multi-disciplinary
virtual engineering lab platform where students practice engineering concepts safely online. The platform offers
five labs: an Engineering & IoT Lab (Arduino/ESP32 and electronics simulation), a Network & Cyber Lab (router/switch
topologies and cyber defense scenarios), a Robotics & Automation Lab (robotic arm and path-planning simulation), an
Assembly Lab (8086 Assembly simulation with CPU register visualization), and a Circuit Lab (drag-and-drop circuit
building with real-time calculations).

Help students understand concepts in these areas, debug their thinking, explain relevant theory, and suggest what to
try next in whichever lab they're working in. Keep answers concise, encouraging, and educational. If asked something
unrelated to engineering, electronics, networking, robotics, assembly, or the platform itself, gently steer the
conversation back.`

type ChatMessage = { role: 'user' | 'assistant'; content: string }

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  let body: { messages?: ChatMessage[] }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const incoming = Array.isArray(body.messages) ? body.messages : []
  if (incoming.length === 0) {
    return Response.json({ error: 'messages is required' }, { status: 400 })
  }

  const messages = incoming.slice(-20).map((m) => ({
    role: (m.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
    content: String(m.content ?? '').slice(0, 4000),
  }))

  try {
    const anthropic = new Anthropic()

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    })

    const reply = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim()

    return Response.json({ reply: reply || "I'm not sure how to answer that — could you rephrase?" })
  } catch (error) {
    console.error('ai-agent error:', error)
    return Response.json({ error: 'The AI agent is unavailable right now. Please try again shortly.' }, { status: 502 })
  }
}

export const config: Config = {
  path: '/api/ai-agent',
  method: 'POST',
}
