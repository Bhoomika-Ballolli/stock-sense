import React from "react";

function fmt(n, digits = 2) {
  if (n === null || n === undefined) return "—";
  return Number(n).toLocaleString("en-IN", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function fmtVolume(v) {
  if (!v) return "—";
  if (v >= 1e7) return (v / 1e7).toFixed(2) + " Cr";
  if (v >= 1e5) return (v / 1e5).toFixed(2) + " L";
  return v.toLocaleString("en-IN");
}

export default function StockOverview({ data }) {
  const isUp = data.priceChange >= 0;
  const color = isUp ? "var(--green)" : "var(--red)";
  const bg = isUp ? "var(--green-dim)" : "var(--red-dim)";

  return (
    <div style={styles.card} className="fade-in">
      <div style={styles.left}>
        <div style={styles.symbolRow}>
          <span style={styles.symbol}>{data.symbol}</span>
          <span style={styles.exchange}>{data.exchange}</span>
          <span
            style={{
              ...styles.trendPill,
              background: bg,
              color,
              border: `1px solid ${color}30`,
            }}
          >
            {isUp ? "▲" : "▼"} {isUp ? "RISING" : "FALLING"}
          </span>
        </div>
        <div style={styles.name}>{data.name}</div>
        <div style={styles.priceRow}>
          <span style={styles.price}>
            {data.currency === "INR" ? "₹" : "$"}
            {fmt(data.currentPrice)}
          </span>
          <span style={{ ...styles.change, color }}>
            {isUp ? "+" : ""}
            {fmt(data.priceChange)} ({isUp ? "+" : ""}
            {fmt(data.priceChangePercent)}%)
          </span>
        </div>
      </div>
      <div style={styles.statsGrid}>
        <StatItem label="Day High" value={`₹${fmt(data.dayHigh)}`} />
        <StatItem label="Day Low" value={`₹${fmt(data.dayLow)}`} />
        <StatItem label="Prev Close" value={`₹${fmt(data.previousClose)}`} />
        <StatItem label="Volume" value={fmtVolume(data.volume)} />
      </div>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div style={styles.statItem}>
      <span style={styles.statLabel}>{label}</span>
      <span style={styles.statValue}>{value}</span>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius)",
    padding: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "20px",
    boxShadow: "var(--shadow)",
  },
  left: { display: "flex", flexDirection: "column", gap: "8px" },
  symbolRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  symbol: {
    fontFamily: "var(--font-mono)",
    fontSize: "13px",
    fontWeight: 500,
    color: "var(--accent)",
    letterSpacing: "1px",
  },
  exchange: {
    fontSize: "11px",
    color: "var(--text-muted)",
    fontFamily: "var(--font-mono)",
    background: "var(--surface2)",
    padding: "2px 8px",
    borderRadius: "4px",
  },
  trendPill: {
    fontSize: "10px",
    fontWeight: 700,
    fontFamily: "var(--font-mono)",
    padding: "3px 10px",
    borderRadius: "20px",
    letterSpacing: "0.5px",
  },
  name: {
    fontSize: "18px",
    fontWeight: 700,
    color: "var(--text)",
    letterSpacing: "-0.3px",
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "12px",
    flexWrap: "wrap",
  },
  price: {
    fontSize: "32px",
    fontWeight: 800,
    fontFamily: "var(--font-mono)",
    color: "var(--text)",
    letterSpacing: "-1px",
  },
  change: {
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "var(--font-mono)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px 24px",
  },
  statItem: { display: "flex", flexDirection: "column", gap: "3px" },
  statLabel: {
    fontSize: "10px",
    color: "var(--text-muted)",
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "var(--font-mono)",
    color: "var(--text)",
  },
};
