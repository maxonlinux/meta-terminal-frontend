import {
  formatScaledInt,
  parseDecimalToScaledInt,
} from "@/features/trading/utils/price.format";

export type OrderbookLevel = { price: string; qty: string };
export type GroupedOrderbook = {
  bids: OrderbookLevel[];
  asks: OrderbookLevel[];
};

function stripTrailingZeros(s: string): string {
  if (!s.includes(".")) return s;
  let out = s;
  while (out.endsWith("0")) out = out.slice(0, -1);
  if (out.endsWith(".")) out = out.slice(0, -1);
  return out;
}

function normalizeDecimal(value: string): string {
  const raw = value.trim();
  if (!raw) return raw;
  const lower = raw.toLowerCase();
  if (!lower.includes("e")) return raw;

  const n = Number(lower);
  if (!Number.isFinite(n)) return raw;

  // Cover very small tick sizes like 1e-8 reliably.
  return stripTrailingZeros(n.toFixed(20));
}

function scaleFromTickSizeStr(tickSize: string): number {
  const s = normalizeDecimal(tickSize);
  const dot = s.indexOf(".");
  if (dot === -1) return 0;
  // remove trailing zeros
  let frac = s.slice(dot + 1);
  while (frac.endsWith("0")) frac = frac.slice(0, -1);
  return frac.length;
}

function safeParseScaleInt(value: string, scale: number): number | null {
  return parseDecimalToScaledInt(normalizeDecimal(value), scale);
}

function intCeilDiv(a: number, b: number): number {
  return Math.floor((a + b - 1) / b);
}

function bucketPriceInt(params: {
  side: "BUY" | "SELL";
  priceInt: number;
  groupInt: number;
}): number {
  // Bids: bucket down, Asks: bucket up (Bybit-like view).
  if (params.side === "BUY") {
    return Math.floor(params.priceInt / params.groupInt) * params.groupInt;
  }
  return intCeilDiv(params.priceInt, params.groupInt) * params.groupInt;
}

function groupSide(params: {
  side: "BUY" | "SELL";
  levels: OrderbookLevel[];
  groupInt: number;
  scale: number;
}): OrderbookLevel[] {
  const byPrice = new Map<number, number>();

  for (const l of params.levels) {
    const p = safeParseScaleInt(l.price, params.scale);
    if (p === null) continue;
    const q = Number(l.qty);
    if (!Number.isFinite(q) || q <= 0) continue;

    const bucket = bucketPriceInt({
      side: params.side,
      priceInt: p,
      groupInt: params.groupInt,
    });

    byPrice.set(bucket, (byPrice.get(bucket) ?? 0) + q);
  }

  const out: OrderbookLevel[] = [];
  for (const [bucket, qty] of byPrice.entries()) {
    out.push({
      price: stripTrailingZeros(formatScaledInt(bucket, params.scale)),
      qty: qty.toString(),
    });
  }

  out.sort((a, b) => {
    if (params.side === "BUY") return Number(b.price) - Number(a.price);
    return Number(a.price) - Number(b.price);
  });
  return out;
}

export function generateOrderbookGroupingOptions(params: {
  tickSize: string;
}): string[] {
  const tickNorm = normalizeDecimal(params.tickSize);
  const scale = scaleFromTickSizeStr(tickNorm);
  const tickInt = safeParseScaleInt(tickNorm, scale);
  if (tickInt === null || tickInt <= 0) return ["1"];

  // Bybit-like multipliers: mostly decade-ish steps + a couple of midpoints.
  const multipliers = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 5000, 10000];

  const candidates: number[] = [];
  for (const m of multipliers) {
    const v = tickInt * m;
    if (!Number.isSafeInteger(v) || v <= 0) continue;
    candidates.push(v);
  }

  // Prefer a compact list: start from 10 ticks if possible, then grow.
  const prefer = [10, 100, 1000, 5000, 10000];
  const chosen = new Set<number>();

  const tickIsWhole = scale === 0;
  if (tickIsWhole) chosen.add(tickInt); // show "1" when tick is whole

  for (const m of prefer) {
    const v = tickInt * m;
    if (!Number.isSafeInteger(v) || v <= 0) continue;
    chosen.add(v);
  }

  // Fallback: if nothing selected (very small/odd ticks), include tick itself.
  if (chosen.size === 0) chosen.add(tickInt);

  const out = Array.from(chosen.values())
    .sort((a, b) => a - b)
    .map((v) => stripTrailingZeros(formatScaledInt(v, scale)));

  return out;
}

export function groupOrderbook(params: {
  bids: OrderbookLevel[];
  asks: OrderbookLevel[];
  tickSize: string;
  grouping: string;
}): GroupedOrderbook {
  const tickNorm = normalizeDecimal(params.tickSize);
  const scale = scaleFromTickSizeStr(tickNorm);
  const groupInt = safeParseScaleInt(params.grouping, scale);
  if (groupInt === null || groupInt <= 0) {
    return { bids: params.bids, asks: params.asks };
  }

  // If grouping == tickSize, short-circuit (no grouping).
  const tickInt = safeParseScaleInt(tickNorm, scale);
  if (tickInt !== null && tickInt === groupInt) {
    return { bids: params.bids, asks: params.asks };
  }

  return {
    bids: groupSide({
      side: "BUY",
      levels: params.bids,
      groupInt,
      scale,
    }),
    asks: groupSide({
      side: "SELL",
      levels: params.asks,
      groupInt,
      scale,
    }),
  };
}
