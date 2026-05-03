import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  Home,
  Camera,
  FileText,
  BookOpen,
  BarChart3,
  Settings,
  Sun,
  Moon,
  ChevronRight,
  Trophy,
  GraduationCap,
  Radio,
  Mic,
  LogOut,
  ChevronDown,
  Zap,
} from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, user, logout } = useApp();

  const menu = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Live Detect", icon: Camera, path: "/live-detect" },
    { name: "History", icon: FileText, path: "/history" },
    { name: "Practice", icon: BookOpen, path: "/practice" },
    { name: "Reports", icon: BarChart3, path: "/reports" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  const cards = [
    {
      title: "Text to Sign",
      desc: "Convert text into sign language instantly",
      icon: Mic,
      accent: "#f472b6",
      bg: "from-pink-500/20 to-rose-500/10",
      border: "border-pink-500/20",
      path: "/text-to-sign",
      tag: "AI Powered",
    },
    {
      title: "Live Detection",
      desc: "Real-time sign language recognition",
      icon: Camera,
      accent: "#a78bfa",
      bg: "from-violet-500/20 to-purple-500/10",
      border: "border-violet-500/20",
      path: "/live-detect",
      tag: "Live",
    },
    {
      title: "History",
      desc: "View all previous sessions",
      icon: FileText,
      accent: "#fb923c",
      bg: "from-orange-500/20 to-yellow-500/10",
      border: "border-orange-500/20",
      path: "/history",
      tag: "Logs",
    },
    {
      title: "Practice Mode",
      desc: "Learn & improve communication",
      icon: BookOpen,
      accent: "#38bdf8",
      bg: "from-sky-500/20 to-blue-500/10",
      border: "border-sky-500/20",
      path: "/practice",
      tag: "Learn",
    },
    {
      title: "Reports",
      desc: "Track your performance over time",
      icon: BarChart3,
      accent: "#34d399",
      bg: "from-emerald-500/20 to-green-500/10",
      border: "border-emerald-500/20",
      path: "/reports",
      tag: "Analytics",
    },
    {
      title: "Settings",
      desc: "Customize your experience",
      icon: Settings,
      accent: "#c084fc",
      bg: "from-purple-500/20 to-fuchsia-500/10",
      border: "border-purple-500/20",
      path: "/settings",
      tag: "Config",
    },
  ];

  const stats = [
    {
      value: "92%",
      label: "Detection Accuracy",
      icon: Trophy,
      color: "#a78bfa",
      bg: "from-violet-500/15 to-purple-500/5",
    },
    {
      value: "24",
      label: "Practice Sessions",
      icon: GraduationCap,
      color: "#38bdf8",
      bg: "from-sky-500/15 to-blue-500/5",
    },
    {
      value: "56",
      label: "Live Detections",
      icon: Radio,
      color: "#f472b6",
      bg: "from-pink-500/15 to-rose-500/5",
    },
  ];

  const toggleDark = () => updateSettings({ darkMode: !settings.darkMode });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .hb-root {
          min-height: 100vh;
          display: flex;
          background: ${settings.darkMode ? '#080b14' : '#f8fafc'};
          font-family: 'DM Sans', sans-serif;
          color: ${settings.darkMode ? '#e2e8f0' : '#1e293b'};
          position: relative;
          overflow: hidden;
        }

        /* Ambient glow blobs */
        .hb-root::before {
          content: '';
          position: fixed;
          top: -200px; left: -200px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .hb-root::after {
          content: '';
          position: fixed;
          bottom: -200px; right: -200px;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(244,114,182,0.10) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* ── SIDEBAR ── */
        .hb-sidebar {
          display: none;
          width: 280px;
          flex-shrink: 0;
          flex-direction: column;
          justify-content: space-between;
          padding: 28px 20px;
          background: ${settings.darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.04)'};
          border-right: 1px solid ${settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)'};
          position: relative;
          z-index: 10;
          backdrop-filter: blur(12px);
        }

        @media (min-width: 1024px) { .hb-sidebar { display: flex; } }

        .hb-logo {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 40px;
        }

        .hb-logo-icon {
          width: 52px; height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, #7c3aed, #ec4899);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          box-shadow: 0 8px 24px rgba(124,58,237,0.4);
        }

        .hb-logo-text h2 {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: ${settings.darkMode ? '#f1f5f9' : '#0f172a'};
          line-height: 1.2;
        }

        .hb-logo-text p {
          font-size: 12px;
          color: ${settings.darkMode ? 'rgba(148,163,184,0.7)' : 'rgba(71,85,105,0.7)'};
          letter-spacing: 0.5px;
        }

        .hb-nav { display: flex; flex-direction: column; gap: 4px; }

        .hb-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: ${settings.darkMode ? 'rgba(148,163,184,0.8)' : 'rgba(71,85,105,0.8)'};
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .hb-nav-item:hover {
          color: ${settings.darkMode ? '#f1f5f9' : '#0f172a'};
          background: ${settings.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.05)'};
        }

        .hb-nav-item.active {
          background: linear-gradient(135deg, rgba(124,58,237,0.25), rgba(236,72,153,0.15));
          border-color: rgba(139,92,246,0.3);
          color: #c4b5fd;
          box-shadow: 0 2px 12px rgba(124,58,237,0.15);
        }

        .hb-nav-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #7c3aed;
          margin-left: auto;
        }

        /* Sidebar bottom */
        .hb-user-card {
          background: ${settings.darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)'};
          border: 1px solid ${settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'};
          border-radius: 14px;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }

        .hb-avatar {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #ec4899);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          color: white;
          flex-shrink: 0;
        }

        .hb-user-info p:first-child {
          font-weight: 600;
          font-size: 13px;
          color: ${settings.darkMode ? '#f1f5f9' : '#0f172a'};
        }

        .hb-user-info p:last-child {
          font-size: 11px;
          color: ${settings.darkMode ? 'rgba(148,163,184,0.6)' : 'rgba(71,85,105,0.6)'};
        }

        .hb-logout {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid rgba(244,114,182,0.2);
          background: transparent;
          color: #f472b6;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        .hb-logout:hover {
          background: rgba(244,114,182,0.08);
          border-color: rgba(244,114,182,0.35);
        }

        /* ── MAIN ── */
        .hb-main {
          flex: 1;
          padding: 36px 40px;
          overflow-y: auto;
          position: relative;
          z-index: 5;
        }

        @media (max-width: 768px) { .hb-main { padding: 24px 16px; } }

        /* Topbar */
        .hb-topbar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 48px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .hb-greeting-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(124,58,237,0.12);
          border: 1px solid rgba(139,92,246,0.25);
          border-radius: 100px;
          padding: 4px 12px;
          font-size: 12px;
          color: #c4b5fd;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .hb-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 800;
          color: ${settings.darkMode ? '#f8fafc' : '#0f172a'};
          line-height: 1.1;
          letter-spacing: -1px;
        }

        .hb-title span {
          background: linear-gradient(135deg, #a78bfa, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hb-subtitle {
          font-size: 15px;
          color: ${settings.darkMode ? 'rgba(148,163,184,0.8)' : 'rgba(71,85,105,0.8)'};
          margin-top: 8px;
          font-weight: 400;
        }

        .hb-topbar-actions { display: flex; gap: 10px; align-items: center; }

        .hb-icon-btn {
          width: 44px; height: 44px;
          border-radius: 12px;
          border: 1px solid ${settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.12)'};
          background: ${settings.darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)'};
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: ${settings.darkMode ? 'rgba(148,163,184,0.8)' : 'rgba(71,85,105,0.8)'};
          transition: all 0.2s;
        }

        .hb-icon-btn:hover { 
          background: ${settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,1)'}; 
          color: ${settings.darkMode ? '#f1f5f9' : '#0f172a'}; 
        }

        .hb-avatar-btn {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #7c3aed, #ec4899);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: white;
          cursor: pointer;
          position: relative;
          box-shadow: 0 4px 16px rgba(124,58,237,0.3);
        }

        .hb-online-dot {
          position: absolute;
          bottom: -2px; right: -2px;
          width: 11px; height: 11px;
          background: #4ade80;
          border-radius: 50%;
          border: 2px solid #080b14;
        }

        /* Section label */
        .hb-section-label {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: ${settings.darkMode ? 'rgba(148,163,184,0.5)' : 'rgba(71,85,105,0.5)'};
          margin-bottom: 20px;
        }

        /* ── CARDS GRID ── */
        .hb-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .hb-card {
          background: ${settings.darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)'};
          border: 1px solid ${settings.darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.08)'};
          border-radius: 20px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .hb-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--card-bg);
          opacity: 0;
          transition: opacity 0.3s;
          border-radius: 20px;
        }

        .hb-card:hover::before { opacity: 1; }

        .hb-card:hover {
          border-color: var(--card-border-color);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }

        .hb-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .hb-card-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          background: var(--card-icon-bg);
        }

        .hb-card-tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--card-accent);
          background: var(--card-icon-bg);
          border: 1px solid var(--card-border-color);
          padding: 3px 8px;
          border-radius: 100px;
        }

        .hb-card h3 {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: ${settings.darkMode ? '#f1f5f9' : '#0f172a'};
          margin-bottom: 6px;
          position: relative;
          z-index: 1;
        }

        .hb-card p {
          font-size: 13px;
          color: ${settings.darkMode ? 'rgba(148,163,184,0.7)' : 'rgba(71,85,105,0.7)'};
          line-height: 1.5;
          position: relative;
          z-index: 1;
        }

        .hb-card-arrow {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: 16px;
          font-size: 12px;
          font-weight: 600;
          color: var(--card-accent);
          position: relative;
          z-index: 1;
          transition: gap 0.2s;
        }

        .hb-card:hover .hb-card-arrow { gap: 8px; }

        /* ── STATS ── */
        .hb-stats {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }

        .hb-stat {
          background: ${settings.darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)'};
          border: 1px solid ${settings.darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.08)'};
          border-radius: 20px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 18px;
          transition: all 0.3s;
        }

        .hb-stat:hover {
          background: ${settings.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,1)'};
          transform: translateY(-2px);
        }

        .hb-stat-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          background: var(--stat-bg);
          flex-shrink: 0;
        }

        .hb-stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 34px;
          font-weight: 800;
          color: var(--stat-color);
          line-height: 1;
        }

        .hb-stat-label {
          font-size: 12px;
          color: ${settings.darkMode ? 'rgba(148,163,184,0.6)' : 'rgba(71,85,105,0.6)'};
          margin-top: 4px;
          font-weight: 400;
        }
      `}</style>

      <div className="hb-root">

        {/* ── SIDEBAR ── */}
        <aside className="hb-sidebar">
          <div>
            {/* Logo */}
            <div className="hb-logo">
              <div className="hb-logo-icon">🤟</div>
              <div className="hb-logo-text">
                <h2>MyHearingBuddy</h2>
                <p>Break Barriers</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="hb-nav">
              {menu.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    onClick={() => navigate(item.path)}
                    className={`hb-nav-item ${i === 0 ? "active" : ""}`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                    {i === 0 && <div className="hb-nav-dot" />}
                  </div>
                );
              })}
            </nav>
          </div>

          <div>
            {/* User card */}
            <div className="hb-user-card" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
              <div className="hb-avatar">
                {user?.name ? user.name.charAt(0) : "U"}
              </div>
              <div className="hb-user-info">
                <p>{user?.name || "User"}</p>
                <p>{user?.email || "user@email.com"}</p>
              </div>
              <ChevronDown size={16} style={{ color: "rgba(148,163,184,0.5)", marginLeft: "auto" }} />
            </div>

            <button className="hb-logout" onClick={logout}>
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="hb-main">

          {/* Topbar */}
          <div className="hb-topbar">
            <div>
              <div className="hb-greeting-badge">
                <Zap size={10} />
                Dashboard Active
              </div>
              <h1 className="hb-title">
                Welcome Back,<br />
                <span>{user?.name?.split(" ")[0] || "Friend"}</span>
              </h1>
              <p className="hb-subtitle">Your hearing assistant dashboard is ready 👋</p>
            </div>

            <div className="hb-topbar-actions">
              <button className="hb-icon-btn" onClick={toggleDark}>
                {settings.darkMode ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              <div className="hb-avatar-btn" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                {user?.name ? user.name.charAt(0) : "U"}
                <span className="hb-online-dot" />
              </div>
            </div>
          </div>

          {/* Cards section */}
          <p className="hb-section-label">Quick Access</p>
          <div className="hb-cards-grid">
            {cards.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="hb-card"
                  onClick={() => navigate(item.path)}
                  style={{
                    "--card-accent": item.accent,
                    "--card-bg": `linear-gradient(135deg, ${item.accent}12, ${item.accent}05)`,
                    "--card-border-color": `${item.accent}30`,
                    "--card-icon-bg": `${item.accent}18`,
                  }}
                >
                  <div className="hb-card-top">
                    <div className="hb-card-icon">
                      <Icon size={22} style={{ color: item.accent }} />
                    </div>
                    <span className="hb-card-tag">{item.tag}</span>
                  </div>

                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>

                  <div className="hb-card-arrow">
                    Open <ChevronRight size={13} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats section */}
          <p className="hb-section-label" style={{ marginTop: "8px" }}>Performance Overview</p>
          <div className="hb-stats">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="hb-stat"
                  style={{
                    "--stat-color": s.color,
                    "--stat-bg": `linear-gradient(135deg, ${s.color}20, ${s.color}08)`,
                  }}
                >
                  <div className="hb-stat-icon">
                    <Icon size={22} style={{ color: s.color }} />
                  </div>
                  <div>
                    <div className="hb-stat-value">{s.value}</div>
                    <div className="hb-stat-label">{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

        </main>
      </div>
    </>
  );
};

export default HomePage;