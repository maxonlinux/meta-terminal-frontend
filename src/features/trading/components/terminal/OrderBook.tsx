"use client";

import { useMemo, useState } from "react";
import { ListBoxItem } from "react-aria-components";
import { Skeleton } from "@/components/common/Skeleton";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useOrderbook } from "@/features/trading/hooks/useOrderbook";
import type { TradingInstrument } from "@/features/trading/types";
import {
  generateOrderbookGroupingOptions,
  groupOrderbook,
} from "@/features/trading/utils/orderbook.grouping";
import { formatFixed } from "@/features/trading/utils/price.format";

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
  const n = Math.min(count, levels.length);
  for (let i = 0; i < n; i++) out[i] = levels[i] ?? null;
  return out;
}

function spreadText(params: {
  bestBid: string | null;
  bestAsk: string | null;
  pricePrecision: number;
}): string {
  const bb = params.bestBid;
  const ba = params.bestAsk;
  if (!bb || !ba) return "--";

  const bid = Number(bb);
  const ask = Number(ba);
  if (!Number.isFinite(bid) || !Number.isFinite(ask)) return "--";
  if (ask < bid) return "--";

  return formatFixed(ask - bid, params.pricePrecision);
}

function maxQtyOf(levels: MaybeLevel[]): number {
  let max = 1e-9;
  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    if (!level) continue;
    const qty = Number(level.qty);
    if (Number.isFinite(qty) && qty > max) max = qty;
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
}): { bidPct: number; askPct: number } {
  const sumQty = (levels: MaybeLevel[]) => {
    let total = 0;
    for (let i = 0; i < levels.length; i++) {
      const level = levels[i];
      if (!level) continue;
      const qty = Number(level.qty);
      if (Number.isFinite(qty) && qty > 0) total += qty;
    }
    return total;
  };

  const bidTotal = sumQty(params.bids);
  const askTotal = sumQty(params.asks);
  const total = bidTotal + askTotal;

  if (!Number.isFinite(total) || total <= 0) return { bidPct: 50, askPct: 50 };

  const bidPct = Math.round((bidTotal / total) * 100);
  const askPct = 100 - bidPct;
  return { bidPct, askPct };
}

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
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
    let totalQty = 0;
    let totalNotional = 0;

    for (let i = 0; i < slice.length; i++) {
      const l = slice[i];
      const p = Number(l.price);
      const q = Number(l.qty);
      if (!Number.isFinite(p) || !Number.isFinite(q)) continue;
      totalQty += q;
      totalNotional += p * q;
    }

    const avg = totalQty > 0 ? totalNotional / totalQty : 0;
    return { totalQty, totalNotional, avgPrice: avg };
  }

  // ASK: viewAsks reversed => best ask at bottom; cumulative from hovered to bottom.
  const slice = pick(params.asks.slice(h.idx));
  let totalQty = 0;
  let totalNotional = 0;

  for (let i = 0; i < slice.length; i++) {
    const l = slice[i];
    const p = Number(l.price);
    const q = Number(l.qty);
    if (!Number.isFinite(p) || !Number.isFinite(q)) continue;
    totalQty += q;
    totalNotional += p * q;
  }

  const avg = totalQty > 0 ? totalNotional / totalQty : 0;
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
  stats: { totalQty: number; totalNotional: number; avgPrice: number } | null;
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
          {Number.isFinite(avg)
            ? formatFixed(avg, params.pricePrecision)
            : "--"}
        </span>
      </div>
      <div className="flex gap-3 justify-between">
        <span>Total Qty</span>
        <span className="tabular-nums">
          {Number.isFinite(tq) ? formatFixed(tq, params.qtyPrecision) : "--"}
        </span>
      </div>
      <div className="flex gap-3 justify-between">
        <span>Total (USDT)</span>
        <span className="tabular-nums">
          {Number.isFinite(tn) ? tn.toFixed(3) : "--"}
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
  maxQuantity: number;
  hover: Hover;
  setHover: (h: Hover) => void;
}) => {
  const isBuy = side > 0;

  const depthBg = isBuy ? "bg-blue-500/10" : "bg-red-500/10";
  const color = isBuy ? "text-blue-500" : "text-red-400";

  const priceText = level
    ? formatFixed(Number(level.price), pricePrecision)
    : "--";

  const qty = level ? Number(level.qty) : 0;
  const quantityText = level ? formatFixed(qty, qtyPrecision) : "--";

  const total = level ? Number(level.price) * Number(level.qty) : NaN;
  const totalText = level
    ? Number.isFinite(total)
      ? total.toFixed(3)
      : "--"
    : "--";

  const w = clamp01(maxQuantity > 0 ? qty / maxQuantity : 0) * 100;

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

const ImbalanceBar = (params: { bidPct: number; askPct: number }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-2 text-xs text-white/70">
      <span className="text-blue-500 tabular-nums">
        B {Math.round(params.bidPct)}%
      </span>
      <div className="relative flex-1 h-3 rounded-xs overflow-hidden bg-white/5">
        <div
          className="absolute left-0 top-0 h-full bg-blue-500/25"
          style={{ width: `${params.bidPct}%` }}
        />
        <div
          className="absolute right-0 top-0 h-full bg-red-500/25"
          style={{ width: `${params.askPct}%` }}
        />
      </div>
      <span className="text-red-400 tabular-nums">
        {Math.round(params.askPct)}% S
      </span>
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
  maxQuantity: number;
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
    return Math.max(maxQtyOf(viewBids), maxQtyOf(viewAsks));
  }, [viewBids, viewAsks]);

  const viewBestBid = viewBids[0] ? viewBids[0].price : params.bestBid;

  const viewBestAsk = useMemo(() => {
    return lastNonNullPrice(viewAsks, params.bestAsk);
  }, [viewAsks, params.bestAsk]);

  const spread = useMemo(() => {
    return spreadText({
      bestBid: viewBestBid,
      bestAsk: viewBestAsk,
      pricePrecision,
    });
  }, [viewBestBid, viewBestAsk, pricePrecision]);

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
