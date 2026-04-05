import React from "react";

const DECISION_CONFIG = {
  BUY: {
    color: "var(--green)",
    bg: "var(--green-dim)",
    border: "rgba(0,200,150,0.25)",
    icon: "↑",
    label: "BUY",
    glow: "0 0 40px rgba(0,200,150,0.2)",
  },
  SELL: {
    color: "var(--red)",
    bg: "var(--red-dim)",
    border: "rgba(255,92,92,0.25)",
    icon: "↓",
    label: "SELL",
    glow: "0 0 40px rgba(255,92,92,0.2)",
  },
  HOLD: {
    color: "var(--yellow)",
    bg: "var(--yellow-dim)",
    border: "rgba(255,197,49,0.25)",
    icon: "→",
    label: "HOLD",
    glow: "0 0 40px rgba(255,197,49,0.15)",
  },
};

export default function DecisionCard({ data }) {
  const cfg = DECISION_CONFIG[data.decision] || DECISION_CONFIG.HOLD;

  return (
    <div
      style={{
        ...styles.card,
        border: `1.5px solid ${cfg.border}`,
        boxShadow: `var(--shadow), ${cfg.glow}`,
      }}
      className="fade-in"
    >
      <div style={styles.header}>
        <span style={styles.headerLabel}>AI Decision</span>
        <span style={styles.trendBadge}>
          Trend: {data.trend === "up" ? "▲ Upward" : "▼ Downward"}
        </span>
      </div>

      <div style={styles.main}>
        <div
          style={{
            ...styles.decisionBadge,
            background: cfg.bg,
            color: cfg.color,
            border: `2px solid ${cfg.border}`,
          }}
        >
          <span style={styles.decisionIcon}>{cfg.icon}</span>
          <span style={styles.decisionLabel}>{cfg.label}</span>
        </div>

        <div style={styles.right}>
          <div style={styles.confRow}>
            <span style={styles.confLabel}>Confidence</span>
            <span style={{ ...styles.confValue, color: cfg.color }}>
              {data.confidence}%
            </span>
          </div>
          <div style={styles.confBarBg}>
            <div
              style={{
                ...styles.confBarFill,
                width: `${data.confidence}%`,
                background: cfg.color,
                boxShadow: `0 0 10px ${cfg.color}60`,
              }}
            />
          </div>
          <p style={styles.explanation}>{data.explanation}</p>
        </div>
      </div>

      <div style={styles.signalRow}>
        <div style={styles.signalGroup}>
          <span style={styles.signalGroupLabel}>
            ▲ Bullish ({data.bullishSignals?.length || 0})
          </span>
          {(data.bullishSignals || []).map((s, i) => (
            <span key={i} style={{ ...styles.signal, ...styles.bullish }}>
              {s}
            </span>
          ))}
        </div>
        <div style={styles.signalDivider} />
        <div style={styles.signalGroup}>
          <span style={styles.signalGroupLabel}>
            ▼ Bearish ({data.bearishSignals?.length || 0})
          </span>
          {(data.bearishSignals || []).map((s, i) => (
            <span key={i} style={{ ...styles.signal, ...styles.bearish }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--surface)",
    borderRadius: "var(--radius)",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLabel: {
    fontSize: "11px",
    fontWeight: 700,
    color: "var(--text-dim)",
    fontFamily: "var(--font-mono)",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  },
  trendBadge: {
    fontSize: "11px",
    fontFamily: "var(--font-mono)",
    color: "var(--text-dim)",
    background: "var(--surface2)",
    padding: "4px 10px",
    borderRadius: "6px",
  },
  main: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    flexWrap: "wrap",
  },
  decisionBadge: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "120px",
    height: "120px",
    borderRadius: "20px",
    flexShrink: 0,
    gap: "4px",
  },
  decisionIcon: {
    fontSize: "36px",
    lineHeight: 1,
    fontWeight: 800,
  },
  decisionLabel: {
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: "3px",
    fontFamily: "var(--font-mono)",
  },
  right: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    minWidth: "200px",
  },
  confRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  confLabel: {
    fontSize: "12px",
    color: "var(--text-dim)",
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.5px",
  },
  confValue: {
    fontSize: "20px",
    fontWeight: 800,
    fontFamily: "var(--font-mono)",
  },
  confBarBg: {
    height: "6px",
    background: "var(--surface3)",
    borderRadius: "3px",
    overflow: "hidden",
  },
  confBarFill: {
    height: "100%",
    borderRadius: "3px",
    transition: "width 0.6s ease",
  },
  explanation: {
    fontSize: "13px",
    color: "var(--text)",
    lineHeight: 1.6,
    fontWeight: 400,
  },
  signalRow: {
    display: "flex",
    gap: "20px",
    background: "var(--surface2)",
    borderRadius: "var(--radius-sm)",
    padding: "16px",
    flexWrap: "wrap",
  },
  signalGroup: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    minWidth: "160px",
  },
  signalGroupLabel: {
    fontSize: "10px",
    color: "var(--text-dim)",
    fontFamily: "var(--font-mono)",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "2px",
  },
  signal: {
    fontSize: "11px",
    fontFamily: "var(--font-mono)",
    padding: "4px 10px",
    borderRadius: "4px",
    width: "fit-content",
  },
  bullish: {
    background: "var(--green-dim)",
    color: "var(--green)",
    border: "1px solid rgba(0,200,150,0.2)",
  },
  bearish: {
    background: "var(--red-dim)",
    color: "var(--red)",
    border: "1px solid rgba(255,92,92,0.2)",
  },
  signalDivider: {
    width: "1px",
    background: "var(--border)",
    alignSelf: "stretch",
  },
};
