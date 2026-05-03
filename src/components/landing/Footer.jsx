import React from 'react'

const Footer = () => {
  const footerLinks = {
    features: ['Text to Sign', 'Live Detection', 'Practice Mode', 'History Tracking', 'Settings'],
    resources: ['Documentation', 'ISL Alphabet Guide', 'API Reference', 'GitHub Repo', 'Changelog'],
    community: ['Discord Server', 'Blog', 'ISL Resources', 'Contribute', 'Contact Us']
  }

  const socialIcons = ['🐙', '🐦', '💼']

  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <a href="#" className="logo">
            <div className="logo-icon">🤟</div>
            MyHearingBuddy
          </a>
          <p>
            Empowering the hearing and speech-impaired community through technology, beautiful design, 
            and the power of Indian Sign Language.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            {socialIcons.map((icon, index) => (
              <div
                key={index}
                style={{
                  width: '36px',
                  height: '36px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                {icon}
              </div>
            ))}
          </div>
        </div>
        <div className="footer-col">
          <h4>Features</h4>
          <ul>
            {footerLinks.features.map((link, index) => (
              <li key={index}><a href="#">{link}</a></li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Resources</h4>
          <ul>
            {footerLinks.resources.map((link, index) => (
              <li key={index}><a href="#">{link}</a></li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Community</h4>
          <ul>
            {footerLinks.community.map((link, index) => (
              <li key={index}><a href="#">{link}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 MyHearingBuddy. Made with <span className="heart">♥</span> for the hearing-impaired community.</span>
        <span>MIT License — Free to use and fork</span>
      </div>
    </footer>
  )
}

export default Footer
