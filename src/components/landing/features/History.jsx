import React from 'react'

const History = () => {
  const historyItems = [
    { text: 'Detected "HELLO" — 94% accuracy', time: '2 minutes ago · AI corrected ✨', color: '#a855f7' },
    { text: 'Practice session — A to M completed', time: '1 hour ago · 13 signs', color: '#5eead4' },
    { text: 'Quiz completed — 8/10 correct', time: 'Yesterday · Level Up 🎓', color: '#f9a8d4' }
  ]

  return (
    <div className="feature-card">
      <span className="feature-tag tag-amber">Tracking</span>
      <span className="feature-icon">📜</span>
      <h3>Detection History</h3>
      <p>Every sign detected is logged. Browse your learning timeline and see how far you've come.</p>
      <div className="feature-mockup">
        {historyItems.map((item, index) => (
          <div key={index} className="history-item">
            <div className="history-dot" style={{ background: item.color }}></div>
            <div>
              <div className="history-text">{item.text}</div>
              <div className="history-time">{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default History
