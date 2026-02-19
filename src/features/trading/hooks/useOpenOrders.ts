import useSWR from "swr";
import { getOpenOrders } from "@/api/trading";
import type { TradingCategory } from "@/features/trading/types";

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
    const orders = await getOpenOrders(params);
    return orders.filter((order) => OPEN_STATUSES.has(order.status));
  });

  return { orders: data, isLoading, error, key };
}
