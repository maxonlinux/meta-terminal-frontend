import { useEffect } from "react";
import useWebSocket from "react-use-websocket";
import useSWR, { mutate as swrMutate } from "swr";
import { multiplexer } from "@/api/client";
import { useWebsocketBaseUrl } from "@/features/trading/hooks/useWebsocketBaseUrl";
import { useWsReconnectStatusStore } from "@/stores/useWsReconnectStatusStore";

type PriceMessage = { symbol: string; price: number };

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const isPriceMessage = (msg: unknown): msg is PriceMessage =>
  isObj(msg) && typeof msg.symbol === "string" && typeof msg.price === "number";

// global helpers
const RT_KEY = (symbol: string) => `rt-price:${symbol}`;
const refCounts = new Map<string, number>(); // symbol -> subscriber count

function advancePrice(rtKey: string, next: number) {
  void swrMutate(
    rtKey,
    (prev?: number | null) => (prev === next ? prev : next),
    false, // don't revalidate
  );
}

export function useRealTimePrice(symbol: string) {
  const { setExceeded } = useWsReconnectStatusStore();
  const websocketBaseUrl = useWebsocketBaseUrl();
  const multiplexerWsBase = websocketBaseUrl;

  const rtKey = RT_KEY(symbol);

  // 1) Read the shared realtime value
  const { data: live } = useSWR<number>(rtKey, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
  });

  // 2) Fallback (initial REST)
  const { data: last } = useSWR(
    symbol ? `price:${symbol}` : null,
    async () => {
      const res = await multiplexer["/prices"].get({ query: { symbol } });
      if (!res.ok) return null;

      const body = await res.json();
      return body;
    },
    { revalidateOnFocus: false },
  );

  // Prime realtime cache from fallback once
  useEffect(() => {
    if (typeof last === "number") {
      advancePrice(rtKey, last);
    }
  }, [last, rtKey]);

  // 3) Shared socket; filter to this symbol; write into global cache
  const { sendJsonMessage } = useWebSocket(
    multiplexerWsBase
      ? `${multiplexerWsBase}/proxy/multiplexer/ws/prices`
      : null,
    {
      share: true,
      reconnectAttempts: 3,
      heartbeat: {
        message: "ping",
        returnMessage: "pong",
        timeout: 20_000,
        interval: 10_000,
      },
      shouldReconnect: () => true,
      onReconnectStop: () => setExceeded(),
      onMessage: (event) => {
        try {
          if (event.data === "pong") return;
          const msg = JSON.parse(event.data);
          if (!isPriceMessage(msg)) return;

          const rtMsgKey = RT_KEY(msg.symbol);
          advancePrice(rtMsgKey, msg.price);
        } catch (err) {
          // ignore malformed WS messages
          void err;
        }
      },
    },
  );

  // 4) Refcounted subscribe/unsubscribe so we only sub once per symbol
  useEffect(() => {
    if (!multiplexerWsBase) return;
    const c = refCounts.get(symbol) ?? 0;
    refCounts.set(symbol, c + 1);
    if (c === 0) sendJsonMessage({ action: "subscribe", assets: [symbol] });

    return () => {
      const cur = (refCounts.get(symbol) ?? 1) - 1;
      if (cur <= 0) {
        refCounts.delete(symbol);
        sendJsonMessage({ action: "unsubscribe", assets: [symbol] });
      } else {
        refCounts.set(symbol, cur);
      }
    };
  }, [symbol, multiplexerWsBase, sendJsonMessage]);

  // live wins; fallback if no live yet
  return { price: live ?? last ?? null };
}
