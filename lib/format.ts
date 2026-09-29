/**
 * Parse a Postgres timestamptz string into a Date. Handles both the DB's
 * `now()` text ("2026-09-19 20:12:35.076+00") and ISO strings we write via
 * `toISOString()` ("2026-09-19T20:12:35.076Z").
 */
export function toDate(value: string): Date {
  const iso = value.includes("T")
    ? value
    : value.replace(" ", "T").replace(/\+00(?::?00)?$/, "Z");
  return new Date(iso);
}

/** Format a Postgres timestamptz string for display. Falls back to the date portion. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const d = toDate(value);
  return Number.isNaN(d.getTime())
    ? value.slice(0, 10)
    : d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}
