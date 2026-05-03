import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (e, id) => {
    e.preventDefault()
    const element = document.querySelector(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleGetStarted = (e) => {
    e.preventDefault()
    navigate('/auth')
  }

  return (
    <nav style={{ background: scrolled ? 'rgba(13, 11, 26, 0.97)' : 'rgba(13, 11, 26, 0.85)' }}>
      <a href="#" className="logo">
        <div className="logo-icon">🤟</div>
        MyHearingBuddy
      </a>
      <ul className="nav-links">
        <li><a href="#features" onClick={(e) => scrollToSection(e, '#features')}>Features</a></li>
        <li><a href="#how-it-works" onClick={(e) => scrollToSection(e, '#how-it-works')}>How It Works</a></li>
        <li><a href="#tech" onClick={(e) => scrollToSection(e, '#tech')}>Tech Stack</a></li>
        <li><a href="#testimonials" onClick={(e) => scrollToSection(e, '#testimonials')}>Community</a></li>
        <li><a href="#get-started" className="nav-cta" onClick={handleGetStarted}>Get Started</a></li>
      </ul>
    </nav>
  )
}

export default Navigation
