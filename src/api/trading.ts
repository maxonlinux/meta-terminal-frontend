import type {
  TradingCategory,
  TradingFill,
  TradingHistoryOrder,
  TradingOpenOrder,
  TradingPnL,
  TradingPosition,
} from "@/features/trading/types";
import { requestJson } from "@/api/http";

export async function getOpenOrders(params: {
  category: TradingCategory;
  symbol: string;
}): Promise<TradingOpenOrder[]> {
  const query = new URLSearchParams({
    category: params.category,
    symbol: params.symbol,
  }).toString();
  const { res, body } = await requestJson<TradingOpenOrder[]>(
    `/proxy/main/api/v1/user/orders?${query}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) return [];
  return Array.isArray(body) ? body : [];
}

export async function getOrderHistory(params: {
  category: TradingCategory;
  symbol: string;
  limit?: number;
}): Promise<TradingHistoryOrder[]> {
  const query = new URLSearchParams({
    category: params.category,
    symbol: params.symbol,
    ...(params.limit ? { limit: String(params.limit) } : {}),
  }).toString();
  const { res, body } = await requestJson<TradingHistoryOrder[]>(
    `/proxy/main/api/v1/user/history/orders?${query}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) return [];
  return Array.isArray(body) ? body : [];
}

export async function getFills(params: {
  category: TradingCategory;
  symbol: string;
}): Promise<TradingFill[]> {
  const query = new URLSearchParams({
    category: params.category,
    symbol: params.symbol,
  }).toString();
  const { res, body } = await requestJson<TradingFill[]>(
    `/proxy/main/api/v1/user/history/fills?${query}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) return [];
  return Array.isArray(body) ? body : [];
}

export async function getPnLHistory(params: {
  category: TradingCategory;
  symbol: string;
  limit?: number;
}): Promise<TradingPnL[]> {
  const query = new URLSearchParams({
    category: params.category,
    symbol: params.symbol,
    ...(params.limit ? { limit: String(params.limit) } : {}),
  }).toString();
  const { res, body } = await requestJson<TradingPnL[]>(
    `/proxy/main/api/v1/user/history/pnl?${query}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) return [];
  return Array.isArray(body) ? body : [];
}

export async function getPositions(): Promise<TradingPosition[]> {
  const { res, body } = await requestJson<TradingPosition[]>(
    "/proxy/main/api/v1/user/positions",
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) return [];
  return Array.isArray(body) ? body : [];
}

export async function setLeverage(params: {
  symbol: string;
  leverage: number;
}) {
  return requestJson<{ message?: string }>(
    `/proxy/main/api/v1/user/positions/leverage?symbol=${params.symbol}`,
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leverage: params.leverage }),
    },
  );
}

export async function updatePositionTpSl(params: {
  symbol: string;
  tp: string;
  sl: string;
}) {
  return requestJson<{ message?: string }>(
    `/proxy/main/api/v1/user/positions?symbol=${params.symbol}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tp: params.tp, sl: params.sl }),
    },
  );
}

export async function createOrder(body: {
  symbol: string;
  category: TradingCategory;
  side: string;
  type: string;
  timeInForce: string;
  qty: string;
  price?: string;
  reduceOnly?: boolean;
  triggerPrice?: string;
  closeOnTrigger?: boolean;
  stopOrderType?: string;
}) {
  return requestJson<{ id: number }>("/proxy/main/api/v1/user/orders", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
