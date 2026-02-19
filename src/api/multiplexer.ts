import type { Candle } from "@/features/assets/types";
import { requestJson } from "@/api/http";

export async function getPrice(symbol: string): Promise<number | null> {
  const { res, body } = await requestJson<number>(
    `/proxy/multiplexer/prices?symbol=${symbol}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) return null;
  return typeof body === "number" ? body : null;
}

export async function getLastCandle(params: {
  symbol: string;
  interval: number;
}): Promise<Candle | null> {
  const { res, body } = await requestJson<Candle>(
    `/proxy/multiplexer/candles/last?symbol=${params.symbol}&interval=${params.interval}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) return null;
  return body ?? null;
}

export async function getCandles(params: {
  symbol: string;
  interval: number;
  outputsize: number;
  before?: number;
}): Promise<Candle[]> {
  const search = new URLSearchParams({
    symbol: params.symbol,
    interval: String(params.interval),
    outputsize: String(params.outputsize),
  });
  if (typeof params.before === "number") {
    search.set("before", String(params.before));
  }
  const { res, body } = await requestJson<Candle[]>(
    `/proxy/multiplexer/candles?${search.toString()}`,
    { method: "GET", credentials: "include" },
  );
  if (!res.ok) return [];
  return Array.isArray(body) ? body : [];
}
