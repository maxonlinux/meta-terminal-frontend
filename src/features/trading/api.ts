import type { TradingInstrument } from "@/features/trading/types";

export async function fetchInstrument(
  symbol: string,
): Promise<TradingInstrument | null> {
  const res = await fetch(`/proxy/main/api/v1/instruments?symbol=${symbol}`, {
    credentials: "include",
  });
  if (!res.ok) return null;
  const body = (await res.json()) as { instruments?: TradingInstrument[] };
  return body.instruments?.[0] ?? null;
}

export async function fetchInstruments(): Promise<TradingInstrument[]> {
  const res = await fetch("/proxy/main/api/v1/instruments", {
    credentials: "include",
  });

  if (!res.ok) return [];
  const body = (await res.json()) as { instruments?: TradingInstrument[] };
  return body.instruments ?? [];
}
