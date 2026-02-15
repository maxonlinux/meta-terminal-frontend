"use client";

import Decimal from "decimal.js";
import type { CandlestickData, Time } from "lightweight-charts";
import { Brackets, Frown, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { WithSkeleton } from "@/components/common/WithSkeleton";
import { useCandlestickChart } from "@/features/trading/hooks/useCandlestickChart";
import { usePosition } from "@/features/trading/hooks/usePosition";
import { useUnrealizedPnl } from "@/features/trading/hooks/useUnrealizedPnl";
import type { TradingInstrument } from "@/features/trading/types";

const timeFrameButtons = [
  { label: "1m", value: 60 },
  { label: "5m", value: 300 },
  { label: "15m", value: 900 },
  { label: "30m", value: 1800 },
  { label: "1h", value: 3600 },
  { label: "4h", value: 14400 },
  { label: "1d", value: 86400 },
];

function formatSignedPnl(pnl: Decimal | null): string {
  if (pnl === null) return "P&L --";
  const v = pnl.toNumber();
  const abs = Math.abs(v);
  const txt = abs.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return v >= 0 ? `P&L +${txt}` : `P&L -${txt}`;
}

const HeadItem = ({ text, value }: { text: string; value: number }) => (
  <div>
    <span className="opacity-50">{text}:</span> {value}
  </div>
);

const OHLC = ({ candles }: { candles: CandlestickData<Time>[][] }) => {
  const lastCandlesBatch = candles[candles.length - 1];
  const lastCandle = lastCandlesBatch[lastCandlesBatch.length - 1];

  return (
    <div className="relative flex gap-3 p-2 items-center text-[12px]">
      <HeadItem text="Open" value={lastCandle?.open} />
      <HeadItem text="High" value={lastCandle?.high} />
      <HeadItem text="Low" value={lastCandle?.low} />
      <HeadItem text="Close" value={lastCandle?.close} />
    </div>
  );
};

const ChartMessages = ({
  candles,
  isLoading,
  error,
}: {
  candles: CandlestickData<Time>[][];
  isLoading: boolean;
  error: unknown;
}) => {
  if (isLoading) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-background/50">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (error) {
    const message = error instanceof Error ? error.message : "Error occurred";

    return (
      <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center opacity-50">
        <Frown />
        <div>{message}</div>
      </div>
    );
  }

  if (!candles.length) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Brackets />
          <span className="font-bold">No data available</span>
        </div>
      </div>
    );
  }
};

export const CandlestickChart = ({
  instrument,
  category,
}: {
  instrument: TradingInstrument;
  category: string;
}) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  const [timeFrame, setTimeFrame] = useState(timeFrameButtons[0].value);
  const pricePrecision = instrument ? instrument.pricePrecision : null;

  const { candles, isLoading, setPositionOverlayModel, error } =
    useCandlestickChart(
      chartContainerRef,
      instrument,
      timeFrame,
      pricePrecision,
    );

  // ✅ CHANGED: подтянули позицию (LINEAR) по текущему инструменту
  const { position } = usePosition({
    symbol: instrument.symbol,
    enabled: category === "LINEAR",
  });

  const pnl = useUnrealizedPnl(position);

  // ✅ CHANGED: строим модель для primitive+priceLine и пушим в hook
  const overlayModel = useMemo(() => {
    if (!position) return null;

    const entry = Number(position.entryPrice);
    if (!Number.isFinite(entry)) return null;

    const size = Number(position.size);
    if (!Number.isFinite(size) || size === 0) return null;

    const qty = new Decimal(Math.abs(size));
    const qtyText = qty.isFinite() ? qty.toFixed() : "--";
    const pnlText = formatSignedPnl(pnl);

    return {
      entryPrice: entry,
      pnlText,
      qtyText,
    };
  }, [position, pnl]);

  useEffect(() => {
    setPositionOverlayModel(overlayModel);
  }, [overlayModel, setPositionOverlayModel]);

  return (
    <div className="size-full flex flex-col divide-y divide-white/15 border border-white/15 rounded-xs max-md:min-h-[400px bg-secondary-background">
      <WithSkeleton data={{ candles }} skeleton={undefined}>
        {({ candles }) => <OHLC candles={candles} />}
      </WithSkeleton>

      <div className="relative flex size-full min-h-80">
        <WithSkeleton data={{ candles }} skeleton={null}>
          {({ candles }) => (
            <ChartMessages
              candles={candles}
              isLoading={isLoading}
              error={error}
            />
          )}
        </WithSkeleton>
        <div ref={chartContainerRef} className="absolute inset-0" />
      </div>
      <div className="flex py-1">
        {timeFrameButtons.map((button) => (
          <button
            type="button"
            key={button.label}
            className={`w-12 h-8 rounded-md cursor-pointer hover:bg-white/10 text-sm ${
              timeFrame === button.value ? "" : "opacity-50"
            }`}
            onClick={() => setTimeFrame(button.value)}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};
