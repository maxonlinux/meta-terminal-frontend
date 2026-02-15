"use client";

import useSWR from "swr";
import { apiJson } from "@/api/http";
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
      const body = await apiJson<{ orders: TradingHistoryOrder[] }>(
        "/user/history/orders",
        {
          query: {
            category: params.category,
            symbol: params.symbol,
            limit: params.limit,
          },
        },
      );

      return body.orders;
    },
  );

  return { data, isLoading, error };
}
