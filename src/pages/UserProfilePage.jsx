import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  X,
  Camera,
  ArrowLeft,
  Shield,
  Bell,
  Globe,
} from "lucide-react";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser, settings } = useApp();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    dateOfBirth: user?.dateOfBirth || "",
    bio: user?.bio || "",
  });

  const [showToast, setShowToast] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    updateUser(formData);
    setShowToast({ type: "success", msg: "Profile updated successfully! ✓" });
    setTimeout(() => {
      setShowToast(null);
      navigate(-1);
    }, 2000);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div
      style={{
        ...styles.pageWrapper,
        background: settings.darkMode ? "#0f172a" : "#f8fafc",
      }}
    >
      {/* TOAST */}
      {showToast && (
        <div style={{ ...styles.toast, ...styles[`toast_${showToast.type}`] }}>
          <div style={styles.toastContent}>
            <Save size={18} />
            <span>{showToast.msg}</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div
        style={{
          ...styles.header,
          background: settings.darkMode ? "#1e293b" : "#fff",
          borderBottom: settings.darkMode
            ? "1px solid #334155"
            : "1px solid #e2e8f0",
        }}
      >
        <button
          style={{
            ...styles.backBtn,
            background: settings.darkMode ? "#0f172a" : "#f8fafc",
            borderColor: settings.darkMode ? "#334155" : "#e2e8f0",
            color: settings.darkMode ? "#f1f5f9" : "#0f172a",
          }}
          onClick={handleCancel}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div>
          <h1
            style={{
              ...styles.pageTitle,
              color: settings.darkMode ? "#f1f5f9" : "#0f172a",
            }}
          >
            Edit Profile
          </h1>
          <p style={styles.pageSubtitle}>Update your personal information</p>
        </div>

        <div style={{ width: 100 }} />
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.main}>
        <div style={styles.container}>
          {/* AVATAR SECTION */}
          <div
            style={{
              ...styles.avatarSection,
              background: settings.darkMode ? "#1e293b" : "#fff",
              borderColor: settings.darkMode ? "#334155" : "#e2e8f0",
            }}
          >
            <div style={styles.avatarWrap}>
              <div style={styles.avatar}>
                {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
              </div>
              <button style={styles.avatarBtn}>
                <Camera size={16} />
              </button>
            </div>
            <div style={{ textAlign: "center" }}>
              <h2
                style={{
                  ...styles.avatarName,
                  color: settings.darkMode ? "#f1f5f9" : "#0f172a",
                }}
              >
                {formData.name || "User"}
              </h2>
              <p style={styles.avatarEmail}>{formData.email || "user@email.com"}</p>
            </div>
          </div>

          {/* FORM GRID */}
          <div style={styles.formGrid}>
            {/* PERSONAL INFO CARD */}
            <div
              style={{
                ...styles.card,
                background: settings.darkMode ? "#1e293b" : "#fff",
                borderColor: settings.darkMode ? "#334155" : "#e2e8f0",
              }}
            >
              <div style={styles.cardHeader}>
                <div style={styles.cardIcon}>
                  <User size={20} />
                </div>
                <div>
                  <h3
                    style={{
                      ...styles.cardTitle,
                      color: settings.darkMode ? "#f1f5f9" : "#0f172a",
                    }}
                  >
                    Personal Information
                  </h3>
                  <p style={styles.cardSub}>Basic details about you</p>
                </div>
              </div>

              <div
                style={{
                  ...styles.cardDivider,
                  background: settings.darkMode ? "#334155" : "#f1f5f9",
                }}
              />

              <div style={styles.formGroup}>
                <label
                  style={{
                    ...styles.label,
                    color: settings.darkMode ? "#f1f5f9" : "#0f172a",
                  }}
                >
                  <User size={16} style={{ marginRight: 8 }} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  style={{
                    ...styles.input,
                    background: settings.darkMode ? "#0f172a" : "#f8fafc",
                    borderColor: settings.darkMode ? "#334155" : "#e2e8f0",
                    color: settings.darkMode ? "#f1f5f9" : "#0f172a",
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label
                  style={{
                    ...styles.label,
                    color: settings.darkMode ? "#f1f5f9" : "#0f172a",
                  }}
                >
                  <Calendar size={16} style={{ marginRight: 8 }} />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    background: settings.darkMode ? "#0f172a" : "#f8fafc",
                    borderColor: settings.darkMode ? "#334155" : "#e2e8f0",
                    color: settings.darkMode ? "#f1f5f9" : "#0f172a",
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label
                  style={{
                    ...styles.label,
                    color: settings.darkMode ? "#f1f5f9" : "#0f172a",
                  }}
                >
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  style={{
                    ...styles.textarea,
                    background: settings.darkMode ? "#0f172a" : "#f8fafc",
                    borderColor: settings.darkMode ? "#334155" : "#e2e8f0",
                    color: settings.darkMode ? "#f1f5f9" : "#0f172a",
                  }}
                />
              </div>
            </div>

            {/* CONTACT INFO CARD */}
            <div
              style={{
                ...styles.card,
                background: settings.darkMode ? "#1e293b" : "#fff",
                borderColor: settings.darkMode ? "#334155" : "#e2e8f0",
              }}
            >
              <div style={styles.cardHeader}>
                <div style={styles.cardIcon}>
                  <Mail size={20} />
                </div>
                <div>
                  <h3
                    style={{
                      ...styles.cardTitle,
                      color: settings.darkMode ? "#f1f5f9" : "#0f172a",
                    }}
                  >
                    Contact Information
                  </h3>
                  <p style={styles.cardSub}>How we can reach you</p>
                </div>
              </div>

              <div
                style={{
                  ...styles.cardDivider,
                  background: settings.darkMode ? "#334155" : "#f1f5f9",
                }}
              />

              <div style={styles.formGroup}>
                <label
                  style={{
                    ...styles.label,
                    color: settings.darkMode ? "#f1f5f9" : "#0f172a",
                  }}
                >
                  <Mail size={16} style={{ marginRight: 8 }} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  style={{
                    ...styles.input,
                    background: settings.darkMode ? "#0f172a" : "#f8fafc",
                    borderColor: settings.darkMode ? "#334155" : "#e2e8f0",
                    color: settings.darkMode ? "#f1f5f9" : "#0f172a",
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label
                  style={{
                    ...styles.label,
                    color: settings.darkMode ? "#f1f5f9" : "#0f172a",
                  }}
                >
                  <Phone size={16} style={{ marginRight: 8 }} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  style={{
                    ...styles.input,
                    background: settings.darkMode ? "#0f172a" : "#f8fafc",
                    borderColor: settings.darkMode ? "#334155" : "#e2e8f0",
                    color: settings.darkMode ? "#f1f5f9" : "#0f172a",
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label
                  style={{
                    ...styles.label,
                    color: settings.darkMode ? "#f1f5f9" : "#0f172a",
                  }}
                >
                  <MapPin size={16} style={{ marginRight: 8 }} />
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  rows={2}
                  style={{
                    ...styles.textarea,
                    background: settings.darkMode ? "#0f172a" : "#f8fafc",
                    borderColor: settings.darkMode ? "#334155" : "#e2e8f0",
                    color: settings.darkMode ? "#f1f5f9" : "#0f172a",
                  }}
                />
              </div>
            </div>

            {/* PREFERENCES CARD */}
            <div
              style={{
                ...styles.card,
                background: settings.darkMode ? "#1e293b" : "#fff",
                borderColor: settings.darkMode ? "#334155" : "#e2e8f0",
              }}
            >
              <div style={styles.cardHeader}>
                <div style={styles.cardIcon}>
                  <Shield size={20} />
                </div>
                <div>
                  <h3
                    style={{
                      ...styles.cardTitle,
                      color: settings.darkMode ? "#f1f5f9" : "#0f172a",
                    }}
                  >
                    Preferences
                  </h3>
                  <p style={styles.cardSub}>Customize your experience</p>
                </div>
              </div>

              <div
                style={{
                  ...styles.cardDivider,
                  background: settings.darkMode ? "#334155" : "#f1f5f9",
                }}
              />

              <div style={styles.prefItem}>
                <div style={styles.prefIcon}>
                  <Bell size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      ...styles.prefLabel,
                      color: settings.darkMode ? "#f1f5f9" : "#0f172a",
                    }}
                  >
                    Email Notifications
                  </p>
                  <p style={styles.prefSub}>Receive updates via email</p>
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

              <div style={styles.prefItem}>
                <div style={styles.prefIcon}>
                  <Globe size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      ...styles.prefLabel,
                      color: settings.darkMode ? "#f1f5f9" : "#0f172a",
                    }}
                  >
                    Language
                  </p>
                  <p style={styles.prefSub}>English (US)</p>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div style={styles.actionBar}>
            <button
              style={{
                ...styles.cancelBtn,
                background: settings.darkMode ? "#1e293b" : "#f8fafc",
                borderColor: settings.darkMode ? "#334155" : "#e2e8f0",
                color: settings.darkMode ? "#f1f5f9" : "#0f172a",
              }}
              onClick={handleCancel}
            >
              <X size={16} />
              Cancel
            </button>
            <button style={styles.saveBtn} onClick={handleSave}>
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
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
    fontWeight: 500,
    fontSize: 14,
  },
  toast_success: {
    background: "#f0fdf4",
    color: "#166534",
    border: "1px solid #bbf7d0",
  },
  toastContent: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 40px",
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(10px)",
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 16px",
    border: "1px solid",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 800,
    margin: 0,
    letterSpacing: "-0.5px",
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#64748b",
    margin: "4px 0 0",
  },
  main: {
    padding: "32px 40px",
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  avatarSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    padding: "40px",
    border: "1px solid",
    borderRadius: 20,
    marginBottom: 32,
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 36,
    fontWeight: 700,
    color: "#fff",
  },
  avatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#6366f1",
    color: "#fff",
    border: "3px solid #fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  avatarName: {
    fontSize: 20,
    fontWeight: 700,
    margin: 0,
  },
  avatarEmail: {
    fontSize: 14,
    color: "#64748b",
    margin: "4px 0 0",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: 20,
    marginBottom: 32,
  },
  card: {
    border: "1px solid",
    borderRadius: 16,
    padding: "24px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
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
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    margin: 0,
  },
  cardSub: {
    fontSize: 12,
    color: "#64748b",
    margin: "2px 0 0",
  },
  cardDivider: {
    height: 1,
    margin: "16px 0",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    display: "flex",
    alignItems: "center",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid",
    borderRadius: 10,
    fontSize: 14,
    outline: "none",
    transition: "all 0.15s",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid",
    borderRadius: 10,
    fontSize: 14,
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  prefItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 0",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
  },
  prefIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    flexShrink: 0,
  },
  prefLabel: {
    fontSize: 14,
    fontWeight: 600,
    margin: 0,
  },
  prefSub: {
    fontSize: 12,
    color: "#64748b",
    margin: "2px 0 0",
  },
  toggleSwitch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    border: "none",
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
  actionBar: {
    display: "flex",
    gap: 12,
    justifyContent: "flex-end",
    paddingTop: 24,
    borderTop: "1px solid #e2e8f0",
  },
  cancelBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 24px",
    border: "1px solid",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  saveBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 24px",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
  },
};

export default UserProfilePage;
