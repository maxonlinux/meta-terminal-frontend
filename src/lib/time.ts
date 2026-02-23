import { format } from "date-fns";

export function formatTimestamp(input: number | string): string {
  const ts = Number(input);
  if (!Number.isFinite(ts)) return "--";
  return format(new Date(ts), "yyyy-MM-dd HH:mm:ss");
}
