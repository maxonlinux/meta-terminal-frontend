"use client";

import useSWR from "swr";
import { fetchInstrument } from "@/features/trading/api";

export function useInstrument(params: { symbol: string }) {
  const { data, error, isLoading } = useSWR(
    `instruments:${params.symbol}`,
    async () => await fetchInstrument(params.symbol),
  );

  return { instrument: data ?? null, isLoading, error };
}
