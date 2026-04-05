require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── Utility: fetch from Yahoo Finance v8 ───────────────────────────────────
async function fetchYahoo(symbol) {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    Accept: "application/json",
    "Accept-Language": "en-US,en;q=0.9",
  };

  // Quote
  const quoteUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=6mo`;
  const res = await axios.get(quoteUrl, { headers, timeout: 10000 });
  return res.data;
}

// ─── Simple Moving Average ───────────────────────────────────────────────────
function sma(prices, period) {
  if (prices.length < period) return null;
  const slice = prices.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

// ─── EMA ────────────────────────────────────────────────────────────────────
function ema(prices, period) {
  if (prices.length < period) return null;
  const k = 2 / (period + 1);
  let emaVal = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < prices.length; i++) {
    emaVal = prices[i] * k + emaVal * (1 - k);
  }
  return emaVal;
}

// ─── RSI ────────────────────────────────────────────────────────────────────
function rsi(prices, period = 14) {
  if (prices.length < period + 1) return null;
  let gains = 0,
    losses = 0;
  for (let i = prices.length - period; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

// ─── MACD ───────────────────────────────────────────────────────────────────
function macd(prices) {
  const ema12 = ema(prices, 12);
  const ema26 = ema(prices, 26);
  if (!ema12 || !ema26) return { macd: null, signal: null, histogram: null };
  const macdLine = ema12 - ema26;
  // Signal: EMA of MACD (simplified with last 9 values)
  const macdValues = [];
  for (let i = Math.max(0, prices.length - 35); i <= prices.length - 1; i++) {
    const slice = prices.slice(0, i + 1);
    const e12 = ema(slice, 12);
    const e26 = ema(slice, 26);
    if (e12 && e26) macdValues.push(e12 - e26);
  }
  const signalLine = ema(macdValues, 9);
  return {
    macd: macdLine,
    signal: signalLine,
    histogram: signalLine ? macdLine - signalLine : null,
  };
}

// ─── Core Decision Logic ─────────────────────────────────────────────────────
function analyzeSignals(currentPrice, previousClose, closes) {
  const ma50 = sma(closes, 50);
  const ma200 = sma(closes, 200);
  const rsiVal = rsi(closes);
  const macdData = macd(closes);

  const trend = currentPrice < previousClose ? "down" : "up";

  const bullishSignals = [];
  const bearishSignals = [];

  if (ma50 !== null) {
    if (currentPrice > ma50) bullishSignals.push("Price above MA50");
    else bearishSignals.push("Price below MA50");
  }
  if (ma200 !== null) {
    if (currentPrice > ma200) bullishSignals.push("Price above MA200");
    else bearishSignals.push("Price below MA200");
  }
  if (macdData.macd !== null && macdData.signal !== null) {
    if (macdData.macd > macdData.signal) bullishSignals.push("MACD bullish crossover");
    else bearishSignals.push("MACD bearish crossover");
  }
  if (rsiVal !== null) {
    if (rsiVal < 30) bullishSignals.push("RSI oversold (buy zone)");
    else if (rsiVal > 70) bearishSignals.push("RSI overbought (sell zone)");
  }
  if (trend === "up") bullishSignals.push("Short-term trend is UP");
  else bearishSignals.push("Short-term trend is DOWN");

  // Priority rule
  let decision, confidence, explanation;

  if (trend === "down" && ma50 !== null && currentPrice < ma50) {
    decision = "SELL";
    confidence = Math.min(95, 60 + bearishSignals.length * 7);
    explanation = `Sell signal: stock is trending down and trading below its 50-day average. ${bearishSignals.length} bearish indicator${bearishSignals.length > 1 ? "s" : ""} active.`;
  } else if (bearishSignals.length >= 3) {
    decision = "SELL";
    confidence = Math.min(92, 50 + bearishSignals.length * 8);
    explanation = `${bearishSignals.length} bearish signals dominate. ${bearishSignals.slice(0, 2).join(" and ")}.`;
  } else if (bullishSignals.length >= 3) {
    decision = "BUY";
    confidence = Math.min(92, 50 + bullishSignals.length * 8);
    explanation = `${bullishSignals.length} bullish signals detected. ${bullishSignals.slice(0, 2).join(" and ")}.`;
  } else {
    decision = "HOLD";
    const totalSignals = bullishSignals.length + bearishSignals.length;
    confidence = totalSignals > 0 ? Math.round(50 + Math.abs(bullishSignals.length - bearishSignals.length) * 5) : 50;
    explanation = `Mixed signals — ${bullishSignals.length} bullish vs ${bearishSignals.length} bearish. No strong trend to act on.`;
  }

  return {
    decision,
    confidence,
    explanation,
    trend,
    indicators: {
      rsi: rsiVal ? Math.round(rsiVal * 100) / 100 : null,
      macd: macdData.macd ? Math.round(macdData.macd * 100) / 100 : null,
      macdSignal: macdData.signal ? Math.round(macdData.signal * 100) / 100 : null,
      ma50: ma50 ? Math.round(ma50 * 100) / 100 : null,
      ma200: ma200 ? Math.round(ma200 * 100) / 100 : null,
    },
    bullishSignals,
    bearishSignals,
  };
}

// ─── GET /api/stock/:symbol ──────────────────────────────────────────────────
app.get("/api/stock/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  try {
    const data = await fetchYahoo(symbol);
    const result = data?.chart?.result?.[0];
    if (!result) return res.status(404).json({ error: "Symbol not found" });

    const meta = result.meta;
    const timestamps = result.timestamp || [];
    const closes = result.indicators?.quote?.[0]?.close || [];
    const highs = result.indicators?.quote?.[0]?.high || [];
    const lows = result.indicators?.quote?.[0]?.low || [];
    const volumes = result.indicators?.quote?.[0]?.volume || [];

    // Filter out nulls
    const validCloses = closes.filter((c) => c !== null && c !== undefined);

    if (validCloses.length < 5) {
      return res.status(400).json({ error: "Insufficient price data" });
    }

    const currentPrice = meta.regularMarketPrice || validCloses[validCloses.length - 1];
    const previousClose = meta.chartPreviousClose || meta.previousClose || validCloses[validCloses.length - 2];
    const priceChange = currentPrice - previousClose;
    const priceChangePercent = (priceChange / previousClose) * 100;

    // Chart data (last 30 days)
    const chartData = timestamps
      .map((ts, i) => ({
        date: new Date(ts * 1000).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        price: closes[i],
        high: highs[i],
        low: lows[i],
        volume: volumes[i],
      }))
      .filter((d) => d.price !== null && d.price !== undefined)
      .slice(-30);

    const analysis = analyzeSignals(currentPrice, previousClose, validCloses);

    res.json({
      symbol,
      name: meta.longName || meta.shortName || symbol,
      exchange: meta.exchangeName || "",
      currency: meta.currency || "INR",
      currentPrice: Math.round(currentPrice * 100) / 100,
      previousClose: Math.round(previousClose * 100) / 100,
      priceChange: Math.round(priceChange * 100) / 100,
      priceChangePercent: Math.round(priceChangePercent * 100) / 100,
      dayHigh: meta.regularMarketDayHigh || null,
      dayLow: meta.regularMarketDayLow || null,
      volume: meta.regularMarketVolume || null,
      marketCap: meta.marketCap || null,
      chartData,
      ...analysis,
    });
  } catch (err) {
    console.error("Stock fetch error:", err.message);
    if (err.response?.status === 404) {
      return res.status(404).json({ error: "Stock symbol not found. Try RELIANCE.NS or IDEA.NS" });
    }
    res.status(500).json({ error: "Failed to fetch stock data. Please try again." });
  }
});

// ─── GET /api/news/:symbol ───────────────────────────────────────────────────
app.get("/api/news/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  // Return structured placeholder news (real Yahoo Finance news requires scraping)
  const news = [
    {
      title: `${symbol} — Analyst maintains target price amid market volatility`,
      url: `https://finance.yahoo.com/quote/${symbol}/news`,
      source: "Yahoo Finance",
      time: "2h ago",
    },
    {
      title: `${symbol} — Volume spike detected in today's trading session`,
      url: `https://finance.yahoo.com/quote/${symbol}`,
      source: "Market Watch",
      time: "4h ago",
    },
    {
      title: `${symbol} — Technical analysis: Key support and resistance levels`,
      url: `https://finance.yahoo.com/quote/${symbol}/analysis`,
      source: "Investing.com",
      time: "6h ago",
    },
  ];
  res.json({ news });
});

// ─── Health check ────────────────────────────────────────────────────────────
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`✅ Stock Advisor API running on port ${PORT}`));
