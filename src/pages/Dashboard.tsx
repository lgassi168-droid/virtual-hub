export default function Dashboard() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        src="/dashboard/dashboard2.html"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Dashboard"
      />
    </div>
  )
}
