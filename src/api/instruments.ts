import type { TradingInstrument } from "@/features/trading/types";
import { requestJson } from "@/api/http";

export async function fetchInstrument(
  symbol: string,
): Promise<TradingInstrument | null> {
  const { res, body } = await requestJson<TradingInstrument[]>(
    `/proxy/main/api/v1/instruments?symbol=${symbol}`,
    {
      credentials: "include",
      method: "GET",
    },
  );
  if (!res.ok) return null;
  return Array.isArray(body) ? (body[0] ?? null) : null;
}

export async function fetchInstruments(): Promise<TradingInstrument[]> {
  const { res, body } = await requestJson<TradingInstrument[]>(
    "/proxy/main/api/v1/instruments",
    {
      credentials: "include",
      method: "GET",
    },
  );

  if (!res.ok) return [];
  return Array.isArray(body) ? body : [];
}
