import React from 'react'
import { useNavigate } from 'react-router-dom'

const CTA = () => {
  const navigate = useNavigate()

  const handleGetStarted = (e) => {
    e.preventDefault()
    navigate('/auth')
  }

  const scrollToSection = (e, id) => {
    e.preventDefault()
    const element = document.querySelector(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section id="get-started" className="cta-section">
      <div className="cta-box">
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🤟</div>
        <h2>Ready to break barriers?</h2>
        <p>
          Join the community learning Indian Sign Language. It's free, it's beautiful, and it's changing lives.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#" onClick={handleGetStarted} className="btn-primary" style={{ fontSize: '1.05rem', padding: '18px 48px' }}>
            Get Started — It's Free
          </a>
          <a href="#features" onClick={(e) => scrollToSection(e, '#features')} className="btn-secondary" style={{ fontSize: '1.05rem', padding: '18px 48px' }}>
            Learn More
          </a>
        </div>
        <div style={{ marginTop: '32px', display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>✓ No credit card required</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>✓ Works in any browser</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>✓ Free forever</span>
        </div>
      </div>
    </section>
  )
}

export default CTA
