import { useState, useEffect } from "react";

const KEY = "stocksense_watchlist";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (stock) => {
    setWatchlist((prev) => {
      if (prev.find((s) => s.symbol === stock.symbol)) return prev;
      return [
        ...prev,
        {
          symbol: stock.symbol,
          name: stock.name,
          currentPrice: stock.currentPrice,
          priceChangePercent: stock.priceChangePercent,
          decision: stock.decision,
          confidence: stock.confidence,
        },
      ];
    });
  };

  const removeFromWatchlist = (symbol) => {
    setWatchlist((prev) => prev.filter((s) => s.symbol !== symbol));
  };

  const updateWatchlistItem = (symbol, updates) => {
    setWatchlist((prev) =>
      prev.map((s) => (s.symbol === symbol ? { ...s, ...updates } : s))
    );
  };

  const isInWatchlist = (symbol) => watchlist.some((s) => s.symbol === symbol);

  return { watchlist, addToWatchlist, removeFromWatchlist, updateWatchlistItem, isInWatchlist };
}
