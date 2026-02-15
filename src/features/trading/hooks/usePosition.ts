import useSWR from "swr";
import { apiJson } from "@/api/http";
import type { TradingPosition } from "@/features/trading/types";

export function usePosition(params: { symbol: string; enabled: boolean }) {
  const { data, error, mutate, isLoading } = useSWR(
    params.enabled ? `positions:${params.symbol}` : null,
    async () => {
      const body = await apiJson<{ positions: TradingPosition[] }>(
        "/user/positions",
      );
      return body.positions.find((pos) => pos.symbol === params.symbol) ?? null;
    },
  );

  return { position: data ?? null, revalidate: mutate, isLoading, error };
}
