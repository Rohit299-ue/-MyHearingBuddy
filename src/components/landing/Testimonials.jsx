import React from 'react'
import PhonePreview from './PhonePreview'

const Testimonials = () => {
  const testimonials = [
    {
      rating: 5,
      text: 'MyHearingBuddy has transformed how my deaf students practice ISL at home. The quiz mode keeps them engaged and the progress tracking motivates them daily.',
      author: 'Sunita Patel',
      role: 'Special Education Teacher, Mumbai',
      avatar: 'SP'
    },
    {
      rating: 5,
      text: 'I can now communicate with my hearing-impaired sister so much better. The live detection is incredibly accurate and the text-to-sign feature is a game changer.',
      author: 'Rahul Kumar',
      role: 'Family member, Bangalore',
      avatar: 'RK'
    }
  ]

  return (
    <section id="testimonials">
      <div className="two-col">
        <div>
          <span className="section-tag">Community Love</span>
          <h2 className="section-title">Changing lives,<br />one sign at a time</h2>
          <p className="section-sub">
            Built for and loved by the hearing and speech-impaired community, educators, families, and language learners.
          </p>
          <div className="testimonials" style={{ gridTemplateColumns: '1fr', marginTop: '36px' }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial">
                <div className="star-rating">{'★'.repeat(testimonial.rating)}</div>
                <div className="quote-mark">"</div>
                <p>{testimonial.text}</p>
                <div className="testimonial-author">
                  <div className="avatar">{testimonial.avatar}</div>
                  <div>
                    <div className="author-name">{testimonial.author}</div>
                    <div className="author-role">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <PhonePreview />
      </div>
    </section>
  )
}

export default Testimonials
