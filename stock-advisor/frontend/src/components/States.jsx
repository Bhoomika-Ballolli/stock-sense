import React from "react";

export function LoadingState({ symbol }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.spinner} />
      <div style={styles.text}>Analyzing {symbol}...</div>
      <div style={styles.sub}>Fetching real-time data & calculating indicators</div>
      <div style={styles.steps}>
        {["Fetching price data", "Computing RSI & MACD", "Analyzing trend", "Generating decision"].map((s, i) => (
          <div key={i} style={{ ...styles.step, animationDelay: `${i * 0.3}s` }}>
            <span style={styles.stepDot} />
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div style={errStyles.wrapper}>
      <div style={errStyles.icon}>⚠</div>
      <div style={errStyles.title}>Analysis Failed</div>
      <div style={errStyles.message}>{error}</div>
      <div style={errStyles.tips}>
        <div style={errStyles.tip}>• Use format: RELIANCE.NS (NSE) or RELIANCE.BSE</div>
        <div style={errStyles.tip}>• US stocks: AAPL, GOOGL, TSLA</div>
        <div style={errStyles.tip}>• Make sure backend is running on port 5000</div>
      </div>
      {onRetry && (
        <button style={errStyles.retryBtn} onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "60px 20px",
    background: "var(--surface)",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius)",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid var(--surface3)",
    borderTopColor: "var(--accent)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  text: {
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--text)",
    fontFamily: "var(--font-mono)",
  },
  sub: {
    fontSize: "12px",
    color: "var(--text-dim)",
    fontFamily: "var(--font-mono)",
  },
  steps: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "8px",
  },
  step: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "11px",
    color: "var(--text-dim)",
    fontFamily: "var(--font-mono)",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  stepDot: {
    width: "6px",
    height: "6px",
    background: "var(--accent)",
    borderRadius: "50%",
    flexShrink: 0,
  },
};

const errStyles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "48px 24px",
    background: "var(--surface)",
    border: "1px solid rgba(255,92,92,0.2)",
    borderRadius: "var(--radius)",
    textAlign: "center",
  },
  icon: {
    fontSize: "32px",
    color: "var(--red)",
    lineHeight: 1,
  },
  title: {
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--text)",
  },
  message: {
    fontSize: "13px",
    color: "var(--red)",
    fontFamily: "var(--font-mono)",
    background: "var(--red-dim)",
    padding: "10px 16px",
    borderRadius: "8px",
    maxWidth: "400px",
  },
  tips: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    alignItems: "flex-start",
  },
  tip: {
    fontSize: "11px",
    color: "var(--text-muted)",
    fontFamily: "var(--font-mono)",
  },
  retryBtn: {
    marginTop: "8px",
    padding: "10px 24px",
    background: "var(--accent)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "var(--font-main)",
  },
};
