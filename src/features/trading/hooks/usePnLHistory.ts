import useSWR from "swr";
import type { TradingCategory, TradingPnL } from "@/features/trading/types";

export function usePnLHistory(params: {
  category: TradingCategory;
  symbol: string;
  limit?: number;
}) {
  const { data, error, isLoading } = useSWR(
    `history:pnl:${params.category}:${params.symbol}:${params.limit ?? ""}`,
    async () => {
      const query = new URLSearchParams({
        category: params.category,
        symbol: params.symbol,
        ...(params.limit ? { limit: String(params.limit) } : {}),
      }).toString();
      const res = await fetch(`/proxy/main/api/v1/user/history/pnl?${query}`, {
        method: "GET",
        credentials: "include",
      });
      const body = (await res.json()) as { pnl: TradingPnL[] };
      return body.pnl;
    },
  );

  return { data, isLoading, error };
}
