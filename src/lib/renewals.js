import { RENEWAL_CATEGORIES, RENEWALS_DUE_SOON_DAYS } from "../constants/renewals.js";

export function getRenewalStatus(value, now = new Date()) {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value ?? "");
  const unknown = { state: "unknown", label: "Unknown", tone: "neutral", days: null };
  if (!match) return unknown;
  const [, day, month, year] = match.map(Number);
  const expiry = new Date(0);
  expiry.setUTCFullYear(year, month - 1, day);
  if (expiry.getUTCFullYear() !== year || expiry.getUTCMonth() !== month - 1 || expiry.getUTCDate() !== day) return unknown;
  // Compare calendar days in UTC so an expiry today stays due, including across DST changes.
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const days = Math.round((expiry.getTime() - today) / 86400000);
  if (days < 0) return { state: "expired", label: "Expired", tone: "danger", days };
  if (days <= RENEWALS_DUE_SOON_DAYS) return { state: "due-soon", label: "Due Soon", tone: days < 7 ? "danger" : "warning", days };
  return { state: "valid", label: "Valid", tone: "success", days };
}

export function getRenewalCategory(category) {
  return RENEWAL_CATEGORIES.find((option) => option.value === category)?.label ?? category;
}

export function filterRenewals(items, { search, category, status }, now = new Date()) {
  const term = search.trim().toLowerCase();
  return items.filter((item) => (category === "all" || item.category === category)
    && (status === "all" || getRenewalStatus(item.expiryDate, now).state === status)
    && (!term || [item.item, item.entity, item.clientName, getRenewalCategory(item.category)]
      .some((value) => String(value ?? "").toLowerCase().includes(term))));
}

export function getRenewalClientUrl(item) {
  if (!item.clientId) return null;
  const tab = ["company", "member", "driver", "vehicle"].includes(item.source) ? "?tab=companies" : "";
  return "/clients/" + encodeURIComponent(item.clientId) + tab;
}

export function getRenewalPageNumbers(page, totalPages) {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  return [...pages].filter((value) => value >= 1 && value <= totalPages).sort((a, b) => a - b);
}
