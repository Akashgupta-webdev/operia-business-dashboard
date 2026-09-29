// API dates use DD-MM-YYYY. Compare calendar days without daylight-saving offsets.
export function parseDocumentDate(value) {
  if (typeof value !== 'string') return null;
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
  if (!match) return null;
  const [, day, month, year] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
}

export function documentExpiry(value, now = new Date()) {
  const date = parseDocumentDate(value);
  if (!date) return { label: 'Unknown', days: '—', className: 'bg-muted text-muted-foreground' };
  const days = Math.round((date.getTime() - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
  if (days < 0) return { label: 'Expired', days: `${Math.abs(days)} days overdue`, className: 'bg-destructive/10 text-destructive' };
  if (days <= 30) return { label: 'Expiring soon', days: days === 0 ? 'Expires today' : `${days} days`, className: 'bg-warning-container text-warning-container-foreground' };
  return { label: 'Valid', days: `${days} days`, className: 'bg-success-container text-success-container-foreground' };
}

export function documentLink(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
