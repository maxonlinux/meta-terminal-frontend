import useSWR from "swr";
import type { TradingPosition } from "@/features/trading/types";

export function usePosition(params: { symbol: string; enabled: boolean }) {
  const { data, error, mutate, isLoading } = useSWR(
    params.enabled ? `positions:${params.symbol}` : null,
    async () => {
      const res = await fetch("/proxy/main/api/v1/user/positions", {
        method: "GET",
        credentials: "include",
      });
      const body = (await res.json()) as { positions: TradingPosition[] };
      return body.positions.find((pos) => pos.symbol === params.symbol) ?? null;
    },
  );

  return { position: data ?? null, revalidate: mutate, isLoading, error };
}
