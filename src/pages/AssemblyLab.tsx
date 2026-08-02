export default function AssemblyLab() {
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 60px)' }}>
      <iframe
        src="/simulation/assembly.html"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Assembly Lab"
      />
    </div>
  )
}