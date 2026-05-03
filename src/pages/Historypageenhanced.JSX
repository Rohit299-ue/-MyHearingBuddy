import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Search,
  Bell,
  Moon,
  Download,
  Copy,
  Trash2,
  Camera,
  FileText,
  Sparkles,
  LayoutDashboard,
  Clock,
  TrendingUp,
  Calendar,
  ChevronDown,
  Filter,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";

const HistoryPageEnhanced = () => {
  const { history, setHistory } = useApp();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [filterType, setFilterType] = useState("all");
  const [filterResult, setFilterResult] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const itemsPerPage = 8;

  let filteredHistory = history.filter((item) => {
    const matchesSearch = item.original
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType =
      filterType === "all" ||
      (filterType === "detection" && item.type === "detection") ||
      (filterType === "text" && item.type === "text to sign");
    const matchesResult =
      filterResult === "all" ||
      (filterResult === "corrected" && item.corrected) ||
      (filterResult === "original" && !item.corrected);

    return matchesSearch && matchesType && matchesResult;
  });

  if (sortBy === "latest") {
    filteredHistory = [...filteredHistory].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  } else if (sortBy === "oldest") {
    filteredHistory = [...filteredHistory].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
  } else if (sortBy === "a-z") {
    filteredHistory = [...filteredHistory].sort((a, b) =>
      a.original.localeCompare(b.original)
    );
  }

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = filteredHistory.slice(
    startIdx,
    startIdx + itemsPerPage
  );

  const formatDate = (time) => {
    return new Date(time).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = (item) => {
    setDeletingId(item.timestamp);
  };

  const confirmDelete = (timestamp) => {
    const newHistory = history.filter((item) => item.timestamp !== timestamp);
    setHistory(newHistory);
    setDeletingId(null);
    setToast({ type: "success", msg: "Record deleted successfully" });
    setTimeout(() => setToast(null), 3000);
    if (paginatedHistory.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCopy = (text, timestamp) => {
    navigator.clipboard.writeText(text);
    setCopiedId(timestamp);
    setToast({ type: "success", msg: "Copied to clipboard" });
    setTimeout(() => {
      setCopiedId(null);
      setToast(null);
    }, 2000);
  };

  const todayCount = history.filter(
    (item) =>
      new Date(item.timestamp).toDateString() === new Date().toDateString()
  ).length;

  const thisWeekCount = history.filter((item) => {
    const d = new Date(item.timestamp);
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    return d >= startOfWeek;
  }).length;

  const aiCorrectedCount = history.filter((item) => item.corrected).length;

  return (
    <div style={styles.pageWrapper}>
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div style={{ ...styles.toast, ...styles[`toast_${toast.type}`] }}>
          <div style={styles.toastContent}>
            {toast.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{toast.msg}</span>
          </div>
          <button
            style={styles.toastClose}
            onClick={() => setToast(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>🤟</div>
          <div>
            <p style={styles.logoTitle}>MyHearingBuddy</p>
            <p style={styles.logoSub}>Sign Language Assistant</p>
          </div>
        </div>

        <nav style={styles.nav}>
          {[
            { label: "Dashboard", icon: <LayoutDashboard size={18} />, active: false },
            { label: "History", icon: <Clock size={18} />, active: true },
            { label: "Analytics", icon: <TrendingUp size={18} />, active: false },
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
          <div style={styles.sidebarAvatar}>MH</div>
          <div>
            <p style={styles.sidebarName}>My Account</p>
            <p style={styles.sidebarRole}>User</p>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={styles.main}>
        {/* TOPBAR */}
        <div style={styles.topbar}>
          <div>
            <h1 style={styles.pageTitle}>History</h1>
            <p style={styles.pageSubtitle}>Your past detections & AI corrections</p>
          </div>

          <div style={styles.topbarRight}>
            <div style={styles.searchBox}>
              <Search size={16} style={{ color: "#94a3b8", flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search records..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            <button style={styles.iconBtn}>
              <Bell size={17} />
            </button>
            <button style={styles.iconBtn}>
              <Moon size={17} />
            </button>
          </div>
        </div>

        {/* STAT CARDS */}
        <div style={styles.statsGrid}>
          <StatCard
            label="Total Records"
            value={history.length}
            icon={<Clock size={20} />}
            color="#6366f1"
            bg="#eef2ff"
          />
          <StatCard
            label="AI Corrected"
            value={aiCorrectedCount}
            icon={<Sparkles size={20} />}
            color="#8b5cf6"
            bg="#f5f3ff"
          />
          <StatCard
            label="Today"
            value={todayCount}
            icon={<Calendar size={20} />}
            color="#0ea5e9"
            bg="#e0f2fe"
          />
          <StatCard
            label="This Week"
            value={thisWeekCount}
            icon={<TrendingUp size={20} />}
            color="#10b981"
            bg="#ecfdf5"
          />
        </div>

        {/* FILTER BAR */}
        <div style={styles.filterBar}>
          <div style={styles.filterLeft}>
            <Filter size={15} style={{ color: "#64748b" }} />
            <span style={styles.filterLabel}>Filter:</span>

            <div style={styles.selectWrap}>
              <select
                style={styles.select}
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Types</option>
                <option value="detection">Live Detection</option>
                <option value="text">Text to Sign</option>
              </select>
              <ChevronDown size={14} style={styles.chevron} />
            </div>

            <div style={styles.selectWrap}>
              <select
                style={styles.select}
                value={filterResult}
                onChange={(e) => {
                  setFilterResult(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Results</option>
                <option value="corrected">AI Corrected</option>
                <option value="original">Original Only</option>
              </select>
              <ChevronDown size={14} style={styles.chevron} />
            </div>

            <div style={styles.selectWrap}>
              <select
                style={styles.select}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="a-z">A → Z</option>
              </select>
              <ChevronDown size={14} style={styles.chevron} />
            </div>
          </div>

          <button style={styles.exportBtn}>
            <Download size={15} />
            Export CSV
          </button>
        </div>

        {/* TABLE */}
        <div style={styles.tableCard}>
          {/* TABLE HEADER */}
          <div style={styles.tableHeader}>
            <span style={{ ...styles.th, flex: 2 }}>Type & Content</span>
            <span style={{ ...styles.th, flex: 2 }}>AI Correction</span>
            <span style={{ ...styles.th, flex: 1 }}>Timestamp</span>
            <span style={{ ...styles.th, flex: "0 0 100px", textAlign: "right" }}>Actions</span>
          </div>

          {/* TABLE BODY */}
          {paginatedHistory.length === 0 ? (
            <EmptyState />
          ) : (
            paginatedHistory.map((item, index) => (
              <div
                key={index}
                style={{
                  ...styles.tableRow,
                  opacity: deletingId === item.timestamp ? 0.5 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {deletingId === item.timestamp ? (
                  <div style={styles.deleteConfirm}>
                    <span>Are you sure you want to delete this record?</span>
                    <div style={styles.deleteButtons}>
                      <button
                        style={styles.cancelBtn}
                        onClick={() => setDeletingId(null)}
                      >
                        Cancel
                      </button>
                      <button
                        style={styles.confirmDeleteBtn}
                        onClick={() => confirmDelete(item.timestamp)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Type */}
                    <div
                      style={{
                        ...styles.td,
                        flex: 2,
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          ...styles.typeIcon,
                          background:
                            item.type === "detection" ? "#eef2ff" : "#f0fdf4",
                          color:
                            item.type === "detection" ? "#6366f1" : "#16a34a",
                        }}
                      >
                        {item.type === "detection" ? (
                          <Camera size={18} />
                        ) : (
                          <FileText size={18} />
                        )}
                      </div>
                      <div>
                        <p style={styles.typeLabel}>
                          {item.type === "detection"
                            ? "Live Detection"
                            : "Text to Sign"}
                        </p>
                        <p style={styles.originalText}>{item.original}</p>
                      </div>
                    </div>

                    {/* Correction */}
                    <div style={{ ...styles.td, flex: 2 }}>
                      {item.corrected ? (
                        <div>
                          <span style={styles.aiBadge}>
                            <Sparkles size={12} />
                            AI Corrected
                          </span>
                          <p style={styles.correctedText}>{item.corrected}</p>
                        </div>
                      ) : (
                        <span style={styles.noCorrection}>—</span>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div style={{ ...styles.td, flex: 1 }}>
                      <p style={styles.timestamp}>{formatDate(item.timestamp)}</p>
                    </div>

                    {/* Actions */}
                    <div
                      style={{
                        ...styles.td,
                        flex: "0 0 100px",
                        display: "flex",
                        gap: 8,
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        style={{
                          ...styles.actionBtn,
                          ...(copiedId === item.timestamp
                            ? styles.actionBtnSuccess
                            : {}),
                        }}
                        title={
                          copiedId === item.timestamp ? "Copied!" : "Copy"
                        }
                        onClick={() =>
                          handleCopy(
                            item.corrected || item.original,
                            item.timestamp
                          )
                        }
                      >
                        <Copy size={15} />
                      </button>
                      <button
                        style={styles.deleteBtn}
                        title="Delete"
                        onClick={() => handleDelete(item)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}

          {/* PAGINATION */}
          {filteredHistory.length > itemsPerPage && (
            <div style={styles.pagination}>
              <span style={styles.paginationInfo}>
                Showing {startIdx + 1} to{" "}
                {Math.min(startIdx + itemsPerPage, filteredHistory.length)} of{" "}
                {filteredHistory.length} records
              </span>
              <div style={styles.paginationButtons}>
                <button
                  style={{
                    ...styles.paginationBtn,
                    opacity: currentPage === 1 ? 0.5 : 1,
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  }}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      style={{
                        ...styles.paginationPageBtn,
                        ...(page === currentPage
                          ? styles.paginationPageBtnActive
                          : {}),
                      }}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  style={{
                    ...styles.paginationBtn,
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                  }}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ label, value, icon, color, bg }) => (
  <div style={styles.statCard}>
    <div style={{ ...styles.statIcon, background: bg, color }}>
      {icon}
    </div>
    <div>
      <p style={styles.statLabel}>{label}</p>
      <p style={styles.statValue}>{value}</p>
    </div>
  </div>
);

const EmptyState = () => (
  <div style={styles.empty}>
    <div style={styles.emptyIconWrap}>📭</div>
    <h3 style={styles.emptyTitle}>No records found</h3>
    <p style={styles.emptySub}>
      Your detection and translation history will appear here
    </p>
  </div>
);

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
    gap: 12,
    zIndex: 1000,
    animation: "slideIn 0.3s ease-out",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  toast_success: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#166534",
  },
  toast_error: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
  },
  toastContent: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    fontWeight: 500,
  },
  toastClose: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "inherit",
    padding: 0,
  },

  pageWrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  sidebar: {
    width: 240,
    background: "#0f172a",
    display: "flex",
    flexDirection: "column",
    padding: "28px 16px",
    gap: 8,
    flexShrink: 0,
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
    margin: 0,
    marginTop: 1,
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
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "left",
    transition: "background 0.15s",
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
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "left",
  },
  sidebarBottom: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px",
    borderTop: "1px solid #1e293b",
    marginTop: 8,
  },
  sidebarAvatar: {
    width: 34,
    height: 34,
    borderRadius: 10,
    background: "#1e293b",
    color: "#818cf8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
  },
  sidebarName: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: 600,
    margin: 0,
  },
  sidebarRole: {
    color: "#475569",
    fontSize: 11,
    margin: 0,
  },

  main: {
    flex: 1,
    padding: "32px 36px",
    overflowY: "auto",
  },
  topbar: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 28,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#64748b",
    margin: "4px 0 0",
  },
  topbarRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "0 14px",
    height: 40,
    minWidth: 240,
  },
  searchInput: {
    border: "none",
    outline: "none",
    fontSize: 14,
    color: "#0f172a",
    background: "transparent",
    width: "100%",
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
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    background: "#fff",
    border: "1px solid #f1f5f9",
    borderRadius: 14,
    padding: "20px 20px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  statLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: 500,
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statValue: {
    fontSize: 28,
    fontWeight: 800,
    color: "#0f172a",
    margin: "2px 0 0",
    lineHeight: 1,
    letterSpacing: "-1px",
  },

  filterBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#fff",
    border: "1px solid #f1f5f9",
    borderRadius: 12,
    padding: "12px 16px",
    marginBottom: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    flexWrap: "wrap",
    gap: 12,
  },
  filterLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  filterLabel: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: 500,
  },
  selectWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  select: {
    appearance: "none",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "7px 32px 7px 12px",
    fontSize: 13,
    color: "#0f172a",
    background: "#f8fafc",
    cursor: "pointer",
    outline: "none",
    fontWeight: 500,
  },
  chevron: {
    position: "absolute",
    right: 10,
    color: "#94a3b8",
    pointerEvents: "none",
  },
  exportBtn: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: "#0f172a",
    color: "#f1f5f9",
    border: "none",
    borderRadius: 9,
    padding: "9px 16px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.1px",
  },

  tableCard: {
    background: "#fff",
    border: "1px solid #f1f5f9",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  tableHeader: {
    display: "flex",
    padding: "12px 20px",
    background: "#f8fafc",
    borderBottom: "1px solid #f1f5f9",
  },
  th: {
    fontSize: 11,
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },
  tableRow: {
    display: "flex",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #f8fafc",
    transition: "background 0.1s",
  },
  td: {
    fontSize: 14,
  },
  typeIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },
  originalText: {
    fontSize: 13,
    color: "#64748b",
    margin: "3px 0 0",
    lineHeight: 1.4,
  },
  aiBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    background: "#f0fdf4",
    color: "#16a34a",
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 9px",
    borderRadius: 6,
    border: "1px solid #bbf7d0",
    letterSpacing: "0.2px",
    marginBottom: 5,
  },
  correctedText: {
    fontSize: 13,
    color: "#0f172a",
    margin: 0,
    lineHeight: 1.4,
  },
  noCorrection: {
    color: "#cbd5e1",
    fontSize: 18,
  },
  timestamp: {
    fontSize: 12,
    color: "#94a3b8",
    margin: 0,
    lineHeight: 1.5,
  },
  actionBtn: {
    width: 34,
    height: 34,
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#475569",
    transition: "all 0.15s",
  },
  actionBtnSuccess: {
    color: "#16a34a",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
  },
  deleteBtn: {
    width: 34,
    height: 34,
    border: "1px solid #fecaca",
    borderRadius: 8,
    background: "#fff1f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#ef4444",
    transition: "all 0.15s",
  },

  deleteConfirm: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    gap: 16,
    color: "#f97316",
    fontSize: 13,
    fontWeight: 500,
  },
  deleteButtons: {
    display: "flex",
    gap: 8,
    flexShrink: 0,
  },
  cancelBtn: {
    padding: "6px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    background: "#f8fafc",
    color: "#0f172a",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  confirmDeleteBtn: {
    padding: "6px 12px",
    border: "1px solid #fecaca",
    borderRadius: 6,
    background: "#ef4444",
    color: "#fff",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },

  empty: {
    padding: "64px 20px",
    textAlign: "center",
  },
  emptyIconWrap: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },
  emptySub: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 8,
  },

  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderTop: "1px solid #f8fafc",
    background: "#f8fafc",
    flexWrap: "wrap",
    gap: 16,
  },
  paginationInfo: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: 500,
  },
  paginationButtons: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  paginationBtn: {
    padding: "7px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    background: "#fff",
    fontSize: 13,
    fontWeight: 600,
    color: "#0f172a",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  paginationPageBtn: {
    width: 32,
    height: 32,
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    background: "#fff",
    fontSize: 13,
    fontWeight: 600,
    color: "#0f172a",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  paginationPageBtnActive: {
    background: "#0f172a",
    color: "#f1f5f9",
    border: "1px solid #0f172a",
  },
};

export default HistoryPageEnhanced;