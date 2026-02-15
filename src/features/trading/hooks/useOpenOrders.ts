import useSWR from "swr";
import { apiJson } from "@/api/http";
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
    const body = await apiJson<{ orders: TradingOpenOrder[] }>("/user/orders", {
      query: { category: params.category, symbol: params.symbol },
    });
    return body.orders.filter((order) => OPEN_STATUSES.has(order.status));
  });

  return { orders: data, isLoading, error, key };
}
