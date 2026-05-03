import React from 'react'

const HowItWorks = () => {
  const steps = [
    {
      num: 1,
      title: 'Create Your Account',
      description: 'Sign up using just your phone number. Enter any 10-digit number and verify with a 6-digit OTP to get started instantly.'
    },
    {
      num: 2,
      title: 'Choose Your Mode',
      description: 'Pick from Live Detection, Text-to-Sign conversion, Practice alphabets, or review your history — all from the intuitive home screen.'
    },
    {
      num: 3,
      title: 'Start Communicating',
      description: 'Use your camera for real-time detection, practice ISL at your pace, and track your progress with beautiful stats and streaks.'
    }
  ]

  return (
    <section id="how-it-works">
      <div style={{ textAlign: 'center' }}>
        <span className="section-tag">Simple Process</span>
        <h2 className="section-title">Up and running in<br />three steps</h2>
        <p className="section-sub" style={{ margin: '0 auto' }}>
          No complex setup needed — just sign in and start communicating.
        </p>
      </div>
      <div className="steps">
        {steps.map((step, index) => (
          <div key={index} className="step">
            {index < steps.length - 1 && <div className="step-connector"></div>}
            <div className="step-num">{step.num}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks
