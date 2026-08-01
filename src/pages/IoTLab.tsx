import { useState, useRef } from 'react'
import { Stage, Layer, Circle, Rect, Line, Text, Group } from 'react-konva'

// ===== TYPES =====
type ComponentType = 'Battery' | 'Resistor' | 'LED' | 'GasSensor' | 'Arduino'

interface CircuitComponent {
  id: string
  type: ComponentType
  x: number
  y: number
  value: number
}

interface Wire {
  id: string
  fromId: string
  fromPin: 'left' | 'right'
  toId: string
  toPin: 'left' | 'right'
  points: number[]
}

// ===== DRAW COMPONENTS ON CANVAS =====
function Battery({ x, y, value }: { x: number; y: number; value: number }) {
  return (
    <Group x={x} y={y}>
      <Rect x={-40} y={-20} width={80} height={40} fill="#1a0030" stroke="#ff69b4" strokeWidth={2} cornerRadius={6} />
      {/* Long line (positive) */}
      <Line points={[-15, -14, -15, 14]} stroke="#ff69b4" strokeWidth={4} />
      {/* Short line (negative) */}
      <Line points={[5, -8, 5, 8]} stroke="#ff69b4" strokeWidth={4} />
      {/* Terminals */}
      <Line points={[-40, 0, -15, 0]} stroke="#ff69b4" strokeWidth={2} />
      <Line points={[5, 0, 40, 0]} stroke="#ff69b4" strokeWidth={2} />
      <Text text={`${value}V`} x={-12} y={-8} fill="#ff69b4" fontSize={11} fontStyle="bold" />
    </Group>
  )
}

function Resistor({ x, y, value }: { x: number; y: number; value: number }) {
  const zigzag = [-40, 0, -28, 0, -22, -12, -14, 12, -6, -12, 2, 12, 10, -12, 18, 12, 24, 0, 40, 0]
  return (
    <Group x={x} y={y}>
      <Line points={zigzag} stroke="#9b59b6" strokeWidth={2.5} />
      <Text text={`${value}Ω`} x={-16} y={14} fill="#9b59b6" fontSize={11} fontStyle="bold" />
    </Group>
  )
}

function LED({ x, y, value }: { x: number; y: number; value: number }) {
  return (
    <Group x={x} y={y}>
      <Line points={[-40, 0, -12, 0]} stroke="#ff69b4" strokeWidth={2} />
      <Line points={[12, 0, 40, 0]} stroke="#ff69b4" strokeWidth={2} />
      {/* Triangle */}
      <Line points={[-12, -14, -12, 14, 12, 0, -12, -14]} stroke="#ff69b4" strokeWidth={2} fill="#ff69b422" closed />
      {/* Bar */}
      <Line points={[12, -14, 12, 14]} stroke="#ff69b4" strokeWidth={2.5} />
      {/* Light rays */}
      <Line points={[16, -12, 22, -18]} stroke="#ffaadd" strokeWidth={1.5} />
      <Line points={[20, -6, 28, -10]} stroke="#ffaadd" strokeWidth={1.5} />
      <Text text={`${value}V`} x={-10} y={16} fill="#ff69b4" fontSize={11} fontStyle="bold" />
    </Group>
  )
}

function GasSensor({ x, y, value }: { x: number; y: number; value: number }) {
  return (
    <Group x={x} y={y}>
      <Rect x={-30} y={-22} width={60} height={44} fill="#1a0030" stroke="#e91e8c" strokeWidth={2} cornerRadius={8} />
      <Circle x={0} y={-4} radius={10} fill="#e91e8c44" stroke="#e91e8c" strokeWidth={1.5} />
      <Text text="GAS" x={-10} y={-10} fill="#e91e8c" fontSize={9} fontStyle="bold" />
      <Line points={[-40, 0, -30, 0]} stroke="#e91e8c" strokeWidth={2} />
      <Line points={[30, 0, 40, 0]} stroke="#e91e8c" strokeWidth={2} />
      <Text text={`${value}V`} x={-10} y={14} fill="#e91e8c" fontSize={11} fontStyle="bold" />
    </Group>
  )
}

