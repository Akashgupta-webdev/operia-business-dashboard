const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });

export function formatComplianceDate(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? dateFormatter.format(date) : "\u2014";
}

// Provisional display rules until the API supplies a filing status.
// Compare calendar dates in the business timezone, not elapsed 24-hour periods.
export function getComplianceStatus(nextDueDate, now = new Date()) {
  const due = nextDueDate ? new Date(nextDueDate) : null;
  if (!due || Number.isNaN(due.getTime())) return "Not set";
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dubai", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  const days = Math.round((Date.parse(due.toISOString().slice(0, 10)) - Date.parse(today)) / 86400000);
  if (days < 0) return "Overdue";
  return days <= 30 ? "Due Soon" : "Pending";
}
