import React from 'react'

const PhonePreview = () => {
  const features = [
    { icon: '✍️', title: 'Text to Sign', subtitle: 'Convert text to ISL', gradient: 'linear-gradient(135deg,#6a11cb,#2575fc)' },
    { icon: '📷', title: 'Live Detection', subtitle: 'Real-time camera AI', gradient: 'linear-gradient(135deg,#e91e8c,#9c27b0)' },
    { icon: '📘', title: 'Practice', subtitle: 'Learn ISL alphabets', gradient: 'linear-gradient(135deg,#10b981,#059669)' },
    { icon: '📜', title: 'History', subtitle: 'View past sessions', gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)' }
  ]

  const navItems = [
    { icon: '🏠', label: 'Home', active: true },
    { icon: '📷', label: 'Detect', active: false },
    { icon: '📘', label: 'Learn', active: false },
    { icon: '⚙️', label: 'Settings', active: false }
  ]

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="app-preview">
        <div className="phone-frame">
          <div className="phone-notch"></div>
          <div className="phone-screen">
            <div className="phone-header">
              <div className="phone-emoji">🤟</div>
              <div className="phone-title">MyHearingBuddy</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginTop: '3px' }}>
                Break Barriers with Sign Language
              </div>
            </div>
            {features.map((feature, index) => (
              <div key={index} className="phone-card">
                <div className="phone-card-icon" style={{ background: feature.gradient }}>
                  {feature.icon}
                </div>
                <div>
                  <div className="phone-card-title">{feature.title}</div>
                  <div className="phone-card-sub">{feature.subtitle}</div>
                </div>
              </div>
            ))}
            <div className="phone-bottom-nav">
              {navItems.map((item, index) => (
                <div key={index} className={`nav-icon ${item.active ? 'active' : ''}`}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhonePreview
