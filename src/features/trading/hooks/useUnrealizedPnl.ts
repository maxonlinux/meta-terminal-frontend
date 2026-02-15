"use client";

import Decimal from "decimal.js";
import { useMemo } from "react";
import { useRealTimePrice } from "@/features/trading/hooks/useRealTimePrice";
import type { TradingPosition } from "@/features/trading/types";

export function useUnrealizedPnl(
  position: TradingPosition | null,
): Decimal | null {
  const symbol = position?.symbol ?? null;

  // для LINEAR символ уже правильный (BTCUSDT и т.п.)
  const { price } = useRealTimePrice(symbol ?? "");

  return useMemo(() => {
    if (!position) return null;
    const size = new Decimal(position.size);
    if (size.isZero()) return new Decimal(0);
    if (typeof price !== "number") return null;

    const entry = new Decimal(position.entryPrice);
    const mark = new Decimal(price);

    // LONG
    if (size.gt(0)) {
      return mark.minus(entry).mul(size);
    }

    // SHORT
    return entry.minus(mark).mul(size.abs());
  }, [position, price]);
}
