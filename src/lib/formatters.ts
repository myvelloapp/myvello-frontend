import { getCurrencySymbol } from "./currencyTimezoneData";

/**
 * Deterministic number and currency formatters that produce identical
 * output on both Server (Node.js SSR) and Client (Browser) to prevent React hydration errors.
 */

export function formatAmount(
  amount: number | string | undefined | null,
  currency = "INR"
): string {
  if (amount === undefined || amount === null) return "0";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0";

  const locale = currency?.toUpperCase() === "INR" ? "en-IN" : "en-US";
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatCurrency(
  amount: number | string | undefined | null,
  currency = "INR"
): string {
  const formatted = formatAmount(amount, currency);
  const symbol = getCurrencySymbol(currency);
  const hasSpace = /^[A-Z]{3,4}$/.test(symbol);

  return `${symbol}${hasSpace ? " " : ""}${formatted}`;
}

export { getCurrencySymbol };

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  try {
    const trimmed = dateStr.trim();
    if (/^\d{1,2}\s+[A-Za-z]{3},?\s+\d{4}$/.test(trimmed)) {
      return trimmed;
    }
    const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const year = match[1];
      const monthIndex = parseInt(match[2], 10) - 1;
      const day = match[3];
      const month = MONTH_NAMES[monthIndex] || match[2];
      return `${day} ${month}, ${year}`;
    }
    const d = new Date(trimmed);
    if (isNaN(d.getTime())) return trimmed;
    const day = String(d.getDate()).padStart(2, "0");
    const month = MONTH_NAMES[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
  } catch {
    return dateStr;
  }
}
