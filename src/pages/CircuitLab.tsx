export default function CircuitLab() {
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 60px)' }}>
      <iframe
        src="/simulation/circuit.html"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Circuit Lab"
      />
    </div>
  )
}