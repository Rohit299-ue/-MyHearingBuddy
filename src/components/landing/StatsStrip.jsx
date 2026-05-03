import React from 'react'

const StatsStrip = () => {
  const stats = [
    { value: '26+', label: 'ISL Alphabets' },
    { value: '95%', label: 'Detection Accuracy' },
    { value: '4', label: 'Core Modules' },
    { value: '∞', label: 'Practice Sessions' }
  ]

  return (
    <div className="stats-strip">
      {stats.map((stat, index) => (
        <div key={index} className="stat-item">
          <div className="stat-value">{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

export default StatsStrip
