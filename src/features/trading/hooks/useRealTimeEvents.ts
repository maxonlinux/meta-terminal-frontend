import { useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { wsBaseFromWindow, wsUrl } from "@/lib/ws";

type WsEnvelope = { event: string; data: unknown; ts?: number };

const lastBalanceToastAt = new Map<string, number>();
const BALANCE_TOAST_DEDUP_MS = 1500;

const TERMINAL_ORDER_STATUSES = new Set([
  "FILLED",
  "CANCELED",
  "PARTIALLY_FILLED_CANCELED",
  "DEACTIVATED",
]);

export function useRealTimeEvents() {
  const { mutate } = useSWRConfig();

  const wsBase = wsBaseFromWindow();
  const url =
    wsUrl({ base: wsBase, path: "/proxy/main/ws/events" }) ??
    wsUrl({ base: wsBase, path: "/ws/events" });

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
    const envelope = lastJsonMessage as WsEnvelope;
    if (typeof envelope.event !== "string") return;

    if (envelope.event === "orders") {
      // temporary debug
      console.log("[ws:orders]", envelope.data);
    }

    const invalidateEngineCaches = () => {
      mutate((key) =>
        typeof key === "string"
          ? key.startsWith("orders:") ||
            key.startsWith("history:") ||
            key.startsWith("positions:")
          : false,
      );
    };

    const handleBalance = (data: any) => {
      mutate("user:balances");
      mutate(`user:balance:${data.asset}`);
      const now = Date.now();
      const last = lastBalanceToastAt.get(data.asset) ?? 0;
      if (now - last > BALANCE_TOAST_DEDUP_MS) {
        toast.success(`Balance updated: ${data.asset}`);
        lastBalanceToastAt.set(data.asset, now);
      }
    };

    const handleOrders = (data: any) => {
      invalidateEngineCaches();
      let terminalCount = 0;
      for (const order of data.orders) {
        if (TERMINAL_ORDER_STATUSES.has(order.status)) terminalCount += 1;
      }
      if (terminalCount) toast.success(`Order updated (${terminalCount})`);
    };

    const handleLiquidation = (data: any) => {
      toast.error(`Liquidation: ${data.symbol} ${data.size} @ ${data.price}`);
    };

    switch (envelope.event) {
      case "balances":
        handleBalance(envelope.data as any);
        return;
      case "orders":
        handleOrders(envelope.data as any);
        return;
      case "liquidation":
        handleLiquidation(envelope.data as any);
        return;
      default:
        return;
    }
  }, [lastJsonMessage, mutate]);

  return null; // хук ничего не возвращает, просто слушает
}
