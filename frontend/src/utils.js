export function formatDueDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDay = new Date(d);
  dueDay.setHours(0, 0, 0, 0);
  const diffDays = Math.round((dueDay - today) / 86400000);

  const hasTime = d.getHours() !== 0 || d.getMinutes() !== 0;
  const timeLabel = hasTime
    ? d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : null;
  const dateLabel = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const overdue = d < now;

  let dayLabel;
  if (diffDays === 0) dayLabel = "Today";
  else if (diffDays === 1) dayLabel = "Tomorrow";
  else if (diffDays === -1) dayLabel = "Yesterday";
  else dayLabel = dateLabel;

  const label = timeLabel ? `${dayLabel} · ${timeLabel}` : dayLabel;
  return { label: overdue ? `${label} · overdue` : label, overdue };
}

// Convert an ISO datetime string to the value a <input type="datetime-local">
// expects (local time, "YYYY-MM-DDTHH:mm"), or "" if none.
export function toDatetimeLocalValue(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

// Convert a datetime-local input value back to an ISO string for the API.
export function fromDatetimeLocalValue(value) {
  if (!value) return null;
  return new Date(value).toISOString();
}

export const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export const PRIORITY_LABEL = { high: "High", medium: "Medium", low: "Low" };
