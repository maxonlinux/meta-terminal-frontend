import Decimal from "decimal.js";

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

function bucketPrice(params: {
  side: "BUY" | "SELL";
  price: Decimal;
  group: Decimal;
}): Decimal {
  // Bids: bucket down, Asks: bucket up (Bybit-like view).
  if (params.side === "BUY") {
    return params.price.div(params.group).floor().mul(params.group);
  }
  return params.price.div(params.group).ceil().mul(params.group);
}

function groupSide(params: {
  side: "BUY" | "SELL";
  levels: OrderbookLevel[];
  group: Decimal;
  scale: number;
}): OrderbookLevel[] {
  const byPrice = new Map<string, Decimal>();

  for (const l of params.levels) {
    const price = new Decimal(l.price);
    const qty = new Decimal(l.qty);
    if (qty.lte(0)) continue;

    const bucket = bucketPrice({
      side: params.side,
      price,
      group: params.group,
    });

    const key = bucket
      .toDecimalPlaces(params.scale, Decimal.ROUND_DOWN)
      .toString();
    const current = byPrice.get(key) ?? new Decimal(0);
    byPrice.set(key, current.plus(qty));
  }

  const out: OrderbookLevel[] = [];
  for (const [bucket, qty] of byPrice.entries()) {
    out.push({
      price: stripTrailingZeros(bucket),
      qty: qty.toString(),
    });
  }

  out.sort((a, b) => {
    const ap = new Decimal(a.price);
    const bp = new Decimal(b.price);
    if (params.side === "BUY") return bp.comparedTo(ap);
    return ap.comparedTo(bp);
  });
  return out;
}

export function generateOrderbookGroupingOptions(params: {
  tickSize: string;
}): string[] {
  const tick = new Decimal(params.tickSize);
  const scale = tick.decimalPlaces() ?? 0;
  if (tick.lte(0)) return ["1"];

  // Bybit-like multipliers: mostly decade-ish steps + a couple of midpoints.
  const multipliers = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 5000, 10000];

  const candidates: Decimal[] = [];
  for (const m of multipliers) {
    const v = tick.mul(m);
    if (v.lte(0)) continue;
    candidates.push(v);
  }

  // Prefer a compact list: start from 10 ticks if possible, then grow.
  const prefer = [10, 100, 1000, 5000, 10000];
  const chosen = new Map<string, Decimal>();

  if (scale === 0) {
    chosen.set(tick.toString(), tick); // show "1" when tick is whole
  }

  for (const m of prefer) {
    const v = tick.mul(m);
    if (v.lte(0)) continue;
    chosen.set(v.toString(), v);
  }

  // Fallback: if nothing selected (very small/odd ticks), include tick itself.
  if (chosen.size === 0) chosen.set(tick.toString(), tick);

  const out = Array.from(chosen.values())
    .sort((a, b) => a.comparedTo(b))
    .map((v) =>
      stripTrailingZeros(
        v.toDecimalPlaces(scale, Decimal.ROUND_DOWN).toString(),
      ),
    );

  const tickLabel = stripTrailingZeros(
    tick.toDecimalPlaces(scale, Decimal.ROUND_DOWN).toString(),
  );
  return [tickLabel, ...out.filter((v) => v !== tickLabel)];
}

export function groupOrderbook(params: {
  bids: OrderbookLevel[];
  asks: OrderbookLevel[];
  tickSize: string;
  grouping: string;
}): GroupedOrderbook {
  const tick = new Decimal(params.tickSize);
  const scale = tick.decimalPlaces() ?? 0;
  const group = new Decimal(params.grouping);
  if (group.lte(0)) {
    return { bids: params.bids, asks: params.asks };
  }

  // If grouping == tickSize, short-circuit (no grouping).
  if (tick.eq(group)) {
    return { bids: params.bids, asks: params.asks };
  }

  return {
    bids: groupSide({
      side: "BUY",
      levels: params.bids,
      group,
      scale,
    }),
    asks: groupSide({
      side: "SELL",
      levels: params.asks,
      group,
      scale,
    }),
  };
}
