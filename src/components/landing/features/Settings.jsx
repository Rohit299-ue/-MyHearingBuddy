import React from 'react'

const Settings = () => {
  return (
    <div className="feature-card">
      <span className="feature-tag tag-teal">Customizable</span>
      <span className="feature-icon">⚙️</span>
      <h3>Smart Settings</h3>
      <p>
        Configure detection modes — Manual, Optimized, or Real-time. Adjust speed, toggle dark mode, 
        and test your backend connection.
      </p>
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface2)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>🌙 Dark Mode</span>
          <div style={{ width: '36px', height: '20px', background: 'linear-gradient(90deg,var(--purple-light),var(--pink))', borderRadius: '10px', position: 'relative' }}>
            <div style={{ position: 'absolute', right: '2px', top: '2px', width: '16px', height: '16px', background: 'white', borderRadius: '50%' }}></div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface2)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>⚡ Detection Mode</span>
          <span style={{ fontSize: '0.75rem', color: '#c4b5fd', background: 'rgba(168,85,247,0.15)', padding: '3px 10px', borderRadius: '50px', fontWeight: 600 }}>
            Optimized
          </span>
        </div>
      </div>
    </div>
  )
}

export default Settings