function Arduino({ x, y }: { x: number; y: number }) {
  return (
    <Group x={x} y={y}>
      <Rect x={-45} y={-28} width={90} height={56} fill="#00435544" stroke="#00aaff" strokeWidth={2} cornerRadius={6} />
      <Text text="ARDUINO" x={-28} y={-12} fill="#00aaff" fontSize={10} fontStyle="bold" />
      <Text text="UNO" x={-12} y={2} fill="#00aaff" fontSize={10} />
      {/* Pins */}
      {[-20, -8, 4, 16].map((py, i) => (
        <Circle key={i} x={-45} y={py} radius={3} fill="#00aaff" />
      ))}
      <Line points={[-40, 0, -45, 0]} stroke="#00aaff" strokeWidth={2} />
      <Line points={[45, 0, 40, 0]} stroke="#00aaff" strokeWidth={2} />
    </Group>
  )
}

// ===== COMPONENT CONFIG =====
const COMP_CONFIG: Record<ComponentType, { label: string; color: string; defaultValue: number; unit: string; minVal: number; maxVal: number }> = {
  Battery: { label: '🔋 Battery', color: '#ff69b4', defaultValue: 9, unit: 'V', minVal: 1, maxVal: 24 },
  Resistor: { label: '⚡ Resistor', color: '#9b59b6', defaultValue: 220, unit: 'Ω', minVal: 10, maxVal: 10000 },
  LED: { label: '💡 LED', color: '#ff69b4', defaultValue: 2, unit: 'V', minVal: 1, maxVal: 5 },
  GasSensor: { label: '🌡️ Gas Sensor', color: '#e91e8c', defaultValue: 5, unit: 'V', minVal: 1, maxVal: 12 },
  Arduino: { label: '🤖 Arduino', color: '#00aaff', defaultValue: 5, unit: 'V', minVal: 5, maxVal: 5 },
}

