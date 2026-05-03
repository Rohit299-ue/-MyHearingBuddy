import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  Settings,
  ChevronDown,
  Bell,
  Moon,
  Sun,
  Save,
  Trash2,
  LogOut,
  Copy,
  Check,
  AlertCircle,
  Volume2,
  Zap,
  Shield,
  Eye,
  EyeOff,
  Home,
  HelpCircle,
} from "lucide-react";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, settings, updateSettings, logout, clearHistory } = useApp();

  const [savedMsg, setSavedMsg] = useState("");
  const [testStatus, setTestStatus] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [textSize, setTextSize] = useState("Medium");

  const handleSave = () => {
    setShowToast({ type: "success", msg: "Settings saved successfully! ✓" });
    setSavedMsg("Settings Saved Successfully ✓");
    setTimeout(() => {
      setSavedMsg("");
      setShowToast(null);
    }, 3000);
  };

  const handleTestConnection = () => {
    setTestStatus("testing");
    setTimeout(() => {
      setTestStatus("success");
      setShowToast({ type: "success", msg: "Connection successful! ✓" });
      setTimeout(() => {
        setTestStatus("");
        setShowToast(null);
      }, 2500);
    }, 1500);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(settings.backendUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleClearData = () => {
    clearHistory();
    setDeleteConfirm(false);
    setShowToast({ type: "success", msg: "All history cleared successfully" });
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{
      ...styles.pageWrapper,
      background: settings.darkMode ? '#0f172a' : '#f8fafc'
    }}>
      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div style={{ ...styles.toast, ...styles[`toast_${showToast.type}`] }}>
          <div style={styles.toastContent}>
            {showToast.type === "success" ? (
              <Check size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{showToast.msg}</span>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside style={{
        ...styles.sidebar,
        background: settings.darkMode ? '#1e293b' : '#0f172a',
        borderRight: settings.darkMode ? '1px solid #334155' : '1px solid #1e293b'
      }}>
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>🤟</div>
          <div>
            <p style={styles.logoTitle}>MyHearingBuddy</p>
            <p style={styles.logoSub}>Settings Hub</p>
          </div>
        </div>

        <nav style={styles.nav}>
          {[
            { label: "Overview", icon: <Home size={18} />, active: false },
            { label: "Settings", icon: <Settings size={18} />, active: true },
            { label: "Help", icon: <HelpCircle size={18} />, active: false },
          ].map((item) => (
            <button
              key={item.label}
              style={item.active ? styles.navItemActive : styles.navItem}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={styles.sidebarBottom}>
          <div 
            style={{ ...styles.userCard, cursor: 'pointer' }} 
            onClick={() => navigate('/profile')}
          >
            <div style={styles.userAvatar}>
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <p style={styles.userName}>{user?.name || "User"}</p>
              <p style={styles.userEmail}>{user?.email || "user@example.com"}</p>
            </div>
          </div>
          <button style={styles.logoutBtn} onClick={() => setLogoutConfirm(true)}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={{
              ...styles.pageTitle,
              color: settings.darkMode ? '#f1f5f9' : '#0f172a'
            }}>Settings</h1>
            <p style={styles.pageSubtitle}>Customize your MyHearingBuddy experience</p>
          </div>
          <div style={styles.topbarButtons}>
            <button style={{
              ...styles.iconBtn,
              background: settings.darkMode ? '#1e293b' : '#fff',
              borderColor: settings.darkMode ? '#334155' : '#e2e8f0',
              color: settings.darkMode ? '#cbd5e1' : '#475569'
            }} title="Notifications">
              <Bell size={18} />
            </button>
            <button
              style={{
                ...styles.iconBtn,
                background: settings.darkMode ? '#1e293b' : '#fff',
                borderColor: settings.darkMode ? '#334155' : '#e2e8f0',
                color: settings.darkMode ? '#cbd5e1' : '#475569'
              }}
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              title="Toggle theme"
            >
              {settings.darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* SAVE MESSAGE */}
        {savedMsg && (
          <div style={styles.successBanner}>
            <Check size={16} style={{ flexShrink: 0 }} />
            <span>{savedMsg}</span>
          </div>
        )}

        {/* SETTINGS GRID */}
        <div style={styles.grid}>
          {/* DETECTION SETTINGS */}
          <div style={{
            ...styles.card,
            background: settings.darkMode ? '#1e293b' : '#fff',
            borderColor: settings.darkMode ? '#334155' : '#e2e8f0'
          }}>
            <div style={styles.cardHeader}>
              <div>
                <h2 style={{
                  ...styles.cardTitle,
                  color: settings.darkMode ? '#f1f5f9' : '#0f172a'
                }}>Detection Settings</h2>
                <p style={styles.cardSub}>Customize detection behavior</p>
              </div>
              <div style={styles.cardIcon}>
                <Zap size={20} />
              </div>
            </div>

            <div style={styles.cardDivider} />

            <div style={styles.settingGroup}>
              <label style={{
                ...styles.label,
                color: settings.darkMode ? '#f1f5f9' : '#0f172a'
              }}>Detection Mode</label>
              <select
                style={{
                  ...styles.select,
                  background: settings.darkMode ? '#0f172a' : '#f8fafc',
                  borderColor: settings.darkMode ? '#334155' : '#e2e8f0',
                  color: settings.darkMode ? '#f1f5f9' : '#0f172a'
                }}
                value={settings.detectionMode}
                onChange={(e) =>
                  updateSettings({ detectionMode: e.target.value })
                }
              >
                <option value="manual">Manual</option>
                <option value="optimized">Optimized</option>
                <option value="realtime">Realtime</option>
              </select>
              <p style={styles.helpText}>
                Choose how the app detects sign language input
              </p>
            </div>

            <div style={styles.settingGroup}>
              <div style={styles.sliderHeader}>
                <label style={{
                  ...styles.label,
                  color: settings.darkMode ? '#f1f5f9' : '#0f172a'
                }}>Detection Speed</label>
                <span style={styles.sliderValue}>{settings.detectionSpeed}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.detectionSpeed}
                onChange={(e) =>
                  updateSettings({
                    detectionSpeed: parseInt(e.target.value),
                  })
                }
                style={styles.slider}
              />
              <p style={styles.helpText}>Adjust processing speed vs accuracy</p>
            </div>
          </div>

          {/* APPEARANCE SETTINGS */}
          <div style={{
            ...styles.card,
            background: settings.darkMode ? '#1e293b' : '#fff',
            borderColor: settings.darkMode ? '#334155' : '#e2e8f0'
          }}>
            <div style={styles.cardHeader}>
              <div>
                <h2 style={{
                  ...styles.cardTitle,
                  color: settings.darkMode ? '#f1f5f9' : '#0f172a'
                }}>Appearance</h2>
                <p style={styles.cardSub}>Visual preferences</p>
              </div>
              <div style={styles.cardIcon}>
                <Eye size={20} />
              </div>
            </div>

            <div style={{
              ...styles.cardDivider,
              background: settings.darkMode ? '#334155' : '#f1f5f9'
            }} />

            <div style={styles.toggleSetting}>
              <div>
                <p style={{
                  ...styles.toggleLabel,
                  color: settings.darkMode ? '#f1f5f9' : '#0f172a'
                }}>Dark Mode</p>
                <p style={styles.toggleSub}>Use dark theme</p>
              </div>
              <button
                style={{
                  ...styles.toggleSwitch,
                  background: settings.darkMode ? "#6366f1" : "#cbd5e1",
                }}
                onClick={() =>
                  updateSettings({ darkMode: !settings.darkMode })
                }
              >
                <div
                  style={{
                    ...styles.toggleDot,
                    transform: settings.darkMode ? "translateX(24px)" : "translateX(0)",
                  }}
                />
              </button>
            </div>

            <div style={styles.settingGroup}>
              <label style={{
                ...styles.label,
                color: settings.darkMode ? '#f1f5f9' : '#0f172a'
              }}>Text Size</label>
              <div style={styles.buttonGroup}>
                {["Small", "Medium", "Large"].map((size) => (
                  <button 
                    key={size} 
                    style={{
                      ...styles.sizeBtn,
                      background: textSize === size ? "#6366f1" : (settings.darkMode ? '#0f172a' : '#f8fafc'),
                      color: textSize === size ? "#fff" : (settings.darkMode ? '#cbd5e1' : '#475569'),
                      borderColor: textSize === size ? "#6366f1" : (settings.darkMode ? '#334155' : '#e2e8f0')
                    }}
                    onClick={() => setTextSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AUDIO SETTINGS */}
          <div style={{
            ...styles.card,
            background: settings.darkMode ? '#1e293b' : '#fff',
            borderColor: settings.darkMode ? '#334155' : '#e2e8f0'
          }}>
            <div style={styles.cardHeader}>
              <div>
                <h2 style={{
                  ...styles.cardTitle,
                  color: settings.darkMode ? '#f1f5f9' : '#0f172a'
                }}>Audio & Notifications</h2>
                <p style={styles.cardSub}>Sound and alert preferences</p>
              </div>
              <div style={styles.cardIcon}>
                <Volume2 size={20} />
              </div>
            </div>

            <div style={{
              ...styles.cardDivider,
              background: settings.darkMode ? '#334155' : '#f1f5f9'
            }} />

            <div style={styles.toggleSetting}>
              <div>
                <p style={{
                  ...styles.toggleLabel,
                  color: settings.darkMode ? '#f1f5f9' : '#0f172a'
                }}>Sound Effects</p>
                <p style={styles.toggleSub}>Enable UI sound effects</p>
              </div>
              <button style={styles.toggleSwitch} />
            </div>

            <div style={styles.toggleSetting}>
              <div>
                <p style={{
                  ...styles.toggleLabel,
                  color: settings.darkMode ? '#f1f5f9' : '#0f172a'
                }}>Desktop Notifications</p>
                <p style={styles.toggleSub}>Get alerts for important events</p>
              </div>
              <button style={styles.toggleSwitch} />
            </div>
          </div>

          {/* BACKEND CONFIGURATION */}
          <div style={{
            ...styles.card,
            background: settings.darkMode ? '#1e293b' : '#fff',
            borderColor: settings.darkMode ? '#334155' : '#e2e8f0'
          }}>
            <div style={styles.cardHeader}>
              <div>
                <h2 style={{
                  ...styles.cardTitle,
                  color: settings.darkMode ? '#f1f5f9' : '#0f172a'
                }}>Backend Configuration</h2>
                <p style={styles.cardSub}>Connect to your API server</p>
              </div>
              <div style={styles.cardIcon}>
                <Shield size={20} />
              </div>
            </div>

            <div style={{
              ...styles.cardDivider,
              background: settings.darkMode ? '#334155' : '#f1f5f9'
            }} />

            <div style={styles.settingGroup}>
              <label style={{
                ...styles.label,
                color: settings.darkMode ? '#f1f5f9' : '#0f172a'
              }}>Backend URL</label>
              <div style={styles.inputWithButton}>
                <input
                  type="text"
                  value={settings.backendUrl}
                  onChange={(e) =>
                    updateSettings({ backendUrl: e.target.value })
                  }
                  placeholder="https://api.example.com"
                  style={{
                    ...styles.input,
                    background: settings.darkMode ? '#0f172a' : '#f8fafc',
                    borderColor: settings.darkMode ? '#334155' : '#e2e8f0',
                    color: settings.darkMode ? '#f1f5f9' : '#0f172a'
                  }}
                />
                <button
                  style={{
                    ...styles.copyBtn,
                    background: settings.darkMode ? '#0f172a' : '#f8fafc',
                    borderColor: settings.darkMode ? '#334155' : '#e2e8f0',
                    color: settings.darkMode ? '#cbd5e1' : '#475569'
                  }}
                  onClick={handleCopyUrl}
                  title="Copy URL"
                >
                  {copiedUrl ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
              <p style={styles.helpText}>Your backend API endpoint</p>
            </div>

            <button
              onClick={handleTestConnection}
              style={{
                ...styles.primaryBtn,
                ...(testStatus === "success"
                  ? { background: "#10b981", color: "#fff" }
                  : {}),
              }}
              disabled={testStatus === "testing"}
            >
              {testStatus === "testing" ? (
                <span style={styles.loadingSpinner} />
              ) : testStatus === "success" ? (
                <>
                  <Check size={16} />
                  Connected
                </>
              ) : (
                "Test Connection"
              )}
            </button>
          </div>

          {/* SECURITY & PRIVACY */}
          <div style={{
            ...styles.card,
            background: settings.darkMode ? '#1e293b' : '#fff',
            borderColor: settings.darkMode ? '#334155' : '#e2e8f0'
          }}>
            <div style={styles.cardHeader}>
              <div>
                <h2 style={{
                  ...styles.cardTitle,
                  color: settings.darkMode ? '#f1f5f9' : '#0f172a'
                }}>Security & Privacy</h2>
                <p style={styles.cardSub}>Manage your data and security</p>
              </div>
              <div style={styles.cardIcon}>
                <Shield size={20} />
              </div>
            </div>

            <div style={{
              ...styles.cardDivider,
              background: settings.darkMode ? '#334155' : '#f1f5f9'
            }} />

            <div style={styles.toggleSetting}>
              <div>
                <p style={{
                  ...styles.toggleLabel,
                  color: settings.darkMode ? '#f1f5f9' : '#0f172a'
                }}>Analytics</p>
                <p style={styles.toggleSub}>Help improve the app</p>
              </div>
              <button style={styles.toggleSwitch} />
            </div>

            <div style={styles.toggleSetting}>
              <div>
                <p style={{
                  ...styles.toggleLabel,
                  color: settings.darkMode ? '#f1f5f9' : '#0f172a'
                }}>Auto-save</p>
                <p style={styles.toggleSub}>Save progress automatically</p>
              </div>
              <button
                style={{
                  ...styles.toggleSwitch,
                  background: "#6366f1",
                }}
              >
                <div
                  style={{
                    ...styles.toggleDot,
                    transform: "translateX(24px)",
                  }}
                />
              </button>
            </div>
          </div>

          {/* DATA MANAGEMENT */}
          <div style={{
            ...styles.card,
            background: settings.darkMode ? '#1e293b' : '#fff',
            borderColor: settings.darkMode ? '#334155' : '#e2e8f0'
          }}>
            <div style={styles.cardHeader}>
              <div>
                <h2 style={{
                  ...styles.cardTitle,
                  color: settings.darkMode ? '#f1f5f9' : '#0f172a'
                }}>Data Management</h2>
                <p style={styles.cardSub}>Manage your saved data</p>
              </div>
              <div style={styles.cardIcon}>
                <Trash2 size={20} />
              </div>
            </div>

            <div style={styles.cardDivider} />

            <div style={styles.infoBox}>
              <AlertCircle size={16} />
              <div>
                <p style={styles.infoTitle}>Clear History</p>
                <p style={styles.infoText}>
                  This will permanently delete all your saved records
                </p>
              </div>
            </div>

            {deleteConfirm ? (
              <div style={styles.confirmBox}>
                <p style={styles.confirmText}>Are you sure?</p>
                <div style={styles.confirmButtons}>
                  <button
                    style={styles.cancelBtn}
                    onClick={() => setDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={handleClearData}
                  >
                    Delete All
                  </button>
                </div>
              </div>
            ) : (
              <button
                style={styles.dangerBtn}
                onClick={() => setDeleteConfirm(true)}
              >
                <Trash2 size={16} />
                Clear All History
              </button>
            )}
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div style={{
          ...styles.footerActions,
          borderTop: settings.darkMode ? '1px solid #334155' : '1px solid #e2e8f0'
        }}>
          <button style={{
            ...styles.secondaryBtn,
            background: settings.darkMode ? '#1e293b' : '#f8fafc',
            borderColor: settings.darkMode ? '#334155' : '#e2e8f0',
            color: settings.darkMode ? '#f1f5f9' : '#0f172a'
          }} onClick={() => navigate("/")}>
            ← Back to Home
          </button>
          <button style={styles.primaryBtn} onClick={handleSave}>
            <Save size={16} />
            Save All Settings
          </button>
        </div>
      </main>

      {/* LOGOUT CONFIRMATION MODAL */}
      {logoutConfirm && (
        <div style={styles.modalOverlay} onClick={() => setLogoutConfirm(false)}>
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={styles.modalTitle}>Confirm Logout</h3>
            <p style={styles.modalText}>
              Are you sure you want to logout? You'll need to login again to access your account.
            </p>
            <div style={styles.modalButtons}>
              <button
                style={styles.cancelBtn}
                onClick={() => setLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                style={styles.deleteBtn}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  /* TOAST */
  toast: {
    position: "fixed",
    top: 20,
    right: 20,
    padding: "12px 18px",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    gap: 10,
    zIndex: 1000,
    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
    animation: "slideIn 0.3s ease-out",
    fontWeight: 500,
    fontSize: 14,
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
  toastContent: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  pageWrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },

  /* SIDEBAR */
  sidebar: {
    width: 240,
    background: "#0f172a",
    display: "flex",
    flexDirection: "column",
    padding: "28px 16px",
    gap: 8,
    flexShrink: 0,
    borderRight: "1px solid #1e293b",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 32,
    paddingLeft: 8,
  },
  logoIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
  },
  logoTitle: {
    color: "#f1f5f9",
    fontWeight: 700,
    fontSize: 15,
    margin: 0,
    letterSpacing: "-0.3px",
  },
  logoSub: {
    color: "#64748b",
    fontSize: 11,
    margin: "2px 0 0",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 10,
    background: "transparent",
    border: "none",
    color: "#64748b",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.15s",
  },
  navItemActive: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 10,
    background: "#1e293b",
    border: "none",
    color: "#818cf8",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "left",
  },
  sidebarBottom: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "16px 12px",
    borderTop: "1px solid #1e293b",
    marginTop: 8,
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "#6366f1",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 700,
    flexShrink: 0,
  },
  userName: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: 600,
    margin: 0,
  },
  userEmail: {
    color: "#475569",
    fontSize: 10,
    margin: "2px 0 0",
  },
  logoutBtn: {
    width: 34,
    height: 34,
    border: "1px solid #ef4444",
    borderRadius: 8,
    background: "#fee2e2",
    color: "#dc2626",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.15s",
    flexShrink: 0,
  },

  /* MAIN */
  main: {
    flex: 1,
    padding: "32px 40px",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 32,
    flexWrap: "wrap",
    gap: 20,
  },
  pageTitle: {
    fontSize: 28,
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
  topbarButtons: {
    display: "flex",
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#475569",
    transition: "all 0.15s",
  },

  /* SUCCESS BANNER */
  successBanner: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: 12,
    padding: "12px 16px",
    marginBottom: 24,
    color: "#166534",
    fontSize: 14,
    fontWeight: 500,
  },

  /* GRID */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: 20,
    marginBottom: 32,
  },

  /* CARD */
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    transition: "all 0.2s",
  },
  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
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
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "#eef2ff",
    color: "#6366f1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardDivider: {
    height: "1px",
    background: "#f1f5f9",
    margin: "16px 0",
  },

  /* SETTINGS GROUP */
  settingGroup: {
    marginBottom: 20,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#0f172a",
    marginBottom: 8,
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    fontSize: 13,
    color: "#0f172a",
    background: "#f8fafc",
    cursor: "pointer",
    outline: "none",
    transition: "all 0.15s",
    fontWeight: 500,
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    backgroundSize: "18px",
    paddingRight: "36px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    fontSize: 13,
    color: "#0f172a",
    background: "#f8fafc",
    outline: "none",
    transition: "all 0.15s",
  },
  inputWithButton: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  copyBtn: {
    width: 36,
    height: 36,
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    background: "#f8fafc",
    color: "#475569",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.15s",
    flexShrink: 0,
  },
  helpText: {
    fontSize: 12,
    color: "#94a3b8",
    margin: "6px 0 0",
  },

  /* SLIDER */
  sliderHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sliderValue: {
    fontSize: 13,
    fontWeight: 700,
    color: "#6366f1",
    background: "#eef2ff",
    padding: "4px 10px",
    borderRadius: 6,
  },
  slider: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    background: "#e2e8f0",
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
  },

  /* TOGGLE */
  toggleSetting: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #f1f5f9",
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#0f172a",
    margin: 0,
  },
  toggleSub: {
    fontSize: 12,
    color: "#64748b",
    margin: "4px 0 0",
  },
  toggleSwitch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    border: "none",
    background: "#cbd5e1",
    cursor: "pointer",
    position: "relative",
    transition: "background 0.2s",
    flexShrink: 0,
  },
  toggleDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    background: "#fff",
    position: "absolute",
    top: 2,
    left: 2,
    transition: "transform 0.2s",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },

  /* BUTTONS */
  buttonGroup: {
    display: "flex",
    gap: 8,
  },
  sizeBtn: {
    flex: 1,
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    background: "#f8fafc",
    fontSize: 12,
    fontWeight: 600,
    color: "#475569",
    cursor: "pointer",
    transition: "all 0.15s",
  },

  primaryBtn: {
    width: "100%",
    padding: "10px 16px",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "all 0.15s",
    marginTop: 12,
  },
  dangerBtn: {
    width: "100%",
    padding: "10px 16px",
    background: "#fee2e2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "all 0.15s",
  },
  secondaryBtn: {
    padding: "10px 16px",
    background: "#f8fafc",
    color: "#0f172a",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  cancelBtn: {
    flex: 1,
    padding: "10px 16px",
    background: "#f8fafc",
    color: "#0f172a",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  deleteBtn: {
    flex: 1,
    padding: "10px 16px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
  },

  /* INFO BOX */
  infoBox: {
    display: "flex",
    gap: 12,
    background: "#fef3c7",
    border: "1px solid #fcd34d",
    borderRadius: 10,
    padding: "12px",
    marginBottom: 16,
    fontSize: 13,
    color: "#92400e",
  },
  infoTitle: {
    fontWeight: 600,
    margin: 0,
  },
  infoText: {
    fontSize: 12,
    color: "#b45309",
    margin: "2px 0 0",
  },

  /* CONFIRM BOX */
  confirmBox: {
    background: "#fee2e2",
    border: "1px solid #fecaca",
    borderRadius: 10,
    padding: "16px",
    marginTop: 12,
  },
  confirmText: {
    color: "#991b1b",
    fontWeight: 600,
    margin: "0 0 12px",
    fontSize: 13,
  },
  confirmButtons: {
    display: "flex",
    gap: 8,
  },

  /* FOOTER ACTIONS */
  footerActions: {
    display: "flex",
    gap: 12,
    justifyContent: "flex-end",
    paddingTop: 24,
    borderTop: "1px solid #e2e8f0",
  },

  /* MODAL */
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  },
  modal: {
    background: "#fff",
    borderRadius: 14,
    padding: "32px",
    maxWidth: 400,
    width: "90%",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 12px",
  },
  modalText: {
    fontSize: 14,
    color: "#64748b",
    margin: "0 0 24px",
    lineHeight: 1.5,
  },
  modalButtons: {
    display: "flex",
    gap: 8,
  },

  /* LOADING SPINNER */
  loadingSpinner: {
    display: "inline-block",
    width: 14,
    height: 14,
    border: "2px solid #e5e7eb",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },
};

export default SettingsPage;