import React from "react";
import { useMarketStatus } from "../hooks/useMarketStatus";

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export default function MarketStatus({ compact = false }) {
  const {
    isOpen,
    isPreOpen,
    weekend,
    holiday,
    closedReason,
    countdown,
    closingCountdown,
    istTime,
  } = useMarketStatus();

  const istString = istTime
    ? istTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })
    : "";

  if (isOpen) {
    return (
      <div style={{ ...styles.bar, ...styles.openBar }}>
        <div style={styles.left}>
          <span style={{ ...styles.dot, ...styles.dotGreen }} />
          <span style={{ ...styles.statusText, color: "var(--green)" }}>Market Open</span>
          <span style={styles.exchange}>NSE / BSE</span>
          <span style={styles.hours}>9:15 AM – 3:30 PM IST</span>
        </div>
        <div style={styles.right}>
          {closingCountdown && (
            <div style={{ ...styles.pill, ...styles.pillGreen }}>
              <ClockIcon />
              <span>Closes in {closingCountdown}</span>
            </div>
          )}
          <span style={styles.clock}>{istString}</span>
        </div>
      </div>
    );
  }

  // CLOSED state
  let reasonLine = "";
  let subNote = "";
  if (weekend) {
    reasonLine = `Weekend — Markets closed on Saturday & Sunday`;
    subNote = "Pre-market opens Monday 9:15 AM IST";
  } else if (holiday) {
    reasonLine = "Public Holiday — NSE/BSE closed today";
    subNote = "Next trading session starts at 9:15 AM IST";
  } else if (closedReason === "Pre-Market") {
    reasonLine = "Pre-Market — Session starts at 9:15 AM IST";
    subNote = "Showing last available price";
  } else {
    reasonLine = "After Hours — Session ended at 3:30 PM IST";
    subNote = "Showing last closing price";
  }

  return (
    <div style={{ ...styles.bar, ...styles.closedBar }}>
      <div style={styles.topRow}>
        <div style={styles.left}>
          <span style={{ ...styles.dot, ...styles.dotRed }} />
          <span style={{ ...styles.statusText, color: "var(--red)" }}>Market Closed</span>
          <span style={styles.exchange}>NSE / BSE</span>
        </div>
        <span style={styles.clock}>{istString}</span>
      </div>

      <div style={styles.middleRow}>
        <CalendarIcon />
        <span style={styles.reasonText}>{reasonLine}</span>
      </div>

      <div style={styles.bottomRow}>
        <div style={{ ...styles.pill, ...styles.pillRed }}>
          <ClockIcon />
          <span style={styles.pillLabel}>Opens in</span>
          <span style={styles.countdown}>{countdown || "—"}</span>
        </div>
        <span style={styles.subNote}>{subNote}</span>
      </div>
    </div>
  );
}

const styles = {
  bar: {
    borderRadius: "10px",
    padding: "12px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "12px",
    fontFamily: "var(--font-mono)",
    border: "1px solid transparent",
  },
  openBar: {
    background: "rgba(0,200,150,0.06)",
    border: "1px solid rgba(0,200,150,0.18)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "10px",
    padding: "10px 16px",
  },
  closedBar: {
    background: "rgba(255,92,92,0.05)",
    border: "1px solid rgba(255,92,92,0.18)",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  middleRow: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "var(--text-dim)",
    paddingLeft: "2px",
  },
  bottomRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  dotGreen: {
    background: "var(--green)",
    boxShadow: "0 0 6px var(--green)",
    animation: "pulse 2s ease-in-out infinite",
  },
  dotRed: {
    background: "var(--red)",
    opacity: 0.8,
  },
  statusText: {
    fontWeight: 700,
    fontSize: "12px",
    letterSpacing: "0.3px",
  },
  exchange: {
    fontSize: "10px",
    color: "var(--text-muted)",
    background: "var(--surface3)",
    padding: "2px 7px",
    borderRadius: "4px",
    letterSpacing: "0.5px",
  },
  hours: {
    fontSize: "10px",
    color: "var(--text-muted)",
  },
  clock: {
    fontSize: "11px",
    color: "var(--text-dim)",
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "0.3px",
  },
  reasonText: {
    fontSize: "11px",
    color: "var(--text-dim)",
    letterSpacing: "0.2px",
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 600,
    border: "1px solid transparent",
  },
  pillGreen: {
    background: "rgba(0,200,150,0.1)",
    color: "var(--green)",
    border: "1px solid rgba(0,200,150,0.2)",
  },
  pillRed: {
    background: "rgba(255,92,92,0.1)",
    color: "var(--red)",
    border: "1px solid rgba(255,92,92,0.2)",
  },
  pillLabel: {
    opacity: 0.7,
    fontWeight: 400,
  },
  countdown: {
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "0.5px",
    fontSize: "12px",
  },
  subNote: {
    fontSize: "10px",
    color: "var(--text-muted)",
    letterSpacing: "0.2px",
  },
};
