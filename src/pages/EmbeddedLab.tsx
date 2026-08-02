export default function EmbeddedLab() {
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 60px)' }}>
      <iframe
        src="/simulation/embedded.html"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Embedded Systems Lab"
      />
    </div>
  )
}