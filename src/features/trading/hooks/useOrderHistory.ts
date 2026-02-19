"use client";

import useSWR from "swr";
import { getOrderHistory } from "@/api/trading";
import type { TradingCategory } from "@/features/trading/types";

export function useOrderHistory(params: {
  category: TradingCategory;
  symbol: string;
  limit?: number;
}) {
  const { data, error, isLoading } = useSWR(
    `history:orders:${params.category}:${params.symbol}:${params.limit ?? ""}`,
    async () => await getOrderHistory(params),
  );

  return { data, isLoading, error };
}
