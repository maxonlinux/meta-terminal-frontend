import { useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { wsBaseFromWindow, wsUrl } from "@/lib/ws";

type WsEnvelope = { event: string; data: unknown; ts?: number };

type OrdersEvent = {
  orders: Array<{ orderId: number; status: string }>;
};

type BalancesEvent = {
  asset: string;
  available: string;
  locked: string;
  margin: string;
};

type LiquidationEvent = {
  symbol: string;
  stage: string;
  price: string;
  size: string;
};

const TERMINAL_ORDER_STATUSES = new Set([
  "FILLED",
  "CANCELED",
  "PARTIALLY_FILLED_CANCELED",
  "DEACTIVATED",
]);

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

function isWsEnvelope(v: unknown): v is WsEnvelope {
  return isObj(v) && typeof v.event === "string" && "data" in v;
}

function isBalancesEvent(data: unknown): data is BalancesEvent {
  return (
    isObj(data) &&
    typeof data.asset === "string" &&
    typeof data.available === "string" &&
    typeof data.locked === "string" &&
    typeof data.margin === "string"
  );
}

function isOrdersEvent(data: unknown): data is OrdersEvent {
  if (!isObj(data)) return false;
  if (!Array.isArray(data.orders)) return false;
  return data.orders.every(
    (order) =>
      isObj(order) &&
      typeof order.orderId === "number" &&
      typeof order.status === "string",
  );
}

function isLiquidationEvent(data: unknown): data is LiquidationEvent {
  return (
    isObj(data) &&
    typeof data.symbol === "string" &&
    typeof data.stage === "string" &&
    typeof data.price === "string" &&
    typeof data.size === "string"
  );
}

export function useRealTimeEvents() {
  const { mutate } = useSWRConfig();

  const wsBase = wsBaseFromWindow();
  const url =
    wsUrl({ base: wsBase, path: "/ws/events" }) ??
    wsUrl({ base: wsBase, path: "/proxy/main/api/v1/ws/events" });

  const { lastJsonMessage } = useWebSocket(url, {
    share: true,
    shouldReconnect: () => true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    heartbeat: {
      message: "ping",
      returnMessage: "pong",
      timeout: 20_000,
      interval: 10_000,
    },
  });

  useEffect(() => {
    if (!lastJsonMessage) return;
    if (!isWsEnvelope(lastJsonMessage)) return;

    const invalidateEngineCaches = () => {
      mutate((key) =>
        typeof key === "string"
          ? key.startsWith("orders:") ||
            key.startsWith("history:") ||
            key.startsWith("positions:")
          : false,
      );
    };

    const handleBalance = (data: unknown) => {
      if (!isBalancesEvent(data)) return;
      mutate("user:balances");
      mutate(`user:balance:${data.asset}`);
      toast.success(`Balance updated: ${data.asset}`);
    };

    const handleOrders = (data: unknown) => {
      if (!isOrdersEvent(data)) return;
      invalidateEngineCaches();
      let terminalCount = 0;
      for (const order of data.orders) {
        if (TERMINAL_ORDER_STATUSES.has(order.status)) terminalCount += 1;
      }
      if (terminalCount) toast.success(`Order updated (${terminalCount})`);
    };

    const handleLiquidation = (data: unknown) => {
      if (!isLiquidationEvent(data)) return;
      toast.error(`Liquidation: ${data.symbol} ${data.size} @ ${data.price}`);
    };

    switch (lastJsonMessage.event) {
      case "balances":
        handleBalance(lastJsonMessage.data);
        return;
      case "orders":
        handleOrders(lastJsonMessage.data);
        return;
      case "liquidation":
        handleLiquidation(lastJsonMessage.data);
        return;
      default:
        return;
    }
  }, [lastJsonMessage, mutate]);

  return null; // хук ничего не возвращает, просто слушает
}
