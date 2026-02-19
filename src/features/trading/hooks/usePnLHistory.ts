import useSWR from "swr";
import { getPnLHistory } from "@/api/trading";
import type { TradingCategory } from "@/features/trading/types";

export function usePnLHistory(params: {
  category: TradingCategory;
  symbol: string;
  limit?: number;
}) {
  const { data, error, isLoading } = useSWR(
    `history:pnl:${params.category}:${params.symbol}:${params.limit ?? ""}`,
    async () => await getPnLHistory(params),
  );

  return { data, isLoading, error };
}
