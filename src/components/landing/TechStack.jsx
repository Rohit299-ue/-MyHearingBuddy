import React from 'react'

const TechStack = () => {
  const technologies = [
    { icon: '⚛️', name: 'React 18', desc: 'Hooks, Context API, Functional Components' },
    { icon: '🎨', name: 'Tailwind CSS v4', desc: 'Utility-first styling with dark mode support' },
    { icon: '⚡', name: 'Vite', desc: 'Lightning-fast build tool and dev server' },
    { icon: '🛣️', name: 'React Router v6', desc: 'Client-side routing with nested routes' },
    { icon: '🤖', name: 'MediaPipe Hands', desc: 'Google\'s real-time hand landmark detection' },
    { icon: '🧠', name: 'Context API', desc: 'Global state management for app settings' },
    { icon: '💾', name: 'localStorage', desc: 'Persistent history and user preferences' },
    { icon: '🔐', name: 'OTP Auth', desc: 'Phone-based authentication flow' }
  ]

  return (
    <section id="tech">
      <div style={{ textAlign: 'center' }}>
        <span className="section-tag">Under the Hood</span>
        <h2 className="section-title">Built with modern,<br />powerful technology</h2>
        <p className="section-sub" style={{ margin: '0 auto' }}>
          A carefully chosen stack for performance, reliability, and a delightful user experience.
        </p>
      </div>
      <div className="tech-grid">
        {technologies.map((tech, index) => (
          <div key={index} className="tech-card">
            <span className="tech-icon">{tech.icon}</span>
            <div className="tech-name">{tech.name}</div>
            <div className="tech-desc">{tech.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TechStack
