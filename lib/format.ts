/** Format a Date for display. */
export function formatDate(value: Date | null | undefined): string {
  if (!value) return "";
  return value.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
