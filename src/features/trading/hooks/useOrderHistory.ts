"use client";

import useSWR from "swr";
import type {
  TradingCategory,
  TradingHistoryOrder,
} from "@/features/trading/types";

export function useOrderHistory(params: {
  category: TradingCategory;
  symbol: string;
  limit?: number;
}) {
  const { data, error, isLoading } = useSWR(
    `history:orders:${params.category}:${params.symbol}:${params.limit ?? ""}`,
    async () => {
      const query = new URLSearchParams({
        category: params.category,
        symbol: params.symbol,
        ...(params.limit ? { limit: String(params.limit) } : {}),
      }).toString();
      const res = await fetch(
        `/proxy/main/api/v1/user/history/orders?${query}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      const body = (await res.json()) as { orders: TradingHistoryOrder[] };
      return body.orders;
    },
  );

  return { data, isLoading, error };
}
