import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import SignAvatar from "../components/common/SignAvatar";
import {
  Play,
  Pause,
  Volume2,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  Zap,
  Users,
  Lightbulb,
  Heart,
  X,
  Download,
  Share2,
  RotateCcw,
  TrendingUp,
  Clock,
} from "lucide-react";

const TextToSignPageEnhanced = () => {
  const { addHistory } = useApp();
  const [text, setText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showToast, setShowToast] = useState(null);
  const [letterCount, setLetterCount] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [recentTexts, setRecentTexts] = useState([]);

  const MAX_LENGTH = 50;

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("textToSignFavorites");
    if (saved) setFavorites(JSON.parse(saved));
    const recentSaved = localStorage.getItem("textToSignRecent");
    if (recentSaved) setRecentTexts(JSON.parse(recentSaved));
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("textToSignFavorites", JSON.stringify(favorites));
  }, [favorites]);

  // Save recent texts to localStorage
  useEffect(() => {
    localStorage.setItem("textToSignRecent", JSON.stringify(recentTexts));
  }, [recentTexts]);

  const handleTextChange = (e) => {
    const newText = e.target.value.slice(0, MAX_LENGTH);
    setText(newText);
    const letters = newText
      .toUpperCase()
      .split("")
      .filter((c) => /[A-Z]/.test(c)).length;
    setLetterCount(letters);
    
    // Check if in favorites
    setIsFavorited(favorites.some((fav) => fav.text === newText));
  };

  const handlePlay = () => {
    if (!text.trim()) return;

    addHistory({
      type: "text to sign",
      original: text.trim(),
      corrected: null,
      timestamp: Date.now(),
    });

    // Add to recent if not already there
    setRecentTexts((prev) => {
      const filtered = prev.filter((t) => t !== text.trim());
      return [text.trim(), ...filtered].slice(0, 5);
    });

    setIsPlaying(true);
    setPlayCount((prev) => prev + 1);

    const letters = text
      .toUpperCase()
      .split("")
      .filter((char) => /[A-Z]/.test(char));

    const duration = (letters.length * 1000) / playbackSpeed;
    setTimeout(() => {
      setIsPlaying(false);
      setShowToast({ type: "success", msg: "Animation completed!" });
      setTimeout(() => setShowToast(null), 2500);
    }, duration);
  };

  const handleSpeak = () => {
    if ("speechSynthesis" in window && text.trim()) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackSpeed;
      window.speechSynthesis.speak(utterance);
      setShowToast({ type: "info", msg: "Speaking..." });
      setTimeout(() => setShowToast(null), 2500);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setShowToast({ type: "success", msg: "Text copied!" });
    setTimeout(() => {
      setCopiedText(false);
      setShowToast(null);
    }, 2000);
  };

  const handleClearText = () => {
    setText("");
    setLetterCount(0);
    setIsFavorited(false);
  };

  const handleToggleFavorite = () => {
    if (!text.trim()) return;

    if (isFavorited) {
      setFavorites((prev) => prev.filter((fav) => fav.text !== text.trim()));
      setShowToast({ type: "success", msg: "Removed from favorites" });
    } else {
      setFavorites((prev) => [
        ...prev,
        { text: text.trim(), savedAt: Date.now() },
      ]);
      setShowToast({ type: "success", msg: "Added to favorites" });
    }

    setIsFavorited(!isFavorited);
    setTimeout(() => setShowToast(null), 2000);
  };

  const handleSelectFavorite = (favText) => {
    setText(favText);
    const letters = favText
      .toUpperCase()
      .split("")
      .filter((c) => /[A-Z]/.test(c)).length;
    setLetterCount(letters);
    setIsFavorited(true);
    setShowFavorites(false);
  };

  const handleSelectRecent = (recentText) => {
    setText(recentText);
    const letters = recentText
      .toUpperCase()
      .split("")
      .filter((c) => /[A-Z]/.test(c)).length;
    setLetterCount(letters);
    setIsFavorited(favorites.some((fav) => fav.text === recentText));
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({
      text,
      letterCount,
      playCount,
      timestamp: Date.now(),
    });
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `text-to-sign-${Date.now()}.json`;
    link.click();
    setShowToast({ type: "success", msg: "Exported successfully!" });
    setTimeout(() => setShowToast(null), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Check out this sign language",
        text: `"${text}" converted to sign language`,
      });
    } else {
      setShowToast({ type: "info", msg: "Share not available on this device" });
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* TOAST */}
      {showToast && (
        <div style={{ ...styles.toast, ...styles[`toast_${showToast.type}`] }}>
          <div style={styles.toastContent}>
            {showToast.type === "success" ? (
              <Check size={16} />
            ) : showToast.type === "error" ? (
              <AlertCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{showToast.msg}</span>
          </div>
          <button
            style={styles.toastClose}
            onClick={() => setShowToast(null)}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.titleWrap}>
            <div style={styles.headerIcon}>✍️</div>
            <div>
              <h1 style={styles.pageTitle}>Text to Sign</h1>
              <p style={styles.pageSubtitle}>
                Transform words into beautiful sign language
              </p>
            </div>
          </div>
          <div style={styles.headerBadges}>
            <div style={styles.headerBadge}>
              <Zap size={14} />
              <span>Instant</span>
            </div>
            <div style={styles.headerBadge}>
              <TrendingUp size={14} />
              <span>{playCount} plays</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div style={styles.grid}>
        {/* LEFT PANEL */}
        <div style={styles.leftPanel}>
          {/* INPUT CARD */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <h2 style={styles.cardTitle}>Enter Your Text</h2>
                <p style={styles.cardSub}>Type or paste any text</p>
              </div>
              <div style={styles.charCounter}>
                <span style={styles.charCount}>{text.length}</span>
                <span style={styles.charMax}>/{MAX_LENGTH}</span>
              </div>
            </div>

            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Type something... e.g., Hello, Welcome, Thank You"
              style={styles.textarea}
            />

            {text && (
              <div style={styles.statsRow}>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Letters:</span>
                  <span style={styles.statValue}>{letterCount}</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Duration:</span>
                  <span style={styles.statValue}>
                    {Math.ceil(letterCount / playbackSpeed)}s
                  </span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Speed:</span>
                  <span style={styles.statValue}>{playbackSpeed}x</span>
                </div>
              </div>
            )}

            <div style={styles.textActions}>
              {text && (
                <>
                  <button
                    style={{
                      ...styles.actionBtn,
                      ...(copiedText ? styles.actionBtnSuccess : {}),
                    }}
                    onClick={handleCopyText}
                  >
                    {copiedText ? (
                      <Check size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                    {copiedText ? "Copied" : "Copy"}
                  </button>
                  <button
                    style={{
                      ...styles.actionBtn,
                      ...(isFavorited ? styles.actionBtnActive : {}),
                    }}
                    onClick={handleToggleFavorite}
                  >
                    <Heart
                      size={16}
                      fill={isFavorited ? "currentColor" : "none"}
                    />
                    {isFavorited ? "Saved" : "Save"}
                  </button>
                  <button style={styles.actionBtn} onClick={handleExport}>
                    <Download size={16} />
                    Export
                  </button>
                </>
              )}
              <button
                style={styles.clearBtn}
                onClick={handleClearText}
                disabled={!text}
              >
                <Trash2 size={16} />
                Clear
              </button>
            </div>
          </div>

          {/* PLAYBACK CARD */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Playback Control</h3>
            <p style={styles.cardSub}>Adjust animation speed</p>

            <div style={styles.speedControl}>
              <div style={styles.speedHeader}>
                <span style={styles.speedLabel}>Speed</span>
                <span style={styles.speedBadge}>{playbackSpeed}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.25"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                style={styles.slider}
              />
              <div style={styles.speedMarkers}>
                <span>0.5x</span>
                <span>1x</span>
                <span>2x</span>
              </div>
            </div>

            <div style={styles.actionGrid}>
              <button
                onClick={handlePlay}
                disabled={!text.trim() || isPlaying}
                style={{
                  ...styles.primaryBtn,
                  ...(isPlaying ? styles.btnPlaying : {}),
                }}
              >
                {isPlaying ? (
                  <>
                    <Pause size={18} />
                    <span>Playing...</span>
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    <span>Play Signs</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSpeak}
                disabled={!text.trim()}
                style={styles.secondaryBtn}
              >
                <Volume2 size={18} />
                Speak
              </button>
            </div>
          </div>

          {/* RECENT & FAVORITES */}
          {(recentTexts.length > 0 || favorites.length > 0) && (
            <div style={styles.card}>
              <div style={styles.tabsHeader}>
                <button
                  style={{
                    ...styles.tabBtn,
                    ...(showFavorites ? {} : styles.tabBtnActive),
                  }}
                  onClick={() => setShowFavorites(false)}
                >
                  <Clock size={16} />
                  Recent
                </button>
                <button
                  style={{
                    ...styles.tabBtn,
                    ...(showFavorites ? styles.tabBtnActive : {}),
                  }}
                  onClick={() => setShowFavorites(true)}
                >
                  <Heart size={16} />
                  Favorites ({favorites.length})
                </button>
              </div>

              <div style={styles.itemsList}>
                {showFavorites ? (
                  favorites.length > 0 ? (
                    favorites.map((fav, idx) => (
                      <button
                        key={idx}
                        style={styles.itemBtn}
                        onClick={() => handleSelectFavorite(fav.text)}
                      >
                        <div style={styles.itemContent}>
                          <Heart size={14} fill="currentColor" />
                          <span>{fav.text}</span>
                        </div>
                        <span style={styles.itemLength}>
                          {fav.text
                            .toUpperCase()
                            .split("")
                            .filter((c) => /[A-Z]/.test(c)).length}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p style={styles.emptyText}>No favorites yet</p>
                  )
                ) : recentTexts.length > 0 ? (
                  recentTexts.map((recent, idx) => (
                    <button
                      key={idx}
                      style={styles.itemBtn}
                      onClick={() => handleSelectRecent(recent)}
                    >
                      <div style={styles.itemContent}>
                        <Clock size={14} />
                        <span>{recent}</span>
                      </div>
                      <span style={styles.itemLength}>
                        {recent
                          .toUpperCase()
                          .split("")
                          .filter((c) => /[A-Z]/.test(c)).length}
                      </span>
                    </button>
                  ))
                ) : (
                  <p style={styles.emptyText}>No recent items</p>
                )}
              </div>
            </div>
          )}

          {/* TIPS */}
          <div style={styles.tipsCard}>
            <div style={styles.tipsHeader}>
              <Lightbulb size={18} />
              <h3 style={styles.tipsTitle}>Pro Tips</h3>
            </div>
            <ul style={styles.tipsList}>
              <li>Short text → clearer animations</li>
              <li>Save favorites for quick access</li>
              <li>Adjust speed for your pace</li>
              <li>Share animations with others</li>
            </ul>
          </div>

          {/* STATS */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statCardIcon}>🤟</div>
              <p style={styles.statCardLabel}>Alphabet</p>
              <p style={styles.statCardValue}>26 letters</p>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statCardIcon}>⚡</div>
              <p style={styles.statCardLabel}>Speed</p>
              <p style={styles.statCardValue}>Real-time</p>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statCardIcon}>❤️</div>
              <p style={styles.statCardLabel}>Saved</p>
              <p style={styles.statCardValue}>{favorites.length} items</p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - AVATAR */}
        <div style={styles.rightPanel}>
          <div style={styles.avatarCard}>
            <div style={styles.avatarHeader}>
              <div>
                <h2 style={styles.avatarTitle}>Live Preview</h2>
                <p style={styles.avatarSub}>Avatar performs signs</p>
              </div>
              <div
                style={{
                  ...styles.statusBadge,
                  ...(isPlaying ? styles.statusBadgeActive : {}),
                }}
              >
                <span
                  style={{
                    ...styles.statusDot,
                    ...(isPlaying ? styles.statusDotActive : {}),
                  }}
                />
                {isPlaying ? "Performing" : "Ready"}
              </div>
            </div>

            <div style={styles.avatarContainer}>
              <SignAvatar text={text} isPlaying={isPlaying} />
            </div>

            {text && (
              <div style={styles.avatarInfo}>
                <p style={styles.avatarText}>"{text}"</p>
                {isPlaying && (
                  <div style={styles.playingIndicator}>
                    <div style={styles.pulse} />
                    <span>Performing animation...</span>
                  </div>
                )}
              </div>
            )}

            {text && (
              <div style={styles.shareActions}>
                <button style={styles.shareBtn} onClick={handleShare}>
                  <Share2 size={16} />
                  Share
                </button>
                <button style={styles.shareBtn} onClick={handleExport}>
                  <Download size={16} />
                  Export
                </button>
              </div>
            )}
          </div>

          {/* INFO BOX */}
          <div style={styles.infoBox}>
            <div style={styles.infoBadge}>
              <Users size={16} />
            </div>
            <div>
              <h4 style={styles.infoTitle}>How it works</h4>
              <p style={styles.infoText}>
                Type text above, adjust speed, and click Play to watch our trained avatar
                perform sign language. Each letter appears sequentially for clarity.
              </p>
            </div>
          </div>

          {/* FEATURE LIST */}
          <div style={styles.featureBox}>
            <h4 style={styles.featureTitle}>Features</h4>
            <div style={styles.featureList}>
              <div style={styles.featureItem}>
                <span style={styles.featureDot}>✓</span>
                <span>Speed adjustment</span>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featureDot}>✓</span>
                <span>Save favorites</span>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featureDot}>✓</span>
                <span>Share animations</span>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featureDot}>✓</span>
                <span>Text to speech</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  /* TOAST */
  toast: {
    position: "fixed",
    top: 20,
    right: 20,
    padding: "12px 16px",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    zIndex: 1000,
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
    fontWeight: 500,
    fontSize: 13,
    animation: "slideIn 0.3s ease-out",
  },
  toast_success: {
    background: "#f0fdf4",
    color: "#166534",
    border: "1px solid #bbf7d0",
  },
  toast_error: {
    background: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecaca",
  },
  toast_info: {
    background: "#eff6ff",
    color: "#0c4a6e",
    border: "1px solid #bae6fd",
  },
  toastContent: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  toastClose: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "inherit",
    padding: 0,
    display: "flex",
    alignItems: "center",
  },

  pageWrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e0e7ff 100%)",
    padding: "32px 20px",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },

  /* HEADER */
  header: {
    marginBottom: 40,
  },
  headerContent: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
  },
  titleWrap: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    boxShadow: "0 4px 20px rgba(99, 102, 241, 0.25)",
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#64748b",
    margin: "6px 0 0",
  },
  headerBadges: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  headerBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "8px 14px",
    fontSize: 12,
    fontWeight: 600,
    color: "#6366f1",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },

  /* GRID */
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 28,
    maxWidth: 1400,
    margin: "0 auto",
  },
  leftPanel: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  rightPanel: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },

  /* CARD */
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },
  cardSub: {
    fontSize: 12,
    color: "#64748b",
    margin: "4px 0 0",
  },
  charCounter: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 12,
    fontWeight: 600,
    color: "#94a3b8",
    background: "#f8fafc",
    padding: "6px 12px",
    borderRadius: 8,
    flexShrink: 0,
  },
  charCount: {
    color: "#6366f1",
    fontWeight: 700,
  },
  charMax: {
    color: "#94a3b8",
  },

  /* TEXTAREA */
  textarea: {
    width: "100%",
    height: 140,
    padding: "16px",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    fontSize: 14,
    color: "#0f172a",
    background: "#f8fafc",
    outline: "none",
    resize: "none",
    fontFamily: "inherit",
    transition: "all 0.2s",
    lineHeight: 1.6,
  },

  /* STATS */
  statsRow: {
    display: "flex",
    gap: 16,
    margin: "12px 0 0",
    padding: "12px 0",
    borderTop: "1px solid #f1f5f9",
  },
  statItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
  },
  statLabel: {
    color: "#64748b",
    fontWeight: 500,
  },
  statValue: {
    color: "#6366f1",
    fontWeight: 700,
  },

  /* TEXT ACTIONS */
  textActions: {
    display: "flex",
    gap: 8,
    marginTop: 12,
    flexWrap: "wrap",
  },
  actionBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    background: "#f8fafc",
    color: "#475569",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  actionBtnSuccess: {
    background: "#f0fdf4",
    color: "#16a34a",
    border: "1px solid #bbf7d0",
  },
  actionBtnActive: {
    background: "#ffe4e6",
    color: "#be185d",
    border: "1px solid #fbcfe8",
  },
  clearBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 12px",
    border: "1px solid #fee2e2",
    borderRadius: 8,
    background: "#fef2f2",
    color: "#dc2626",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
  },

  /* SPEED CONTROL */
  speedControl: {
    marginTop: 16,
  },
  speedHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  speedLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#0f172a",
  },
  speedBadge: {
    background: "#eef2ff",
    color: "#6366f1",
    padding: "4px 10px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 700,
  },
  slider: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    background: "#e2e8f0",
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
    accentColor: "#6366f1",
    marginBottom: 8,
  },
  speedMarkers: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: 500,
  },

  /* TABS */
  tabsHeader: {
    display: "flex",
    gap: 8,
    marginBottom: 16,
    padding: "0 0 12px",
    borderBottom: "1px solid #f1f5f9",
  },
  tabBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 12px",
    border: "none",
    background: "transparent",
    color: "#64748b",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "color 0.15s",
  },
  tabBtnActive: {
    color: "#6366f1",
    borderBottom: "2px solid #6366f1",
  },

  /* ITEMS LIST */
  itemsList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  itemBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    background: "#f8fafc",
    cursor: "pointer",
    transition: "all 0.15s",
    fontSize: 12,
    color: "#0f172a",
    fontWeight: 500,
  },
  itemContent: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
    flex: 1,
  },
  itemLength: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: 600,
    flexShrink: 0,
  },
  emptyText: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 12,
    margin: "12px 0",
  },

  /* ACTION GRID */
  actionGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 16,
  },
  primaryBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "12px 16px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  btnPlaying: {
    background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
    opacity: 0.85,
  },
  secondaryBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "12px 16px",
    background: "#f8fafc",
    color: "#475569",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },

  /* TIPS */
  tipsCard: {
    background: "linear-gradient(135deg, #fef9c3 0%, #fef3c7 100%)",
    border: "1px solid #fcd34d",
    borderRadius: 16,
    padding: 20,
  },
  tipsHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    color: "#92400e",
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#92400e",
    margin: 0,
  },
  tipsList: {
    margin: 0,
    paddingLeft: 18,
    listStyle: "disc",
    color: "#b45309",
    fontSize: 12,
  },

  /* STATS GRID */
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
  },
  statCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: 16,
    textAlign: "center",
    transition: "all 0.2s",
  },
  statCardIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statCardLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 4px",
  },
  statCardValue: {
    fontSize: 11,
    color: "#64748b",
    margin: 0,
  },

  /* AVATAR CARD */
  avatarCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  avatarHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  avatarTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },
  avatarSub: {
    fontSize: 12,
    color: "#64748b",
    margin: "4px 0 0",
  },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 600,
    color: "#64748b",
    flexShrink: 0,
  },
  statusBadgeActive: {
    background: "#f0fdf4",
    color: "#16a34a",
    border: "1px solid #bbf7d0",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#cbd5e1",
  },
  statusDotActive: {
    background: "#16a34a",
    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  },

  /* AVATAR CONTAINER */
  avatarContainer: {
    height: 550,
    background: "linear-gradient(135deg, #f0f4ff 0%, #f5f3ff 50%, #fff0f6 100%)",
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 16,
    border: "1px solid #e2e8f0",
  },

  /* AVATAR INFO */
  avatarInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  avatarText: {
    fontSize: 14,
    color: "#0f172a",
    fontStyle: "italic",
    margin: 0,
    padding: 12,
    background: "#f8fafc",
    borderRadius: 10,
    borderLeft: "3px solid #6366f1",
    wordBreak: "break-word",
  },
  playingIndicator: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: 8,
    fontSize: 12,
    color: "#16a34a",
    fontWeight: 500,
  },
  pulse: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#16a34a",
    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  },

  /* SHARE ACTIONS */
  shareActions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    marginTop: 12,
  },
  shareBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "10px 14px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    color: "#475569",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
  },

  /* INFO BOX */
  infoBox: {
    background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
    border: "1px solid #bae6fd",
    borderRadius: 16,
    padding: 20,
    display: "flex",
    gap: 12,
  },
  infoBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "#0ea5e9",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0c4a6e",
    margin: 0,
  },
  infoText: {
    fontSize: 12,
    color: "#0369a1",
    margin: "4px 0 0",
    lineHeight: 1.5,
  },

  /* FEATURE BOX */
  featureBox: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 20,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 12px",
  },
  featureList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    color: "#475569",
  },
  featureDot: {
    color: "#10b981",
    fontWeight: 700,
    fontSize: 14,
  },
};

export default TextToSignPageEnhanced;