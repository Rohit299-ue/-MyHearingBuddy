import React from 'react'

const LiveDetection = () => {
  return (
    <div className="feature-card wide">
      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <span className="feature-tag tag-pink">Real-Time</span>
          <span className="feature-icon">📷</span>
          <h3>Live Sign Detection</h3>
          <p>
            Point your camera and let our AI recognize ISL gestures instantly. Get confidence scores, 
            AI-corrected text, and automatic session history — all in real time.
          </p>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span className="feature-tag tag-purple">MediaPipe Hands</span>
            <span className="feature-tag tag-teal">Auto History</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600 }}>LIVE DETECTION</span>
            <span className="live-badge">
              <div className="live-dot"></div>
              Active
            </span>
          </div>
          <div className="camera-box" style={{ aspectRatio: '16/9', minHeight: '120px' }}>
            <div className="camera-grid"></div>
            <div className="camera-center"></div>
            <div className="camera-label">📷 Camera Active</div>
          </div>
          <div className="detection-bar">
            <div className="detection-letter">A</div>
            <div className="detection-info">
              <div className="detection-name">Sign: Alpha</div>
              <div className="detection-conf">High confidence</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div className="detection-pct">92%</div>
          </div>
          <div className="detection-bar">
            <div className="detection-letter" style={{ background: 'linear-gradient(135deg,#0fc6c2,#0891b2)' }}>L</div>
            <div className="detection-info">
              <div className="detection-name">Sign: Lima</div>
              <div className="detection-conf">Medium confidence</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '74%', background: 'linear-gradient(90deg,#0fc6c2,#0891b2)' }}></div>
              </div>
            </div>
            <div className="detection-pct" style={{ color: '#5eead4' }}>74%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveDetection
