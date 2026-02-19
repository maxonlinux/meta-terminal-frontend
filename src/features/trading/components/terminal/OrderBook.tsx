"use client";

import { useEffect, useMemo, useState } from "react";
import Decimal from "decimal.js";
import { ListBoxItem } from "react-aria-components";
import { Skeleton } from "@/components/common/Skeleton";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useOrderbook } from "@/features/trading/hooks/useOrderbook";
import type { TradingInstrument } from "@/features/trading/types";
import {
  generateOrderbookGroupingOptions,
  groupOrderbook,
} from "@/features/trading/utils/orderbook.grouping";

const ORDERS_LENGTH = 11;

// Skeleton rows: keep a small buffer so it looks like your current one.
const SKELETON_ROWS = ORDERS_LENGTH + 1;
const SKELETON_ROW_IDS = Array.from(
  { length: SKELETON_ROWS },
  (_, i) => `row-${i}`,
);

// Overlay styling (Bybit-like)
const OVERLAY_BG = "bg-white/10";
const OVERLAY_DASH = "rgba(255,255,255,0.45)";

// Layout
const ROW_H = 24; // fixed so overlay is continuous between rows
const LIST_H = ROW_H * ORDERS_LENGTH;

const ZERO = new Decimal(0);
const HUNDRED = new Decimal(100);

function clampPct(value: Decimal): Decimal {
  return Decimal.min(HUNDRED, Decimal.max(ZERO, value));
}

type Level = { price: string; qty: string };
type MaybeLevel = Level | null;

type Hover = { side: "ASK"; idx: number } | { side: "BID"; idx: number } | null;

type Overlay = {
  side: "ASK" | "BID";
  top: number;
  height: number;
  boundaryY: number;
} | null;

const levelKey = (side: "ASK" | "BID", level: MaybeLevel, idx: number) => {
  if (level) return `${side}:${level.price}:${idx}`;
  return `${side}:0:${idx}`;
};

const OrderBookSkeleton = () => {
  return (
    <div className="@container size-full border border-white/10 rounded-xs divide-y divide-white/10">
      <div className="flex justify-between items-center p-2">
        <span className="text-[12px] font-semibold">ORDER BOOK</span>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-300 divide-y divide-white/10 overflow-hidden">
        <div className="flex flex-col @lg:flex-row @lg:divide-x @lg:divide-white/10">
          <div className="flex flex-col divide-y divide-white/10 w-full">
            {SKELETON_ROW_IDS.map((id) => (
              <Skeleton key={id} className="w-full h-6" />
            ))}
          </div>
          <div
            className="flex items-center justify-center text-center text-gray-400
            @max-lg:border-y @max-lg:border-white/10 min-h-6 min-w-12"
          >
            <Skeleton className="w-full h-full" />
          </div>
          <div className="flex flex-col divide-y divide-white/10 w-full">
            {SKELETON_ROW_IDS.map((id) => (
              <Skeleton key={id} className="w-full h-6" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderBookHead = ({ className }: { className?: string }) => {
  return (
    <div className={`flex flex-row justify-between px-4 py-1 ${className}`}>
      <span>Price</span>
      <span>Size</span>
      <span>Total</span>
    </div>
  );
};

function padLevels(levels: Level[], count: number): MaybeLevel[] {
  const out: MaybeLevel[] = new Array(count).fill(null);
  const n = count < levels.length ? count : levels.length;
  for (let i = 0; i < n; i++) out[i] = levels[i] ?? null;
  return out;
}

function maxQtyOf(levels: MaybeLevel[]): Decimal {
  let max = ZERO;
  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    if (!level) continue;
    const qty = new Decimal(level.qty);
    if (qty.isFinite() && qty.gt(max)) max = qty;
  }
  return max;
}

function lastNonNullPrice(
  levels: MaybeLevel[],
  fallback: string | null,
): string | null {
  for (let i = levels.length - 1; i >= 0; i--) {
    const level = levels[i];
    if (level) return level.price;
  }
  return fallback;
}

function imbalancePctFromLevels(params: {
  bids: MaybeLevel[];
  asks: MaybeLevel[];
}): { bidPct: Decimal; askPct: Decimal } {
  const sumQty = (levels: MaybeLevel[]) => {
    let total = ZERO;
    for (let i = 0; i < levels.length; i++) {
      const level = levels[i];
      if (!level) continue;
      const qty = new Decimal(level.qty);
      if (qty.isFinite() && qty.gt(0)) total = total.plus(qty);
    }
    return total;
  };

  const bidTotal = sumQty(params.bids);
  const askTotal = sumQty(params.asks);
  const total = bidTotal.plus(askTotal);

  if (!total.isFinite() || total.lte(0)) {
    return { bidPct: new Decimal(50), askPct: new Decimal(50) };
  }

  const bidPct = bidTotal
    .div(total)
    .mul(HUNDRED)
    .toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
  const askPct = HUNDRED.minus(bidPct);
  return { bidPct, askPct };
}

function calcHoverStats(params: {
  hover: Hover;
  bids: MaybeLevel[];
  asks: MaybeLevel[];
}) {
  const h = params.hover;
  if (!h) return null;

  const pick = (arr: MaybeLevel[]) => arr.filter((x): x is Level => !!x);

  if (h.side === "BID") {
    const slice = pick(params.bids.slice(0, h.idx + 1));
    let totalQty = ZERO;
    let totalNotional = ZERO;

    for (let i = 0; i < slice.length; i++) {
      const l = slice[i];
      const p = new Decimal(l.price);
      const q = new Decimal(l.qty);
      if (!p.isFinite() || !q.isFinite()) continue;
      totalQty = totalQty.plus(q);
      totalNotional = totalNotional.plus(p.mul(q));
    }

    const avg = totalQty.gt(0) ? totalNotional.div(totalQty) : ZERO;
    return { totalQty, totalNotional, avgPrice: avg };
  }

  // ASK: viewAsks reversed => best ask at bottom; cumulative from hovered to bottom.
  const slice = pick(params.asks.slice(h.idx));
  let totalQty = ZERO;
  let totalNotional = ZERO;

  for (let i = 0; i < slice.length; i++) {
    const l = slice[i];
    const p = new Decimal(l.price);
    const q = new Decimal(l.qty);
    if (!p.isFinite() || !q.isFinite()) continue;
    totalQty = totalQty.plus(q);
    totalNotional = totalNotional.plus(p.mul(q));
  }

  const avg = totalQty.gt(0) ? totalNotional.div(totalQty) : ZERO;
  return { totalQty, totalNotional, avgPrice: avg };
}

function overlayFromHover(hover: Hover): Overlay {
  if (!hover) return null;

  if (hover.side === "BID") {
    const top = 0;
    const height = (hover.idx + 1) * ROW_H;
    const boundaryY = height;
    return { side: "BID", top, height, boundaryY };
  }

  const top = hover.idx * ROW_H;
  const height = LIST_H - top;
  const boundaryY = top;
  return { side: "ASK", top, height, boundaryY };
}

const HoverCard = (params: {
  stats: {
    totalQty: Decimal;
    totalNotional: Decimal;
    avgPrice: Decimal;
  } | null;
  pricePrecision: number;
  qtyPrecision: number;
}) => {
  const s = params.stats;
  if (!s) return null;

  const avg = s.avgPrice;
  const tq = s.totalQty;
  const tn = s.totalNotional;

  return (
    <div className="absolute left-2 bottom-2 z-10 rounded-md bg-black/40 border border-white/10 px-3 py-2 text-[12px] text-white/80 backdrop-blur pointer-events-none">
      <div className="flex gap-3 justify-between">
        <span>Avg. Price</span>
        <span className="tabular-nums">
          {avg.isFinite()
            ? avg
                .toDecimalPlaces(params.pricePrecision, Decimal.ROUND_DOWN)
                .toString()
            : "--"}
        </span>
      </div>
      <div className="flex gap-3 justify-between">
        <span>Total Qty</span>
        <span className="tabular-nums">
          {tq.isFinite()
            ? tq
                .toDecimalPlaces(params.qtyPrecision, Decimal.ROUND_DOWN)
                .toString()
            : "--"}
        </span>
      </div>
      <div className="flex gap-3 justify-between">
        <span>Total (USDT)</span>
        <span className="tabular-nums">
          {tn.isFinite()
            ? tn.toDecimalPlaces(3, Decimal.ROUND_DOWN).toString()
            : "--"}
        </span>
      </div>
    </div>
  );
};

const OverlayLayer = (params: { overlay: Overlay; side: "ASK" | "BID" }) => {
  const o = params.overlay;
  if (!o) return null;
  if (o.side !== params.side) return null;

  return (
    <>
      <div
        className={`absolute left-0 right-0 ${OVERLAY_BG} pointer-events-none`}
        style={{ top: o.top, height: o.height }}
      />
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: o.boundaryY,
          borderTop: `1px dashed ${OVERLAY_DASH}`,
        }}
      />
    </>
  );
};

const OrderBookItem = ({
  side,
  idx,
  level,
  pricePrecision,
  qtyPrecision,
  maxQuantity,
  hover,
  setHover,
}: {
  side: -1 | 1;
  idx: number;
  level: MaybeLevel;
  pricePrecision: number;
  qtyPrecision: number;
  maxQuantity: Decimal;
  hover: Hover;
  setHover: (h: Hover) => void;
}) => {
  const isBuy = side > 0;

  const depthBg = isBuy ? "bg-blue-500/10" : "bg-red-500/10";
  const color = isBuy ? "text-blue-500" : "text-red-400";

  const priceDec = level ? new Decimal(level.price) : null;
  const qtyDec = level ? new Decimal(level.qty) : ZERO;
  const priceText = priceDec
    ? priceDec.toDecimalPlaces(pricePrecision, Decimal.ROUND_DOWN).toString()
    : "--";

  const quantityText = level
    ? qtyDec.toDecimalPlaces(qtyPrecision, Decimal.ROUND_DOWN).toString()
    : "--";

  const total = priceDec ? priceDec.mul(qtyDec) : null;
  const totalText = total
    ? total.toDecimalPlaces(3, Decimal.ROUND_DOWN).toString()
    : "--";

  const widthPct = maxQuantity.gt(0)
    ? qtyDec.div(maxQuantity).mul(HUNDRED)
    : ZERO;
  const w = clampPct(widthPct).toString();

  const hoverSide: "ASK" | "BID" = isBuy ? "BID" : "ASK";
  const isSelected =
    hover !== null && hover.side === hoverSide && hover.idx === idx;

  return (
    <div
      role="option"
      aria-selected={isSelected}
      tabIndex={-1}
      className="relative grid grid-flow-col gap-2 px-4 py-1 outline-none"
      style={{ height: ROW_H }}
      onPointerEnter={() => setHover({ side: hoverSide, idx })}
      onPointerLeave={() => setHover(null)}
      onFocus={() => setHover({ side: hoverSide, idx })}
      onBlur={() => setHover(null)}
    >
      <div
        className={`absolute right-0 top-0 h-full ${depthBg} pointer-events-none`}
        style={{ width: `${w}%` }}
      />
      <span className={`truncate relative ${color}`}>{priceText}</span>
      <span className="text-center relative">{quantityText}</span>
      <span className="text-right relative">{totalText}</span>
    </div>
  );
};

const ImbalanceBar = (params: { bidPct: Decimal; askPct: Decimal }) => {
  const bidLabel = params.bidPct
    .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
    .toString();
  const askLabel = params.askPct
    .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
    .toString();

  return (
    <div className="flex items-center gap-2 px-3 py-2 text-xs text-white/70">
      <span className="text-blue-500 tabular-nums">B {bidLabel}%</span>
      <div className="relative flex-1 h-3 rounded-xs overflow-hidden bg-white/5">
        <div
          className="absolute left-0 top-0 h-full bg-blue-500/25"
          style={{ width: `${params.bidPct.toString()}%` }}
        />
        <div
          className="absolute right-0 top-0 h-full bg-red-500/25"
          style={{ width: `${params.askPct.toString()}%` }}
        />
      </div>
      <span className="text-red-400 tabular-nums">{askLabel}% S</span>
    </div>
  );
};

const OrderBookSide = (params: {
  side: "ASK" | "BID";
  sign: -1 | 1;
  levels: MaybeLevel[];
  overlay: Overlay;
  hover: Hover;
  hoverStats: {
    totalQty: number;
    totalNotional: number;
    avgPrice: number;
  } | null;
  pricePrecision: number;
  qtyPrecision: number;
  maxQuantity: Decimal;
  setHover: (h: Hover) => void;
}) => {
  const showCard = params.hover !== null && params.hover.side === params.side;

  // a11y: listbox -> options
  const ariaLabel =
    params.side === "ASK" ? "Order book asks" : "Order book bids";

  return (
    <div className="w-full">
      <OrderBookHead className="@max-lg:hidden border-b border-white/10" />
      <div
        role="listbox"
        aria-label={ariaLabel}
        className="relative"
        style={{ height: LIST_H }}
        onPointerLeave={() => params.setHover(null)}
      >
        <OverlayLayer overlay={params.overlay} side={params.side} />

        {params.levels.map((level, i) => (
          <OrderBookItem
            key={levelKey(params.side, level, i)}
            side={params.sign}
            idx={i}
            level={level}
            pricePrecision={params.pricePrecision}
            qtyPrecision={params.qtyPrecision}
            maxQuantity={params.maxQuantity}
            hover={params.hover}
            setHover={params.setHover}
          />
        ))}

        {showCard ? (
          <HoverCard
            stats={params.hoverStats}
            pricePrecision={params.pricePrecision}
            qtyPrecision={params.qtyPrecision}
          />
        ) : null}
      </div>
    </div>
  );
};

function OrderBookReady(params: {
  instrument: TradingInstrument;
  category: string;

  bids: Level[];
  asks: Level[];
  bestAsk: string | null;
  bestBid: string | null;

  grouping: string;
  setGrouping: (v: string) => void;
}) {
  const [hover, setHover] = useState<Hover>(null);

  const pricePrecision = params.instrument.pricePrecision;
  const qtyPrecision = params.instrument.quantityPrecision;
  const tickSize = params.instrument.tickSize;

  const groupingOptions = useMemo(() => {
    const raw = generateOrderbookGroupingOptions({ tickSize });
    return raw.length ? raw : [tickSize];
  }, [tickSize]);

  const effectiveGrouping = params.grouping || groupingOptions[0] || tickSize;

  const grouped = useMemo(() => {
    return groupOrderbook({
      bids: params.bids,
      asks: params.asks,
      tickSize,
      grouping: effectiveGrouping,
    });
  }, [params.bids, params.asks, tickSize, effectiveGrouping]);

  const viewBids = useMemo(() => {
    return padLevels(grouped.bids.slice(0, ORDERS_LENGTH), ORDERS_LENGTH);
  }, [grouped.bids]);

  const viewAsks = useMemo(() => {
    const asc = padLevels(grouped.asks.slice(0, ORDERS_LENGTH), ORDERS_LENGTH);
    return [...asc].reverse();
  }, [grouped.asks]);

  const maxQuantity = useMemo(() => {
    return Decimal.max(maxQtyOf(viewBids), maxQtyOf(viewAsks));
  }, [viewBids, viewAsks]);

  const viewBestBid = viewBids[0] ? viewBids[0].price : params.bestBid;

  const viewBestAsk = useMemo(() => {
    return lastNonNullPrice(viewAsks, params.bestAsk);
  }, [viewAsks, params.bestAsk]);

  const spread = useMemo(() => {
    const bestBid = params.bestBid ?? viewBestBid;
    const bestAsk = params.bestAsk ?? viewBestAsk;
    return spreadText({
      bestBid,
      bestAsk,
      pricePrecision,
    });
  }, [
    params.bestBid,
    params.bestAsk,
    viewBestBid,
    viewBestAsk,
    pricePrecision,
  ]);

  const imbalance = useMemo(() => {
    return imbalancePctFromLevels({ bids: viewBids, asks: viewAsks });
  }, [viewBids, viewAsks]);

  const overlay = useMemo(() => overlayFromHover(hover), [hover]);

  const hoverStats = useMemo(() => {
    return calcHoverStats({ hover, bids: viewBids, asks: viewAsks });
  }, [hover, viewBids, viewAsks]);

  return (
    <div className="@container size-full border border-white/10 rounded-xs divide-y divide-white/10 bg-secondary-background">
      <div className="flex justify-between items-center p-2">
        <span className="text-[12px] font-semibold">ORDER BOOK</span>
        <CustomSelect<{ value: string }>
          items={groupingOptions.map((value) => ({ value }))}
          selectProps={{
            placeholder: effectiveGrouping,
            selectedKey: effectiveGrouping,
            onSelectionChange: (key) => {
              const next = typeof key === "string" ? key : null;
              if (!next) return;
              params.setGrouping(next);
            },
          }}
        >
          {(item) => (
            <ListBoxItem
              key={item.value}
              id={item.value}
              className="p-2 text-xs focus:bg-neutral-900 focus:cursor-pointer focus:text-white"
              textValue={item.value}
            >
              <span>{item.value}</span>
            </ListBoxItem>
          )}
        </CustomSelect>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-300 divide-y divide-white/10 overflow-hidden">
        <OrderBookHead className="@lg:hidden" />

        <div className="flex flex-col @lg:flex-row @lg:divide-x @lg:divide-white/10">
          <OrderBookSide
            side="ASK"
            sign={-1}
            levels={viewAsks}
            overlay={overlay}
            hover={hover}
            hoverStats={hoverStats}
            pricePrecision={pricePrecision}
            qtyPrecision={qtyPrecision}
            maxQuantity={maxQuantity}
            setHover={setHover}
          />

          <div
            className="flex items-center justify-center text-center p-1 text-gray-400
            @max-lg:border-y @max-lg:border-white/10"
          >
            Spread: {spread}
          </div>

          <OrderBookSide
            side="BID"
            sign={1}
            levels={viewBids}
            overlay={overlay}
            hover={hover}
            hoverStats={hoverStats}
            pricePrecision={pricePrecision}
            qtyPrecision={qtyPrecision}
            maxQuantity={maxQuantity}
            setHover={setHover}
          />
        </div>
      </div>

      <ImbalanceBar bidPct={imbalance.bidPct} askPct={imbalance.askPct} />
    </div>
  );
}

export default function OrderBook(params: {
  instrument: TradingInstrument;
  category: string;
}) {
  const [grouping, setGrouping] = useState<string>("");

  useEffect(() => {
    if (params.instrument.tickSize) {
      setGrouping(params.instrument.tickSize);
    }
  }, [params.instrument.tickSize]);

  const { bids, asks, bestAsk, bestBid } = useOrderbook({
    category: params.category,
    symbol: params.instrument.symbol,
    depth: 200,
  });

  const levelsReady = bids !== null && asks !== null;
  if (!levelsReady) return <OrderBookSkeleton />;

  return (
    <OrderBookReady
      instrument={params.instrument}
      category={params.category}
      bids={bids}
      asks={asks}
      bestAsk={bestAsk}
      bestBid={bestBid}
      grouping={grouping}
      setGrouping={setGrouping}
    />
  );
}
