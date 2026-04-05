import React from "react";

export default function NewsSection({ news, symbol }) {
  if (!news || news.length === 0) return null;

  return (
    <div style={styles.wrapper} className="fade-in">
      <div style={styles.header}>
        <span style={styles.title}>Latest News</span>
        <span style={styles.symbol}>{symbol}</span>
      </div>
      <div style={styles.list}>
        {news.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.item}
          >
            <span style={styles.dot} />
            <div style={styles.itemContent}>
              <span style={styles.itemTitle}>{item.title}</span>
              <div style={styles.itemMeta}>
                <span style={styles.source}>{item.source}</span>
                <span style={styles.time}>{item.time}</span>
              </div>
            </div>
            <span style={styles.arrow}>↗</span>
          </a>
        ))}
      </div>
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 20px",
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
  symbol: {
    fontSize: "11px",
    color: "var(--accent)",
    fontFamily: "var(--font-mono)",
  },
  list: { display: "flex", flexDirection: "column" },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px 20px",
    borderBottom: "1px solid var(--border)",
    textDecoration: "none",
    transition: "background 0.15s",
    cursor: "pointer",
  },
  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "var(--accent)",
    flexShrink: 0,
    opacity: 0.6,
  },
  itemContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: 0,
  },
  itemTitle: {
    fontSize: "13px",
    color: "var(--text)",
    lineHeight: 1.4,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  itemMeta: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  source: {
    fontSize: "10px",
    color: "var(--accent)",
    fontFamily: "var(--font-mono)",
  },
  time: {
    fontSize: "10px",
    color: "var(--text-muted)",
    fontFamily: "var(--font-mono)",
  },
  arrow: {
    fontSize: "13px",
    color: "var(--text-muted)",
    flexShrink: 0,
  },
};
