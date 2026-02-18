import useSWR from "swr";
import type {
  TradingCategory,
  TradingOpenOrder,
} from "@/features/trading/types";

const OPEN_STATUSES = new Set([
  "NEW",
  "PARTIALLY_FILLED",
  "UNTRIGGERED",
  "TRIGGERED",
]);

export function useOpenOrders(params: {
  category: TradingCategory;
  symbol: string;
}) {
  const key = `orders:${params.category}:${params.symbol}`;
  const { data, error, isLoading } = useSWR(key, async () => {
    const query = new URLSearchParams({
      category: params.category,
      symbol: params.symbol,
    }).toString();
    const res = await fetch(`/proxy/main/api/v1/user/orders?${query}`, {
      method: "GET",
      credentials: "include",
    });
    const body = (await res.json()) as { orders: TradingOpenOrder[] };
    return body.orders.filter((order) => OPEN_STATUSES.has(order.status));
  });

  return { orders: data, isLoading, error, key };
}
