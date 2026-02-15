import useSWR from "swr";
import { apiJson } from "@/api/http";
import type { TradingCategory, TradingPnL } from "@/features/trading/types";

export function usePnLHistory(params: {
  category: TradingCategory;
  symbol: string;
  limit?: number;
}) {
  const { data, error, isLoading } = useSWR(
    `history:pnl:${params.category}:${params.symbol}:${params.limit ?? ""}`,
    async () => {
      const body = await apiJson<{ pnl: TradingPnL[] }>("/user/history/pnl", {
        query: {
          category: params.category,
          symbol: params.symbol,
          limit: params.limit,
        },
      });
      return body.pnl;
    },
  );

  return { data, isLoading, error };
}
