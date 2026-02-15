"use client";

import useSWR from "swr";
import { apiJson } from "@/api/http";
import type { TradingCategory, TradingFill } from "@/features/trading/types";

export function useFills(params: {
  category: TradingCategory;
  symbol: string;
  limit?: number;
}) {
  const { data, error, isLoading } = useSWR(
    `history:fills:${params.category}:${params.symbol}`,
    async () => {
      const body = await apiJson<{ fills: TradingFill[] }>(
        "/user/history/fills",
        {
          query: { category: params.category, symbol: params.symbol },
        },
      );
      return body.fills;
    },
  );

  return { data, isLoading, error };
}
