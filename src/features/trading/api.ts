import { apiFetch } from "@/api/http";
import type { TradingInstrument } from "@/features/trading/types";

type ApiInstrument = {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  pricePrec: number;
  qtyPrec: number;
  minQty: string;
  maxQty: string;
  minPrice: string;
  maxPrice: string;
  tickSize: string;
  lotSize: string;
};

function mapInstrument(inst: ApiInstrument): TradingInstrument {
  return {
    symbol: inst.symbol,
    base: inst.baseAsset,
    quote: inst.quoteAsset,
    pricePrecision: inst.pricePrec,
    quantityPrecision: inst.qtyPrec,
    tickSize: inst.tickSize,
    stepSize: inst.lotSize,
    minQty: inst.minQty,
    minNotional: inst.minPrice,
  };
}

export async function fetchInstrument(
  symbol: string,
): Promise<TradingInstrument | null> {
  const res = await apiFetch("/instruments", {
    query: { symbol },
  });
  if (!res.ok) return null;
  const body = (await res.json()) as { instruments?: ApiInstrument[] };
  const inst = body.instruments?.[0];
  return inst ? mapInstrument(inst) : null;
}

export async function fetchInstruments(): Promise<TradingInstrument[]> {
  const res = await apiFetch("/instruments");
  if (!res.ok) return [];
  const body = (await res.json()) as { instruments?: ApiInstrument[] };
  return (body.instruments ?? []).map(mapInstrument);
}
