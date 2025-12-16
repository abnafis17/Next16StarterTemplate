export interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

export function formatYMD(ymd?: string | null) {
  if (!ymd) return "—";
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return "—";
  const dt = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short", // e.g., "Oct"
    year: "numeric",
  }).format(dt); // => "18 Oct, 2025" (locale-dependent)
}

export function formatCommitmentDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d); // e.g., "18 Oct, 2025" (locale-style)
}
