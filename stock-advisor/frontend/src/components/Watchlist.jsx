import React from "react";

const DECISION_COLORS = {
  BUY: "var(--green)",
  SELL: "var(--red)",
  HOLD: "var(--yellow)",
};

export default function Watchlist({ watchlist, onRemove, onSelect }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <span style={styles.title}>Watchlist</span>
        <span style={styles.count}>{watchlist.length}</span>
      </div>

      {watchlist.length === 0 ? (
        <div style={styles.empty}>
          <span style={styles.emptyIcon}>⊕</span>
          <span style={styles.emptyText}>Search and add stocks to track them here</span>
        </div>
      ) : (
        <div style={styles.list}>
          {watchlist.map((stock) => {
            const isUp = stock.priceChangePercent >= 0;
            const decColor = DECISION_COLORS[stock.decision] || "var(--yellow)";
            return (
              <div key={stock.symbol} style={styles.item}>
                <div
                  style={styles.itemMain}
                  onClick={() => onSelect(stock.symbol)}
                  role="button"
                  tabIndex={0}
                >
                  <div style={styles.itemLeft}>
                    <span style={styles.itemSymbol}>
                      {stock.symbol.replace(".NS", "").replace(".BSE", "")}
                    </span>
                    <span style={styles.itemName}>{stock.name?.slice(0, 20)}</span>
                  </div>
                  <div style={styles.itemRight}>
                    <span style={styles.itemPrice}>
                      ₹{Number(stock.currentPrice).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span
                      style={{
                        ...styles.itemChange,
                        color: isUp ? "var(--green)" : "var(--red)",
                      }}
                    >
                      {isUp ? "+" : ""}
                      {Number(stock.priceChangePercent).toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div style={styles.itemFooter}>
                  <span
                    style={{
                      ...styles.decisionTag,
                      color: decColor,
                      background: `${decColor}15`,
                      border: `1px solid ${decColor}30`,
                    }}
                  >
                    {stock.decision}
                  </span>
                  <button
                    style={styles.removeBtn}
                    onClick={() => onRemove(stock.symbol)}
                    title="Remove from watchlist"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
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
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid var(--border)",
  },
  title: {
    fontSize: "11px",
    fontWeight: 700,
    color: "var(--text-dim)",
    fontFamily: "var(--font-mono)",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  },
  count: {
    background: "var(--accent-glow)",
    color: "var(--accent)",
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: "10px",
    border: "1px solid rgba(79,158,255,0.2)",
  },
  empty: {
    padding: "32px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: "28px",
    color: "var(--text-muted)",
    lineHeight: 1,
  },
  emptyText: {
    fontSize: "12px",
    color: "var(--text-muted)",
    lineHeight: 1.6,
  },
  list: {
    display: "flex",
    flexDirection: "column",
  },
  item: {
    borderBottom: "1px solid var(--border)",
    padding: "12px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    transition: "background 0.15s",
  },
  itemMain: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    cursor: "pointer",
  },
  itemLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  itemSymbol: {
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--text)",
    fontFamily: "var(--font-mono)",
  },
  itemName: {
    fontSize: "10px",
    color: "var(--text-dim)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  itemRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "2px",
  },
  itemPrice: {
    fontSize: "13px",
    fontWeight: 600,
    fontFamily: "var(--font-mono)",
    color: "var(--text)",
  },
  itemChange: {
    fontSize: "11px",
    fontFamily: "var(--font-mono)",
    fontWeight: 500,
  },
  itemFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  decisionTag: {
    fontSize: "9px",
    fontWeight: 700,
    fontFamily: "var(--font-mono)",
    letterSpacing: "1px",
    padding: "3px 8px",
    borderRadius: "4px",
  },
  removeBtn: {
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer",
    fontSize: "16px",
    lineHeight: 1,
    padding: "0 4px",
    transition: "color 0.15s",
  },
};
