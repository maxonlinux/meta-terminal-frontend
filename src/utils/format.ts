export function clampPrecision(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(18, Math.floor(n)));
}

export function formatNumber(
  value: number,
  params?: { maxDecimals?: number; minDecimals?: number },
) {
  if (!Number.isFinite(value)) return "--";
  const maxDecimals = clampPrecision(params?.maxDecimals ?? 8);
  const minDecimals = clampPrecision(params?.minDecimals ?? 0);
  return value.toLocaleString(undefined, {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: Math.min(minDecimals, maxDecimals),
  });
}

export function formatUsd(value: number) {
  return formatNumber(value, { maxDecimals: 2, minDecimals: 2 });
}

export function formatDecimalString(value: string, maxDecimals = 8) {
  const n = Number(value);
  return formatNumber(n, { maxDecimals });
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function formatDateTime(input: number | string) {
  const d = new Date(input);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(
    d.getHours(),
  )}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}
