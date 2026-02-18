"use client";

import useSWR from "swr";
import type { TradingCategory, TradingFill } from "@/features/trading/types";

export function useFills(params: {
  category: TradingCategory;
  symbol: string;
  limit?: number;
}) {
  const { data, error, isLoading } = useSWR(
    `history:fills:${params.category}:${params.symbol}`,
    async () => {
      const query = new URLSearchParams({
        category: params.category,
        symbol: params.symbol,
      }).toString();
      const res = await fetch(
        `/proxy/main/api/v1/user/history/fills?${query}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      const body = (await res.json()) as { fills: TradingFill[] };
      return body.fills;
    },
  );

  return { data, isLoading, error };
}
