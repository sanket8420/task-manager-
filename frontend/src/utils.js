export function formatDueDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDay = new Date(d);
  dueDay.setHours(0, 0, 0, 0);
  const diffDays = Math.round((dueDay - today) / 86400000);

  const label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  if (diffDays === 0) return { label: "Today", overdue: false };
  if (diffDays === 1) return { label: "Tomorrow", overdue: false };
  if (diffDays < 0) return { label: `${label} · overdue`, overdue: true };
  return { label, overdue: false };
}

export const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export const PRIORITY_LABEL = { high: "High", medium: "Medium", low: "Low" };
