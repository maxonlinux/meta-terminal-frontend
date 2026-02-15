export function clampPrecision(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(18, Math.floor(n)));
}

export function formatFixed(value: number, decimals: number): string {
  if (!Number.isFinite(value)) return "--";
  return value.toFixed(clampPrecision(decimals));
}

function pow10(n: number): number {
  let out = 1;
  for (let i = 0; i < n; i++) out *= 10;
  return out;
}

/**
 * Parses a base-10 decimal string into a scaled integer number.
 * Example (scale=2): "12.34" -> 1234
 *
 * Returns null on invalid input.
 */
export function parseDecimalToScaledInt(
  value: string,
  scale: number,
): number | null {
  const s = value.trim();
  if (!s) return null;

  const sign = s.startsWith("-") ? -1 : 1;
  const unsigned = sign === -1 ? s.slice(1) : s;
  if (!unsigned) return null;

  const parts = unsigned.split(".");
  if (parts.length > 2) return null;
  const intPart = parts[0] ?? "";
  const fracPart = parts[1] ?? "";

  if (!/^\d+$/.test(intPart)) return null;
  if (fracPart && !/^\d+$/.test(fracPart)) return null;

  const frac = fracPart.length > scale ? fracPart.slice(0, scale) : fracPart;
  const paddedFrac = frac.padEnd(scale, "0");

  const base = Number.parseInt(intPart || "0", 10) * pow10(scale);
  const add = paddedFrac ? Number.parseInt(paddedFrac, 10) : 0;
  const out = sign * (base + add);
  if (!Number.isSafeInteger(out)) return null;
  return out;
}

export function formatScaledInt(value: number, scale: number): string {
  if (!Number.isSafeInteger(value)) return "--";
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  const mul = pow10(scale);
  const intPart = Math.floor(abs / mul);
  const fracPart = abs - intPart * mul;
  if (scale === 0) return `${sign}${intPart}`;
  const frac = String(fracPart).padStart(scale, "0");
  return `${sign}${intPart}.${frac}`;
}

export function spreadText(params: {
  bestBid: string | null;
  bestAsk: string | null;
  pricePrecision: number;
}): string {
  if (!(params.bestBid && params.bestAsk)) return "--";

  const scale = clampPrecision(params.pricePrecision);
  const bid = parseDecimalToScaledInt(params.bestBid, scale);
  const ask = parseDecimalToScaledInt(params.bestAsk, scale);
  if (bid === null || ask === null) return "--";

  return formatScaledInt(ask - bid, scale);
}
