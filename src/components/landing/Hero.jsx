import React from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
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
    <section className="hero">
      <div className="hero-badge">
        <div className="badge-dot"></div>
        AI-Powered Indian Sign Language
      </div>
      <span className="hero-sign">🤟</span>
      <h1>Break Barriers<br />with Sign Language</h1>
      <p>
        MyHearingBuddy bridges communication gaps using real-time ISL detection, 
        text-to-sign conversion, and interactive learning — empowering the hearing 
        and speech-impaired community.
      </p>
      <div className="hero-actions">
        <a href="#get-started" onClick={handleGetStarted} className="btn-primary">Start Learning Free →</a>
        <a href="#features" onClick={(e) => scrollToSection(e, '#features')} className="btn-secondary">Explore Features</a>
      </div>
    </section>
  )
}

export default Hero
