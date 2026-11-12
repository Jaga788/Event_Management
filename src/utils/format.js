export const formatINR = (n) => "₹" + Math.round(Number(n)).toLocaleString("en-IN");

export const GST_RATE = 0.18;

// Returns a "YYYY-MM-DD" string for tomorrow (earliest date for booking an event).
export function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// Safe localStorage helpers (never crash if storage is blocked or broken).
export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}
