import useSWR from "swr";
import { getPositions } from "@/api/trading";

export function usePosition(params: { symbol: string; enabled: boolean }) {
  const { data, error, mutate, isLoading } = useSWR(
    params.enabled ? `positions:${params.symbol}` : null,
    async () => {
      const positions = await getPositions();
      return positions.find((pos) => pos.symbol === params.symbol) ?? null;
    },
  );

  return { position: data ?? null, revalidate: mutate, isLoading, error };
}
