import React from 'react'

const PracticeMode = () => {
  const alphabets = [
    { letter: 'A', sign: '👊' },
    { letter: 'B', sign: '🖐' },
    { letter: 'C', sign: '🤏' },
    { letter: 'D', sign: '☝️' },
    { letter: 'E', sign: '🤙' },
    { letter: 'F', sign: '👌' },
    { letter: 'G', sign: '👉' },
    { letter: 'H', sign: '✌️' },
    { letter: 'I', sign: '🤞' },
    { letter: 'J', sign: '🤘' },
    { letter: 'K', sign: '✋' },
    { letter: 'L', sign: '🤟' }
  ]

  return (
    <div className="feature-card tall">
      <span className="feature-tag tag-green">Learning</span>
      <span className="feature-icon">📘</span>
      <h3>Interactive Practice Mode</h3>
      <p>
        Master ISL alphabets A–Z with visual guides, then test yourself with instant-feedback quizzes. 
        Track your streak and progress over time.
      </p>
      <div className="alphabet-grid" style={{ marginTop: '20px' }}>
        {alphabets.map((item, index) => (
          <div 
            key={index} 
            className="alpha-cell" 
            style={index === 2 ? { borderColor: 'rgba(168,85,247,0.5)', background: 'rgba(106,17,203,0.2)' } : {}}
          >
            <span className="alpha-letter" style={index === 2 ? { color: '#c4b5fd' } : {}}>
              {item.letter}
            </span>
            <span className="alpha-sign">{item.sign}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '20px', background: 'var(--surface2)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
          Quiz Progress
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '70%', height: '100%', background: 'linear-gradient(90deg,var(--green),#059669)', borderRadius: '4px' }}></div>
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6ee7b7' }}>7/10</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
          🔥 7-day streak · 🏆 12 quizzes completed
        </div>
      </div>
    </div>
  )
}

export default PracticeMode
