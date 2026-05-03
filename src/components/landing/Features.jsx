import React from 'react'
import LiveDetection from './features/LiveDetection'
import TextToSign from './features/TextToSign'
import PracticeMode from './features/PracticeMode'
import History from './features/History'
import Settings from './features/Settings'

const Features = () => {
  return (
    <section id="features">
      <div style={{ textAlign: 'center', marginBottom: 0 }}>
        <span className="section-tag">What We Offer</span>
        <h2 className="section-title" style={{ maxWidth: '600px', margin: '0 auto 16px' }}>
          Everything you need to<br />master sign language
        </h2>
        <p className="section-sub" style={{ margin: '0 auto' }}>
          From real-time camera detection to interactive practice sessions — all in one beautifully designed app.
        </p>
      </div>
      <div className="features-grid">
        <LiveDetection />
        <TextToSign />
        <PracticeMode />
        <History />
        <Settings />
      </div>
    </section>
  )
}

export default Features
