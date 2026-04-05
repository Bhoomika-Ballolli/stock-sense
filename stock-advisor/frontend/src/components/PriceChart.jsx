import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={tooltipStyle}>
        <div style={{ fontSize: "11px", color: "var(--text-dim)", marginBottom: "4px", fontFamily: "var(--font-mono)" }}>
          {label}
        </div>
        <div style={{ fontSize: "16px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
          ₹{Number(payload[0].value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </div>
      </div>
    );
  }
  return null;
};

const tooltipStyle = {
  background: "var(--surface3)",
  border: "1px solid var(--border-bright)",
  borderRadius: "8px",
  padding: "10px 14px",
  boxShadow: "var(--shadow)",
};

export default function PriceChart({ chartData, priceChange }) {
  const isUp = priceChange >= 0;
  const lineColor = isUp ? "#00c896" : "#ff5c5c";
  const gradStart = isUp ? "rgba(0,200,150,0.2)" : "rgba(255,92,92,0.2)";
  const gradEnd = "rgba(0,0,0,0)";

  if (!chartData || chartData.length === 0) {
    return (
      <div style={{ ...styles.card, alignItems: "center", justifyContent: "center", height: "240px" }}>
        <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "13px" }}>
          No chart data available
        </span>
      </div>
    );
  }

  const prices = chartData.map((d) => d.price).filter(Boolean);
  const minP = Math.min(...prices) * 0.998;
  const maxP = Math.max(...prices) * 1.002;

  return (
    <div style={styles.card} className="fade-in">
      <div style={styles.header}>
        <span style={styles.title}>Price Chart</span>
        <div style={styles.periodRow}>
          <span style={styles.period}>6M</span>
          <span style={styles.dataPoints}>{chartData.length} days</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={lineColor} stopOpacity={0.25} />
              <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="2 4"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-mono)" }}
            axisLine={false}
            tickLine={false}
            interval={Math.floor(chartData.length / 5)}
          />
          <YAxis
            domain={[minP, maxP]}
            tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-mono)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${Math.round(v)}`}
            width={65}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="price"
            stroke={lineColor}
            strokeWidth={2}
            fill="url(#priceGrad)"
            dot={false}
            activeDot={{ r: 5, fill: lineColor, stroke: "var(--surface)", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text-dim)",
    fontFamily: "var(--font-mono)",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  periodRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  period: {
    fontSize: "11px",
    fontFamily: "var(--font-mono)",
    color: "var(--accent)",
    background: "var(--accent-glow)",
    padding: "3px 10px",
    borderRadius: "4px",
    border: "1px solid rgba(79,158,255,0.2)",
  },
  dataPoints: {
    fontSize: "11px",
    color: "var(--text-muted)",
    fontFamily: "var(--font-mono)",
  },
};
