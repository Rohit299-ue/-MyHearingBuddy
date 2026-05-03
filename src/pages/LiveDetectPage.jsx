import { useRef, useState, useEffect, useCallback } from "react";
import { useApp } from "../context/AppContext";

const MIN_CONFIDENCE = 0.50;
const STABLE_FRAMES = 2;
// Adaptive loop: how long to wait after a response before sending the next frame.
// Keeps the pipeline full without flooding the backend.
const LOOP_DELAY_MS = 80;   // ~12 fps max; backend latency is the real bottleneck
const CAPTURE_WIDTH  = 320; // downscale before sending — reduces payload ~4-8x
const CAPTURE_HEIGHT = 240;

const LiveDetectPage = () => {
  const { addHistory, settings } = useApp();
  const backendUrl = settings?.backendUrl || "http://localhost:5000";

  // Refs
  const videoRef   = useRef(null);  // visible video element — MUST stay in DOM & visible
  const canvasRef  = useRef(null);  // hidden canvas — only used for frame capture
  const streamRef  = useRef(null);
  const rafRef     = useRef(null);  // requestAnimationFrame id for overlay drawing
  const detectRef  = useRef(null);  // setInterval id for API calls
  const busyRef    = useRef(false);
  const stableRef  = useRef(0);
  const lastRawRef = useRef("");
  const lastCommit = useRef("");

  // State
  const [isDetecting,  setIsDetecting]  = useState(false);
  const [cameraReady,  setCameraReady]  = useState(false);
  const [gestureText,  setGestureText]  = useState("-");
  const [confidence,   setConfidence]   = useState(0);
  const [word,         setWord]         = useState("");
  const [pulse,        setPulse]        = useState(false);
  const [backendOk,    setBackendOk]    = useState(null); // null=checking, true, false
  const [errorMsg,     setErrorMsg]     = useState("");

  // Bounding-box / landmark overlay drawn on a separate overlay canvas
  const overlayRef = useRef(null);

  // ── Health check ──────────────────────────────────────────────────────────
  useEffect(() => {
    // Check if Gradio app is accessible
    fetch(`${backendUrl}/`, { signal: AbortSignal.timeout(4000) })
      .then(r => setBackendOk(r.ok))
      .catch(() => setBackendOk(false));
  }, [backendUrl]);

  // ── Commit letter to word ─────────────────────────────────────────────────
  const commitLetter = useCallback((letter) => {
    setPulse(true);
    setTimeout(() => setPulse(false), 400);
    if (letter === "SEND") {
      setWord(prev => {
        if (prev.trim()) addHistory({ type: "detection", original: prev.trim(), corrected: null });
        return "";
      });
      lastCommit.current = "";
    } else if (letter === "SPACE") {
      setWord(prev => prev + " ");
    } else {
      setWord(prev => prev + letter);
    }
  }, [addHistory]);

  // ── Send frame to backend ─────────────────────────────────────────────────
  const sendFrame = useCallback(() => {
    if (busyRef.current) return;
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    // Guard: video must be playing and have real dimensions
    if (!video || !canvas || video.readyState < 2 || video.videoWidth === 0) return;

    busyRef.current = true;

    // Downscale to CAPTURE_WIDTH×CAPTURE_HEIGHT before encoding —
    // reduces JPEG payload ~4-8x with negligible accuracy loss for hand landmarks.
    canvas.width  = CAPTURE_WIDTH;
    canvas.height = CAPTURE_HEIGHT;
    canvas.getContext("2d").drawImage(video, 0, 0, CAPTURE_WIDTH, CAPTURE_HEIGHT);
    
    // Convert to blob for proper Gradio API format
    canvas.toBlob((blob) => {
      if (!blob) {
        busyRef.current = false;
        return;
      }

      // Convert blob to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;

        // Use Gradio's /api/predict endpoint
        fetch(`${backendUrl}/api/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            data: [base64data]  // Send as base64 data URL
          }),
          signal: AbortSignal.timeout(3000),
        })
          .then(r => r.json())
          .then(data => {
            const overlay = overlayRef.current;
            const ctx     = overlay?.getContext("2d");

            // Clear previous overlay drawings
            if (ctx && overlay) ctx.clearRect(0, 0, overlay.width, overlay.height);

            // Gradio returns: { data: [annotated_image, prediction_text] }
            if (data.data && data.data.length >= 2) {
              const predictionText = data.data[1];
              
              // Parse prediction text (format: "**Detected Sign:** X\n\n**Confidence:** 95.5%")
              const signMatch = predictionText.match(/\*\*Detected Sign:\*\* (\w+)/);
              const confMatch = predictionText.match(/\*\*Confidence:\*\* ([\d.]+)%/);
              
              if (signMatch && confMatch) {
                const pred = signMatch[1];
                const conf = parseFloat(confMatch[1]) / 100;
                
                if (conf >= MIN_CONFIDENCE) {
                  setGestureText(pred);
                  setConfidence(conf);

                  // Stability check before committing
                  if (pred === lastRawRef.current) stableRef.current++;
                  else { stableRef.current = 1; lastRawRef.current = pred; }

                  if (stableRef.current >= STABLE_FRAMES && pred !== lastCommit.current) {
                    lastCommit.current = pred;
                    stableRef.current  = 0;
                    commitLetter(pred);
                  }
                } else {
                  setGestureText("-");
                  setConfidence(0);
                  lastRawRef.current = "";
                  stableRef.current  = 0;
                }
              } else {
                // Check if it's "No hand detected" message
                if (predictionText.includes("No hand detected")) {
                  setGestureText("-");
                  setConfidence(0);
                  lastRawRef.current = "";
                  stableRef.current  = 0;
                }
              }
            } else {
              setGestureText("-");
              setConfidence(0);
              lastRawRef.current = "";
              stableRef.current  = 0;
            }
          })
          .catch(() => {})
          .finally(() => {
            busyRef.current = false;
            // Adaptive loop: schedule next frame shortly after this one finishes
            if (detectRef.current !== null) {
              detectRef.current = setTimeout(sendFrame, LOOP_DELAY_MS);
            }
          });
      };
      reader.readAsDataURL(blob);
    }, 'image/jpeg', 0.7);
  }, [backendUrl, commitLetter]);

  // ── Keep overlay canvas sized to match the video container ───────────────
  const syncOverlaySize = useCallback(() => {
    const overlay = overlayRef.current;
    const video   = videoRef.current;
    if (!overlay || !video) return;
    const container = overlay.parentElement;
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (overlay.width !== w || overlay.height !== h) {
      overlay.width  = w;
      overlay.height = h;
    }
  }, []);

  const startSizeLoop = useCallback(() => {
    const loop = () => {
      syncOverlaySize();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [syncOverlaySize]);

  // ── Start ─────────────────────────────────────────────────────────────────
  const startCamera = async () => {
    setErrorMsg("");
    setCameraReady(false);

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    } catch (err) {
      setErrorMsg("Camera permission denied: " + err.message);
      return;
    }

    streamRef.current = stream;
    const video = videoRef.current;

    // Assign stream
    video.srcObject = stream;

    // Set as DOM properties — React's reconciliation can drop JSX attrs on video
    video.muted      = true;
    video.playsInline = true;

    // Wait for loadedmetadata — earliest reliable signal Chrome has frame dimensions
    await new Promise((resolve) => {
      if (video.readyState >= 1 && video.videoWidth > 0) {
        resolve();
        return;
      }
      video.onloadedmetadata = () => resolve();
    });

    // Explicitly call play() — don't rely solely on autoPlay in React
    try {
      await video.play();
    } catch (err) {
      setErrorMsg("Video play() failed: " + err.message);
      stream.getTracks().forEach(t => t.stop());
      return;
    }

    // One tick for Chrome to decode the first real frame
    await new Promise(r => setTimeout(r, 100));

    setCameraReady(true);
    setIsDetecting(true);
    startSizeLoop();
    // Kick off the adaptive detection loop (uses setTimeout, not setInterval)
    detectRef.current = setTimeout(sendFrame, LOOP_DELAY_MS);
  };

  // ── Stop ──────────────────────────────────────────────────────────────────
  const stopCamera = () => {
    cancelAnimationFrame(rafRef.current);
    // Signal the adaptive loop to stop, then clear the pending timeout
    const tid = detectRef.current;
    detectRef.current = null; // sentinel checked in .finally()
    clearTimeout(tid);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;

    if (videoRef.current) videoRef.current.srcObject = null;

    // Clear overlay
    const overlay = overlayRef.current;
    if (overlay) overlay.getContext("2d").clearRect(0, 0, overlay.width, overlay.height);

    setIsDetecting(false);
    setCameraReady(false);
    setGestureText("-");
    setConfidence(0);
    setWord(prev => {
      if (prev.trim()) addHistory({ type: "detection", original: prev.trim(), corrected: null });
      return prev;
    });
    lastRawRef.current = "";
    lastCommit.current = "";
    stableRef.current  = 0;
  };

  // Cleanup on unmount
  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    const tid = detectRef.current;
    detectRef.current = null;
    clearTimeout(tid);
    streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  const getMeaning = (l) => {
    if (!l || l === "-") return "Detecting...";
    if (l === "SPACE") return "Space";
    if (l === "SEND")  return "Send & Save";
    return `Letter ${l}`;
  };

  const statusColor = backendOk === true ? "#4ade80" : backendOk === false ? "#f87171" : "#94a3b8";
  const statusText  = backendOk === true ? "Backend Online" : backendOk === false ? "Backend Offline" : "Checking...";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060a12",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "sans-serif",
      boxSizing: "border-box",
    }}>

      {/*
        Hidden canvas — ONLY used for toDataURL() frame capture.
        The video element itself is always visible in the camera container below.
      */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div style={{
        display: "flex",
        flexDirection: "row",
        gap: 16,
        width: "100%",
        maxWidth: 1100,
        height: "80vh",
        minHeight: 500,
      }}>

        {/* ── CAMERA CONTAINER ── */}
        <div style={{
          flex: 1,
          position: "relative",
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid rgba(0,245,255,0.2)",
          background: "#0a0f1a",
          minHeight: 400,
        }}>

          {/*
            KEY: <video> is ALWAYS in the DOM and ALWAYS visible.
            Never use display:none or off-screen positioning — Chrome suspends
            the video pipeline and readyState stays at 0.
            The overlay canvas sits on top via z-index.
          */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* Overlay canvas for bounding boxes & landmarks */}
          <canvas
            ref={overlayRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 5,
            }}
          />

          {/* Status badge */}
          <div style={{
            position: "absolute", top: 12, left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(6,10,18,0.8)",
            border: "1px solid rgba(0,245,255,0.2)",
            borderRadius: 100,
            padding: "4px 14px",
            fontSize: 11,
            color: isDetecting ? "#4ade80" : "rgba(0,245,255,0.7)",
            letterSpacing: 1,
            whiteSpace: "nowrap",
            display: "flex", alignItems: "center", gap: 7,
            zIndex: 10,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: isDetecting ? "#4ade80" : "#00f5ff",
              display: "inline-block",
              animation: isDetecting ? "pulse 1.2s infinite" : "none",
            }} />
            {isDetecting
              ? cameraReady ? "LIVE · DETECTING" : "INITIALIZING CAMERA…"
              : "CAMERA · IDLE"}
          </div>

          {/* Idle overlay — only shown when not detecting */}
          {!isDetecting && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(6,10,18,0.85)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 12,
              zIndex: 10,
            }}>
              <div style={{ fontSize: 40 }}>📷</div>
              <div style={{ color: "rgba(148,163,184,0.6)", fontSize: 12, letterSpacing: 2 }}>
                CAMERA INACTIVE
              </div>
            </div>
          )}

          {/* Initializing overlay — shown while camera is starting */}
          {isDetecting && !cameraReady && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(6,10,18,0.7)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 12,
              zIndex: 10,
            }}>
              <div style={{ color: "rgba(0,245,255,0.7)", fontSize: 13, letterSpacing: 2 }}
                   className="animate-pulse">
                INITIALIZING CAMERA…
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{
          width: 300,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}>

          {/* Backend status */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${statusColor}40`,
            borderRadius: 100, padding: "4px 12px",
            fontSize: 10, color: statusColor, letterSpacing: 1,
            alignSelf: "flex-start",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusColor, display: "inline-block" }} />
            {statusText}
          </div>

          {errorMsg && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#f87171",
            }}>
              ⚠ {errorMsg}
            </div>
          )}

          {/* Detected gesture */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16, padding: "18px 20px",
          }}>
            <div style={{ fontSize: 10, color: "rgba(148,163,184,0.5)", letterSpacing: 2, marginBottom: 10 }}>
              DETECTED GESTURE
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                fontSize: 72, fontWeight: 800, color: "#00f5ff",
                lineHeight: 1, minWidth: 60,
                transform: pulse ? "scale(1.15)" : "scale(1)",
                transition: "transform 0.15s",
                textShadow: "0 0 30px rgba(0,245,255,0.5)",
              }}>
                {gestureText === "SPACE" ? "␣" : gestureText === "SEND" ? "↵" : gestureText}
              </div>
              <div>
                <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16 }}>{getMeaning(gestureText)}</div>
                <div style={{ color: "rgba(148,163,184,0.5)", fontSize: 12, marginTop: 4 }}>ASL · 28-Class Model</div>
              </div>
            </div>
            {/* Confidence bar */}
            <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 10, marginTop: 14, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: confidence > 0 ? `${Math.round(confidence * 100)}%` : "0%",
                background: "linear-gradient(90deg,#00f5ff,#7c3aed)",
                borderRadius: 10, transition: "width 0.4s",
              }} />
            </div>
            {confidence > 0 && (
              <div style={{ fontSize: 10, color: "rgba(148,163,184,0.4)", marginTop: 5 }}>
                CONFIDENCE: {Math.round(confidence * 100)}%
              </div>
            )}
          </div>

          {/* Word builder */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16, padding: "18px 20px", flex: 1,
          }}>
            <div style={{ fontSize: 10, color: "rgba(148,163,184,0.5)", letterSpacing: 2, marginBottom: 10 }}>
              GENERATED WORD
            </div>
            {word
              ? <div style={{ fontSize: 26, fontWeight: 800, color: "#f8fafc", letterSpacing: 3, wordBreak: "break-all" }}>{word}</div>
              : <div style={{ fontSize: 13, color: "rgba(148,163,184,0.3)", letterSpacing: 1 }}>START SIGNING...</div>
            }
            {word && (
              <div style={{ fontSize: 11, color: "rgba(148,163,184,0.4)", marginTop: 6 }}>
                {word.replace(/ /g, "").length} CHARS
              </div>
            )}
            <div style={{
              marginTop: 10, fontSize: 11,
              color: "rgba(167,139,250,0.7)",
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: 8, padding: "5px 10px",
            }}>
              ✋ Sign <b>SEND</b> to save · <b>SPACE</b> for space
            </div>
            <button
              onClick={() => { setWord(""); lastCommit.current = ""; }}
              style={{
                marginTop: 12, width: "100%", padding: 10,
                background: "rgba(255,79,163,0.1)",
                border: "1px solid rgba(255,79,163,0.25)",
                borderRadius: 10, color: "#ff4fa3",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
              }}
            >
              ✕ Clear
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { val: word.replace(/ /g, "").length, label: "CHARS" },
              { val: confidence > 0 ? `${Math.round(confidence * 100)}%` : "—", label: "CONF", color: "#a78bfa" },
              { val: isDetecting ? "ON" : "OFF", label: "STATUS", color: isDetecting ? "#4ade80" : "rgba(148,163,184,0.4)" },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12, padding: 12, textAlign: "center",
              }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color || "#00f5ff" }}>{s.val}</div>
                <div style={{ fontSize: 10, color: "rgba(148,163,184,0.45)", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Start / Stop */}
          {!isDetecting ? (
            <button
              onClick={startCamera}
              disabled={backendOk === false}
              style={{
                padding: 16, borderRadius: 12, border: "none",
                background: backendOk === false ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg,#00c8c8,#00f5ff)",
                color: "#060a12", fontSize: 15, fontWeight: 800,
                cursor: backendOk === false ? "not-allowed" : "pointer",
                opacity: backendOk === false ? 0.5 : 1,
                letterSpacing: 1,
              }}
            >
              ▶ Start Detection
            </button>
          ) : (
            <button
              onClick={stopCamera}
              style={{
                padding: 16, borderRadius: 12, border: "none",
                background: "linear-gradient(135deg,#e11d48,#ff4fa3)",
                color: "white", fontSize: 15, fontWeight: 800,
                cursor: "pointer", letterSpacing: 1,
              }}
            >
              ⏹ Stop Detection
            </button>
          )}

        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(0.7); }
        }
      `}</style>
    </div>
  );
};

export default LiveDetectPage;
