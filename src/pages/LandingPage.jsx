import React, { useEffect } from 'react'
import Navigation from '../components/landing/Navigation'
import Hero from '../components/landing/Hero'
import StatsStrip from '../components/landing/StatsStrip'
import Features from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import Testimonials from '../components/landing/Testimonials'
import TechStack from '../components/landing/TechStack'
import CTA from '../components/landing/CTA'
import Footer from '../components/landing/Footer'
import '../styles/landing/variables.css'
import '../styles/landing/base.css'
import '../styles/landing/navigation.css'
import '../styles/landing/hero.css'
import '../styles/landing/components.css'
import '../styles/landing/features.css'
import '../styles/landing/sections.css'
import '../styles/landing/footer.css'
import '../styles/landing/responsive.css'

const LandingPage = () => {
  useEffect(() => {
    // Add landing-page class to body for scoped styling
    document.body.classList.add('landing-page')
    
    return () => {
      // Remove landing-page class when component unmounts
      document.body.classList.remove('landing-page')
    }
  }, [])

  return (
    <div className="landing-wrapper">
      <Navigation />
      <Hero />
      <StatsStrip />
      <hr />
      <Features />
      <hr />
      <HowItWorks />
      <hr />
      <Testimonials />
      <hr />
      <TechStack />
      <hr />
      <CTA />
      <Footer />
    </div>
  )
}

export default LandingPage