// ===== MAIN COMPONENT =====
export default function IoTLab() {
  const [components, setComponents] = useState<CircuitComponent[]>([])
  const [wires, setWires] = useState<Wire[]>([])
  const [wireStart, setWireStart] = useState<{ id: string; pin: 'left' | 'right'; x: number; y: number } | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [blowout, setBlowout] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const stageRef = useRef<any>(null)

  // Get pin position for a component
  const getPinPos = (comp: CircuitComponent, pin: 'left' | 'right') => {
    return {
      x: comp.x + (pin === 'left' ? -40 : 40),
      y: comp.y
    }
  }

  const addComponent = (type: ComponentType) => {
    const id = `${type}-${Date.now()}`
    setComponents(prev => [...prev, {
      id, type,
      x: 200 + Math.random() * 300,
      y: 150 + Math.random() * 200,
      value: COMP_CONFIG[type].defaultValue
    }])
  }

  const updateValue = (id: string, value: number) => {
    setComponents(prev => prev.map(c => c.id === id ? { ...c, value } : c))
  }

  const deleteComponent = (id: string) => {
    setComponents(prev => prev.filter(c => c.id !== id))
    setWires(prev => prev.filter(w => w.fromId !== id && w.toId !== id))
    if (selected === id) setSelected(null)
  }

  const handlePinClick = (compId: string, pin: 'left' | 'right', x: number, y: number) => {
    if (!wireStart) {
      setWireStart({ id: compId, pin, x, y })
    } else {
      if (wireStart.id !== compId) {
        const toPos = getPinPos(components.find(c => c.id === compId)!, pin)
        const newWire: Wire = {
          id: `wire-${Date.now()}`,
          fromId: wireStart.id,
          fromPin: wireStart.pin,
          toId: compId,
          toPin: pin,
          points: [wireStart.x, wireStart.y, toPos.x, toPos.y]
        }
        setWires(prev => [...prev, newWire])
      }
      setWireStart(null)
    }
  }

  const simulate = async () => {
    if (components.length === 0) {
      setFeedback('⚠️ Add components first!')
      return
    }
    setLoading(true)
    setFeedback('')
    setBlowout(false)
    setScore(null)

    const battery = components.find(c => c.type === 'Battery')
    const resistor = components.find(c => c.type === 'Resistor')
    const sensor = components.find(c => c.type === 'GasSensor')

    const voltage = battery?.value ?? 0
    const resistance = resistor?.value ?? 0
    const current = resistance > 0 ? (voltage / resistance) * 1000 : 999
    const isBlowout = current > 50 || (!!sensor && voltage > 5.5) || (!resistor && components.length > 1)

    setBlowout(isBlowout)

    try {
      const desc = components.map(c => `${c.type}(${c.value}${COMP_CONFIG[c.type].unit})`).join(', ')
      const prompt = `You are an expert electronics lab supervisor AI for Virtual Hub platform.

Student circuit: ${desc}
Wires connected: ${wires.length}
Voltage: ${voltage}V | Current: ${current.toFixed(1)}mA
Status: ${isBlowout ? '💥 COMPONENT BLOWOUT!' : '✅ Normal'}

Respond in 3-4 sentences:
1. Circuit analysis
2. ${isBlowout ? 'Cause of blowout + exact fix' : 'Design quality'}
3. Pro engineering tip

End with: "Readiness Score: X/100"`

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      )
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response'
      const match = text.match(/Readiness Score:\s*(\d+)\/100/)
      if (match) setScore(parseInt(match[1]))
      setFeedback(text)
    } catch {
      setFeedback('⚠️ AI unavailable. Check .env file.')
    }
    setLoading(false)
  }

  const renderComponent = (comp: CircuitComponent) => {
    const cfg = COMP_CONFIG[comp.type]
    const isSelected = selected === comp.id

    const props = {
      x: comp.x,
      y: comp.y,
      value: comp.value,
    }

    return (
      <Group
        key={comp.id}
        draggable
        onDragEnd={e => {
          setComponents(prev => prev.map(c =>
            c.id === comp.id ? { ...c, x: e.target.x(), y: e.target.y() } : c
          ))
          setWires(prev => prev.map(w => {
            if (w.fromId === comp.id || w.toId === comp.id) {
              const from = components.find(c => c.id === w.fromId)!
              const to = components.find(c => c.id === w.toId)!
              const fromX = w.fromId === comp.id ? e.target.x() : from.x
              const fromY = w.fromId === comp.id ? e.target.y() : from.y
              const toX = w.toId === comp.id ? e.target.x() : to.x
              const toY = w.toId === comp.id ? e.target.y() : to.y
              return {
                ...w,
                points: [
                  fromX + (w.fromPin === 'left' ? -40 : 40), fromY,
                  toX + (w.toPin === 'left' ? -40 : 40), toY
                ]
              }
            }
            return w
          }))
        }}
        onClick={() => setSelected(comp.id === selected ? null : comp.id)}
      >
        {/* Selection ring */}
        {isSelected && (
          <Circle x={comp.x} y={comp.y} radius={55} stroke={cfg.color} strokeWidth={1.5} dash={[6, 3]} fill="transparent" />
        )}

        {/* Draw component */}
        {comp.type === 'Battery' && <Battery {...props} />}
        {comp.type === 'Resistor' && <Resistor {...props} />}
        {comp.type === 'LED' && <LED {...props} />}
        {comp.type === 'GasSensor' && <GasSensor {...props} />}
        {comp.type === 'Arduino' && <Arduino {...props} />}

        {/* Left pin */}
        <Circle
          x={comp.x - 40} y={comp.y} radius={6}
          fill={wireStart?.id === comp.id && wireStart.pin === 'left' ? '#fff' : cfg.color}
          stroke="#fff" strokeWidth={1}
          onClick={e => { e.cancelBubble = true; handlePinClick(comp.id, 'left', comp.x - 40, comp.y) }}
        />
        {/* Right pin */}
        <Circle
          x={comp.x + 40} y={comp.y} radius={6}
          fill={wireStart?.id === comp.id && wireStart.pin === 'right' ? '#fff' : cfg.color}
          stroke="#fff" strokeWidth={1}
          onClick={e => { e.cancelBubble = true; handlePinClick(comp.id, 'right', comp.x + 40, comp.y) }}
        />
      </Group>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0015',
      color: 'white',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid #2a1a3a',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: '#0f0020'
      }}>
        <a href="/" style={{ color: '#ff69b4', textDecoration: 'none', fontSize: '22px' }}>←</a>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff69b4' }}>⚡ Engineering & IoT Lab</h1>
          <p style={{ color: '#888', fontSize: '12px' }}>Click pins (dots) to connect wires • Drag to move • Click component to select</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
          {wireStart && (
            <button onClick={() => setWireStart(null)} style={{
              background: '#33001a', border: '1px solid #ff3333',
              borderRadius: '8px', padding: '8px 16px', color: '#ff6666', cursor: 'pointer'
            }}>
              ✕ Cancel Wire
            </button>
          )}
          {selected && (
            <button onClick={() => deleteComponent(selected)} style={{
              background: '#33001a', border: '1px solid #ff3333',
              borderRadius: '8px', padding: '8px 16px', color: '#ff6666', cursor: 'pointer'
            }}>
              🗑 Delete
            </button>
          )}
          <button onClick={simulate} disabled={loading} style={{
            background: loading ? '#333' : 'linear-gradient(90deg, #ff69b4, #9b59b6)',
            border: 'none', borderRadius: '10px', padding: '10px 28px',
            fontSize: '15px', fontWeight: 'bold', color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}>
            {loading ? '🔄 Analyzing...' : '▶ Run Simulation'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{
          width: '170px', padding: '12px',
          borderRight: '1px solid #2a1a3a',
          background: '#0a0018',
          display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto'
        }}>
          <p style={{ color: '#666', fontSize: '11px', marginBottom: '4px' }}>COMPONENTS</p>
          {(Object.keys(COMP_CONFIG) as ComponentType[]).map(type => {
            const cfg = COMP_CONFIG[type]
            return (
              <button key={type} onClick={() => addComponent(type)} style={{
                background: `${cfg.color}15`,
                border: `1px solid ${cfg.color}44`,
                borderRadius: '8px', padding: '10px 8px',
                color: 'white', cursor: 'pointer', textAlign: 'left',
                fontSize: '13px'
              }}>
                {cfg.label}
                <div style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>
                  {cfg.defaultValue}{cfg.unit}
                </div>
              </button>
            )
          })}

          {/* Value sliders for selected component */}
          {selected && (() => {
            const comp = components.find(c => c.id === selected)
            if (!comp) return null
            const cfg = COMP_CONFIG[comp.type]
            return (
              <div style={{ marginTop: '12px', borderTop: '1px solid #2a1a3a', paddingTop: '12px' }}>
                <p style={{ color: cfg.color, fontSize: '11px', marginBottom: '8px' }}>
                  {comp.type} Value:
                </p>
                <input
                  type="range"
                  min={cfg.minVal} max={cfg.maxVal}
                  value={comp.value}
                  onChange={e => updateValue(comp.id, Number(e.target.value))}
                  style={{ width: '100%', accentColor: cfg.color }}
                />
                <div style={{ color: cfg.color, fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>
                  {comp.value} {cfg.unit}
                </div>
              </div>
            )
          })()}

          {/* Wire status */}
          {wireStart && (
            <div style={{
              marginTop: '8px', padding: '8px',
              background: '#ff69b422', border: '1px solid #ff69b4',
              borderRadius: '8px', fontSize: '11px', color: '#ff69b4', textAlign: 'center'
            }}>
              🔌 Click another pin to connect!
            </div>
          )}
        </div>

        {/* Canvas */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {blowout && (
            <div style={{
              position: 'absolute', top: '16px', left: '50%',
              transform: 'translateX(-50%)', zIndex: 10,
              background: 'rgba(200,30,30,0.95)', borderRadius: '12px',
              padding: '12px 28px', fontWeight: 'bold', fontSize: '20px',
              color: 'white', boxShadow: '0 0 30px #ff000088'
            }}>
              💥 COMPONENT BLOWOUT DETECTED!
            </div>
          )}

          <Stage
            ref={stageRef}
            width={window.innerWidth - (feedback ? 620 : 340)}
            height={window.innerHeight - 90}
            style={{ background: '#0a0015' }}
            onMouseMove={e => {
              const pos = e.target.getStage()?.getPointerPosition()
              if (pos) setMousePos(pos)
            }}
            onClick={e => {
              if (e.target === e.target.getStage()) setSelected(null)
            }}
          >
            <Layer>
              {/* Grid */}
              {Array.from({ length: 40 }).map((_, i) => (
                <Line key={`v${i}`} points={[i * 40, 0, i * 40, 2000]} stroke="#1a0a2a" strokeWidth={1} />
              ))}
              {Array.from({ length: 30 }).map((_, i) => (
                <Line key={`h${i}`} points={[0, i * 40, 2000, i * 40]} stroke="#1a0a2a" strokeWidth={1} />
              ))}

              {/* Wires */}
              {wires.map(wire => (
                <Line
                  key={wire.id}
                  points={wire.points}
                  stroke="#00ff88"
                  strokeWidth={2.5}
                  onClick={() => setWires(prev => prev.filter(w => w.id !== wire.id))}
                />
              ))}

              {/* Active wire being drawn */}
              {wireStart && (
                <Line
                  points={[wireStart.x, wireStart.y, mousePos.x, mousePos.y]}
                  stroke="#ffff00"
                  strokeWidth={2}
                  dash={[8, 4]}
                />
              )}

              {/* Components */}
              {components.map(renderComponent)}
            </Layer>
          </Stage>
        </div>

        {/* AI Panel */}
        {feedback && (
          <div style={{
            width: '280px', padding: '16px',
            borderLeft: '1px solid #2a1a3a',
            background: '#0a0018', overflowY: 'auto'
          }}>
            <h3 style={{ color: '#cc99ff', marginBottom: '12px', fontSize: '16px' }}>🤖 AI Logic Reviewer</h3>
            {score !== null && (
              <div style={{
                background: 'rgba(155,89,182,0.2)', border: '1px solid #9b59b6',
                borderRadius: '10px', padding: '12px', marginBottom: '12px', textAlign: 'center'
              }}>
                <div style={{ color: '#aaa', fontSize: '12px' }}>Readiness Score</div>
                <div style={{ color: '#ff69b4', fontSize: '40px', fontWeight: 'bold' }}>{score}</div>
                <div style={{ color: '#aaa', fontSize: '12px' }}>/ 100</div>
              </div>
            )}
            <div style={{
              background: blowout ? 'rgba(255,50,50,0.1)' : 'rgba(155,89,182,0.1)',
              border: `1px solid ${blowout ? '#ff3333' : '#9b59b6'}`,
              borderRadius: '10px', padding: '12px',
              fontSize: '13px', lineHeight: '1.8',
              color: '#ddd', whiteSpace: 'pre-wrap'
            }}>
              {feedback}
            </div>
            <button
              onClick={() => { setFeedback(''); setBlowout(false); setScore(null) }}
              style={{
                marginTop: '12px', width: '100%',
                background: 'transparent', border: '1px solid #444',
                borderRadius: '8px', padding: '8px',
                color: '#888', cursor: 'pointer', fontSize: '13px'
              }}
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  )
}