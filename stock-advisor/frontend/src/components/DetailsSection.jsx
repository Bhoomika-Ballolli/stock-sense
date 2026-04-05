import React, { useState } from "react";

function fmt(n) {
  if (n === null || n === undefined) return "—";
  return Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getRsiStatus(rsi) {
  if (rsi === null) return { label: "N/A", color: "var(--text-muted)" };
  if (rsi > 70) return { label: "Overbought", color: "var(--red)" };
  if (rsi < 30) return { label: "Oversold", color: "var(--green)" };
  return { label: "Neutral", color: "var(--yellow)" };
}

function IndicatorRow({ label, value, status, statusColor, bar, barColor, barMax = 100 }) {
  return (
    <div style={rowStyles.wrap}>
      <div style={rowStyles.top}>
        <span style={rowStyles.label}>{label}</span>
        <div style={rowStyles.right}>
          <span style={{ ...rowStyles.value, fontFamily: "var(--font-mono)" }}>{value}</span>
          {status && (
            <span style={{ ...rowStyles.status, color: statusColor }}>{status}</span>
          )}
        </div>
      </div>
      {bar !== null && bar !== undefined && (
        <div style={rowStyles.barBg}>
          <div
            style={{
              ...rowStyles.barFill,
              width: `${Math.min(100, (bar / barMax) * 100)}%`,
              background: barColor || "var(--accent)",
            }}
          />
        </div>
      )}
    </div>
  );
}

const rowStyles = {
  wrap: { display: "flex", flexDirection: "column", gap: "6px" },
  top: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-mono)", letterSpacing: "0.5px" },
  right: { display: "flex", alignItems: "center", gap: "8px" },
  value: { fontSize: "13px", fontWeight: 600, color: "var(--text)" },
  status: { fontSize: "10px", fontWeight: 700, fontFamily: "var(--font-mono)", letterSpacing: "0.5px" },
  barBg: { height: "4px", background: "var(--surface3)", borderRadius: "2px", overflow: "hidden" },
  barFill: { height: "100%", borderRadius: "2px", transition: "width 0.6s ease" },
};

export default function DetailsSection({ indicators, currentPrice }) {
  const [open, setOpen] = useState(false);
  const { rsi, macd, macdSignal, ma50, ma200 } = indicators;
  const rsiStatus = getRsiStatus(rsi);

  return (
    <div style={styles.wrapper} className={open ? "fade-in" : ""}>
      <button
        style={styles.toggleBtn}
        onClick={() => setOpen((o) => !o)}
      >
        <span>Technical Indicators</span>
        <span style={{ ...styles.chevron, transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          ▾
        </span>
      </button>

      {open && (
        <div style={styles.content} className="fade-in">
          <div style={styles.grid}>
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Momentum</div>
              <IndicatorRow
                label="RSI (14)"
                value={rsi ? fmt(rsi) : "—"}
                status={rsiStatus.label}
                statusColor={rsiStatus.color}
                bar={rsi}
                barMax={100}
                barColor={rsiStatus.color}
              />
              <IndicatorRow
                label="MACD Line"
                value={macd ? fmt(macd) : "—"}
                status={macd && macdSignal ? (macd > macdSignal ? "Bullish" : "Bearish") : "—"}
                statusColor={macd && macdSignal ? (macd > macdSignal ? "var(--green)" : "var(--red)") : "var(--text-muted)"}
              />
              <IndicatorRow
                label="MACD Signal"
                value={macdSignal ? fmt(macdSignal) : "—"}
              />
            </div>

            <div style={styles.section}>
              <div style={styles.sectionTitle}>Moving Averages</div>
              <IndicatorRow
                label="MA 50"
                value={ma50 ? `₹${fmt(ma50)}` : "—"}
                status={ma50 && currentPrice ? (currentPrice > ma50 ? "Above ▲" : "Below ▼") : "—"}
                statusColor={ma50 && currentPrice ? (currentPrice > ma50 ? "var(--green)" : "var(--red)") : "var(--text-muted)"}
              />
              <IndicatorRow
                label="MA 200"
                value={ma200 ? `₹${fmt(ma200)}` : "—"}
                status={ma200 && currentPrice ? (currentPrice > ma200 ? "Above ▲" : "Below ▼") : "—"}
                statusColor={ma200 && currentPrice ? (currentPrice > ma200 ? "var(--green)" : "var(--red)") : "var(--text-muted)"}
              />
              {ma50 && ma200 && (
                <div style={styles.crossSignal}>
                  <span style={{ fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                    Golden/Death Cross:
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      fontFamily: "var(--font-mono)",
                      color: ma50 > ma200 ? "var(--green)" : "var(--red)",
                    }}
                  >
                    {ma50 > ma200 ? "🟢 Golden Cross" : "🔴 Death Cross"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div style={styles.note}>
            * Indicators calculated from 6-month historical data. RSI &lt; 30 = oversold (buy zone), RSI &gt; 70 = overbought (sell zone).
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    background: "var(--surface)",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius)",
    overflow: "hidden",
  },
  toggleBtn: {
    width: "100%",
    padding: "16px 20px",
    background: "none",
    border: "none",
    color: "var(--text)",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
    fontWeight: 600,
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.5px",
  },
  chevron: {
    fontSize: "16px",
    color: "var(--text-dim)",
    transition: "transform 0.25s ease",
    display: "inline-block",
  },
  content: {
    padding: "0 20px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    borderTop: "1px solid var(--border)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    paddingTop: "16px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  sectionTitle: {
    fontSize: "10px",
    color: "var(--text-muted)",
    fontFamily: "var(--font-mono)",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    marginBottom: "4px",
  },
  crossSignal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "var(--surface2)",
    borderRadius: "6px",
    padding: "8px 12px",
  },
  note: {
    fontSize: "10px",
    color: "var(--text-muted)",
    fontFamily: "var(--font-mono)",
    lineHeight: 1.6,
    borderTop: "1px solid var(--border)",
    paddingTop: "12px",
  },
};
