import React, { useState, useCallback, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import StockOverview from "./components/StockOverview";
import DecisionCard from "./components/DecisionCard";
import PriceChart from "./components/PriceChart";
import DetailsSection from "./components/DetailsSection";
import Watchlist from "./components/Watchlist";
import NewsSection from "./components/NewsSection";
import { LoadingState, ErrorState } from "./components/States";
import MarketStatus from "./components/MarketStatus";
import { fetchStock, fetchNews } from "./utils/api";
import { useWatchlist } from "./hooks/useWatchlist";

export default function App() {
  const [stockData, setStockData] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSymbol, setCurrentSymbol] = useState("");

  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const handleSearch = useCallback(async (symbol) => {
    setLoading(true);
    setError(null);
    setStockData(null);
    setCurrentSymbol(symbol);
    setNews([]);

    try {
      const [stockRes, newsRes] = await Promise.allSettled([
        fetchStock(symbol),
        fetchNews(symbol),
      ]);

      if (stockRes.status === "fulfilled") {
        setStockData(stockRes.value.data);
      } else {
        const msg = stockRes.reason?.response?.data?.error || "Failed to fetch stock data";
        setError(msg);
      }

      if (newsRes.status === "fulfilled") {
        setNews(newsRes.value.data.news || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const inWatchlist = stockData ? isInWatchlist(stockData.symbol) : false;

  return (
    <div style={styles.app}>
      <div style={styles.bgGlow} />
      <div style={styles.container}>
        {/* Search */}
        <SearchBar onSearch={handleSearch} loading={loading} />

        {/* Main layout */}
        <div style={{ ...styles.layout, gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1fr) 300px" }}>
          {/* Left / Main column */}
          <div style={styles.mainCol}>
            {loading && <LoadingState symbol={currentSymbol} />}
            {error && !loading && <ErrorState error={error} onRetry={() => handleSearch(currentSymbol)} />}

            {stockData && !loading && (
              <>
                {/* Watchlist action bar */}
                <div style={styles.actionBar}>
                  <span style={styles.analyzing}>
                    ◈ Analyzing <strong>{stockData.symbol}</strong>
                  </span>
                  <button
                    style={{
                      ...styles.watchBtn,
                      background: inWatchlist ? "var(--surface3)" : "var(--accent-glow)",
                      color: inWatchlist ? "var(--text-dim)" : "var(--accent)",
                      border: `1px solid ${inWatchlist ? "var(--border)" : "rgba(79,158,255,0.3)"}`,
                    }}
                    onClick={() =>
                      inWatchlist
                        ? removeFromWatchlist(stockData.symbol)
                        : addToWatchlist(stockData)
                    }
                  >
                    {inWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
                  </button>
                </div>

                <StockOverview data={stockData} />
                <MarketStatus />
                <DecisionCard data={stockData} />
                <PriceChart chartData={stockData.chartData} priceChange={stockData.priceChange} />
                <DetailsSection indicators={stockData.indicators} currentPrice={stockData.currentPrice} />
                <NewsSection news={news} symbol={stockData.symbol} />
              </>
            )}

            {!stockData && !loading && !error && (
              <>
                <MarketStatus />
                <div style={styles.welcome}>
                  <div style={styles.welcomeIcon}>◈</div>
                  <h2 style={styles.welcomeTitle}>Smart Stock Analysis</h2>
                  <p style={styles.welcomeText}>
                    Search any stock symbol to get AI-powered BUY / SELL / HOLD signals with real-time data, RSI, MACD, and moving averages.
                  </p>
                  <div style={styles.welcomeExamples}>
                    {["RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "AAPL", "TSLA"].map((s) => (
                      <button
                        key={s}
                        style={styles.exampleBtn}
                        onClick={() => handleSearch(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right sidebar */}
          <div style={styles.sideCol}>
            <Watchlist
              watchlist={watchlist}
              onRemove={removeFromWatchlist}
              onSelect={handleSearch}
            />
          </div>
        </div>

        <div style={styles.footer}>
          StockSense AI · Data from Yahoo Finance · For educational purposes only · Not financial advice
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    position: "relative",
  },
  bgGlow: {
    position: "fixed",
    top: "-200px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "800px",
    height: "400px",
    background: "radial-gradient(ellipse at center, rgba(79,158,255,0.06) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  container: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 20px 40px",
    position: "relative",
    zIndex: 1,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0,1fr) 300px",
    gap: "20px",
    alignItems: "start",
  },
  mainCol: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    minWidth: 0,
  },
  sideCol: {
    position: "sticky",
    top: "20px",
  },
  actionBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
  },
  analyzing: {
    fontSize: "12px",
    color: "var(--text-dim)",
    fontFamily: "var(--font-mono)",
  },
  watchBtn: {
    padding: "6px 14px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 600,
    fontFamily: "var(--font-mono)",
    cursor: "pointer",
    transition: "all 0.2s",
    letterSpacing: "0.3px",
  },
  welcome: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "80px 40px",
    background: "var(--surface)",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius)",
    textAlign: "center",
  },
  welcomeIcon: {
    fontSize: "48px",
    color: "var(--accent)",
    opacity: 0.4,
    lineHeight: 1,
  },
  welcomeTitle: {
    fontSize: "24px",
    fontWeight: 800,
    color: "var(--text)",
    letterSpacing: "-0.5px",
  },
  welcomeText: {
    fontSize: "14px",
    color: "var(--text-dim)",
    lineHeight: 1.7,
    maxWidth: "400px",
  },
  welcomeExamples: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    justifyContent: "center",
    marginTop: "8px",
  },
  exampleBtn: {
    padding: "8px 16px",
    background: "var(--surface2)",
    border: "1px solid var(--border-bright)",
    borderRadius: "8px",
    color: "var(--accent)",
    fontSize: "12px",
    fontFamily: "var(--font-mono)",
    cursor: "pointer",
    transition: "all 0.15s",
    fontWeight: 500,
  },
  footer: {
    marginTop: "40px",
    textAlign: "center",
    fontSize: "11px",
    color: "var(--text-muted)",
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.3px",
    lineHeight: 1.6,
  },
};
