export default function NetworkLab() {
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 60px)' }}>
      <iframe
        src="/simulation/network.html"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Network & Cyber Lab"
      />
    </div>
  )
}