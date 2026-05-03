import React from 'react'

const TextToSign = () => {
  return (
    <div className="feature-card">
      <span className="feature-tag tag-purple">Conversion</span>
      <span className="feature-icon">✍️</span>
      <h3>Text to Sign Language</h3>
      <p>Type any text and watch it transform into sign language animations with an ISL avatar guide.</p>
      <div className="feature-mockup">
        <div className="text-input-mock">
          <span>Hello, how are you?<span className="cursor"></span></span>
          <span style={{ fontSize: '0.7rem', color: '#a855f7' }}>18/200</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
          <div className="sign-wave">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="wave-bar"></div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--muted)', marginTop: '8px' }}>
          Converting to ISL...
        </div>
      </div>
    </div>
  )
}

export default TextToSign
