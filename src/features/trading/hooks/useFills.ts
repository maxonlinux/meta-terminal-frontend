"use client";

import useSWR from "swr";
import { getFills } from "@/api/trading";
import type { TradingCategory } from "@/features/trading/types";

export function useFills(params: {
  category: TradingCategory;
  symbol: string;
  limit?: number;
}) {
  const { data, error, isLoading } = useSWR(
    `history:fills:${params.category}:${params.symbol}`,
    async () => await getFills(params),
  );

  return { data, isLoading, error };
}
