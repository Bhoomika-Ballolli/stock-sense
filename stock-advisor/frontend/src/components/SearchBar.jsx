import React, { useState } from "react";

const QUICK_SYMBOLS = ["RELIANCE.NS", "TCS.NS", "INFY.NS", "IDEA.NS", "HDFCBANK.NS", "SBIN.NS"];

export default function SearchBar({ onSearch, loading }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) onSearch(input.trim().toUpperCase());
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.logoRow}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>◈</span>
          <span style={styles.logoText}>StockSense</span>
          <span style={styles.logoBadge}>AI</span>
        </div>
        <span style={styles.tagline}>Real-time · Intelligent · Decisive</span>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputWrap}>
          <span style={styles.searchIcon}>⌕</span>
          <input
            style={styles.input}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter symbol: RELIANCE.NS, TCS.NS, IDEA.NS..."
            disabled={loading}
            autoComplete="off"
            spellCheck={false}
          />
          {input && (
            <button
              type="button"
              onClick={() => setInput("")}
              style={styles.clearBtn}
            >
              ×
            </button>
          )}
        </div>
        <button
          type="submit"
          style={{
            ...styles.analyzeBtn,
            opacity: loading || !input.trim() ? 0.5 : 1,
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
          }}
          disabled={loading || !input.trim()}
        >
          {loading ? (
            <span style={styles.spinner} />
          ) : (
            "Analyze →"
          )}
        </button>
      </form>

      <div style={styles.quickRow}>
        <span style={styles.quickLabel}>Quick:</span>
        {QUICK_SYMBOLS.map((sym) => (
          <button
            key={sym}
            style={styles.quickChip}
            onClick={() => { setInput(sym); onSearch(sym); }}
            disabled={loading}
          >
            {sym.replace(".NS", "")}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "32px 0 24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "8px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoIcon: {
    fontSize: "24px",
    color: "var(--accent)",
    lineHeight: 1,
  },
  logoText: {
    fontSize: "22px",
    fontWeight: 800,
    color: "var(--text)",
    letterSpacing: "-0.5px",
  },
  logoBadge: {
    fontSize: "10px",
    fontWeight: 700,
    color: "var(--accent)",
    background: "var(--accent-glow)",
    border: "1px solid var(--accent)",
    borderRadius: "4px",
    padding: "2px 6px",
    letterSpacing: "1px",
    fontFamily: "var(--font-mono)",
  },
  tagline: {
    fontSize: "12px",
    color: "var(--text-dim)",
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.5px",
  },
  form: {
    display: "flex",
    gap: "10px",
    alignItems: "stretch",
  },
  inputWrap: {
    flex: 1,
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: "16px",
    fontSize: "20px",
    color: "var(--text-dim)",
    pointerEvents: "none",
    lineHeight: 1,
    top: "50%",
    transform: "translateY(-50%)",
  },
  input: {
    width: "100%",
    padding: "14px 44px 14px 46px",
    background: "var(--surface)",
    border: "1.5px solid var(--border-bright)",
    borderRadius: "var(--radius)",
    color: "var(--text)",
    fontSize: "14px",
    fontFamily: "var(--font-mono)",
    outline: "none",
    transition: "border-color 0.2s",
    letterSpacing: "0.5px",
  },
  clearBtn: {
    position: "absolute",
    right: "14px",
    background: "none",
    border: "none",
    color: "var(--text-dim)",
    cursor: "pointer",
    fontSize: "20px",
    lineHeight: 1,
    padding: "0",
  },
  analyzeBtn: {
    padding: "14px 28px",
    background: "var(--accent)",
    border: "none",
    borderRadius: "var(--radius)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 700,
    fontFamily: "var(--font-main)",
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    letterSpacing: "0.3px",
    minWidth: "120px",
    justifyContent: "center",
  },
  spinner: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  quickRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  quickLabel: {
    fontSize: "11px",
    color: "var(--text-muted)",
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.5px",
  },
  quickChip: {
    padding: "5px 12px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "20px",
    color: "var(--text-dim)",
    fontSize: "11px",
    fontFamily: "var(--font-mono)",
    cursor: "pointer",
    transition: "all 0.15s",
    letterSpacing: "0.3px",
  },
};
