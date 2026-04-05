import { useState, useEffect } from "react";

// NSE/BSE holidays 2025 (add future years as needed)
const MARKET_HOLIDAYS = new Set([
  "2025-01-26", // Republic Day
  "2025-02-19", // Chhatrapati Shivaji Maharaj Jayanti
  "2025-03-14", // Holi
  "2025-03-31", // Id-Ul-Fitr (Ramzan)
  "2025-04-10", // Dr. Baba Saheb Ambedkar Jayanti (Observed)
  "2025-04-14", // Dr. Baba Saheb Ambedkar Jayanti
  "2025-04-18", // Good Friday
  "2025-05-01", // Maharashtra Day
  "2025-08-15", // Independence Day
  "2025-08-27", // Ganesh Chaturthi
  "2025-10-02", // Gandhi Jayanti / Dussehra
  "2025-10-21", // Diwali Laxmi Puja
  "2025-10-22", // Diwali Balipratipada
  "2025-11-05", // Prakash Gurpurb Sri Guru Nanak Dev Ji
  "2025-12-25", // Christmas

  // 2026 (add when official list releases)
  "2026-01-26", // Republic Day
  "2026-04-03", // Good Friday (approx)
  "2026-08-15", // Independence Day
  "2026-10-02", // Gandhi Jayanti
  "2026-12-25", // Christmas
]);

const OPEN_H = 9,  OPEN_M  = 15; // 09:15 IST
const CLOSE_H = 15, CLOSE_M = 30; // 15:30 IST

function toIST(date) {
  return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

function isoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function isHoliday(istDate) {
  return MARKET_HOLIDAYS.has(isoDate(istDate));
}

function isWeekend(istDate) {
  const day = istDate.getDay(); // 0=Sun, 6=Sat
  return day === 0 || day === 6;
}

function getMarketState(now) {
  const ist = toIST(now);
  const h = ist.getHours();
  const m = ist.getMinutes();
  const totalMinutes = h * 60 + m;
  const openMinutes  = OPEN_H  * 60 + OPEN_M;  // 555
  const closeMinutes = CLOSE_H * 60 + CLOSE_M; // 930

  const weekend = isWeekend(ist);
  const holiday = isHoliday(ist);

  const isOpen =
    !weekend &&
    !holiday &&
    totalMinutes >= openMinutes &&
    totalMinutes < closeMinutes;

  // ── Pre-open: same day before 9:15 (weekday, non-holiday) ──────────────
  const isPreOpen =
    !weekend &&
    !holiday &&
    totalMinutes < openMinutes;

  let closedReason = "";
  if (weekend) closedReason = ist.getDay() === 6 ? "Saturday" : "Sunday";
  else if (holiday) closedReason = "Holiday";
  else if (totalMinutes >= closeMinutes) closedReason = "After Hours";
  else if (isPreOpen) closedReason = "Pre-Market";

  // ── Next open time ───────────────────────────────────────────────────────
  function nextOpenUTC() {
    // Start from IST midnight of current day
    const candidate = new Date(ist);
    candidate.setHours(0, 0, 0, 0); // midnight IST (but this is a local Date object)

    // If today is a weekday, non-holiday, and we're before close, check today
    // Otherwise move to next day
    if (!isOpen) {
      // If pre-open today → open is today at 9:15
      if (isPreOpen) {
        candidate.setHours(OPEN_H, OPEN_M, 0, 0);
        return candidate;
      }
      // Otherwise advance to next day
      candidate.setDate(candidate.getDate() + 1);
    }

    // Walk forward until we find a weekday non-holiday
    for (let i = 0; i < 10; i++) {
      const dayStr = isoDate(candidate);
      const dow = candidate.getDay();
      if (dow !== 0 && dow !== 6 && !MARKET_HOLIDAYS.has(dayStr)) {
        candidate.setHours(OPEN_H, OPEN_M, 0, 0);
        return candidate;
      }
      candidate.setDate(candidate.getDate() + 1);
    }
    return null;
  }

  const nextOpen = isOpen ? null : nextOpenUTC();

  // Diff in ms from real `now` to nextOpen
  let msUntilOpen = null;
  if (nextOpen) {
    // nextOpen is in IST "local" — convert back to UTC ms difference
    // We derive the offset: IST = UTC+5:30
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
    const nextOpenUTCms = nextOpen.getTime() - IST_OFFSET_MS + (now.getTimezoneOffset() * 60 * 1000);
    // Simpler: use the real Date difference
    // since toIST gives us a local Date adjusted to IST values,
    // we can compute how many ms from `now` (UTC) to the next 9:15 IST
    // = find the UTC epoch of nextOpen
    const istNow = toIST(now);
    const diffMs = nextOpen - istNow; // both are Date objects in IST-adjusted values
    msUntilOpen = diffMs > 0 ? diffMs : 0;
  }

  const closingInMs =
    isOpen
      ? (() => {
          const closeIST = new Date(ist);
          closeIST.setHours(CLOSE_H, CLOSE_M, 0, 0);
          return Math.max(0, closeIST - ist);
        })()
      : null;

  return {
    isOpen,
    isPreOpen,
    weekend,
    holiday,
    closedReason,
    msUntilOpen,
    closingInMs,
    istTime: ist,
  };
}

function formatCountdown(ms) {
  if (ms === null || ms <= 0) return null;
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  if (days > 0) return `${days}d ${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h ${mins}m ${secs}s`;
  return `${mins}m ${secs}s`;
}

export function useMarketStatus() {
  const [state, setState] = useState(() => {
    const s = getMarketState(new Date());
    return { ...s, countdown: formatCountdown(s.msUntilOpen), closingCountdown: formatCountdown(s.closingInMs) };
  });

  useEffect(() => {
    const tick = () => {
      const s = getMarketState(new Date());
      setState({ ...s, countdown: formatCountdown(s.msUntilOpen), closingCountdown: formatCountdown(s.closingInMs) });
    };
    tick();
    const id = setInterval(tick, 1000); // update every second for live countdown
    return () => clearInterval(id);
  }, []);

  return state;
}
