import { useEffect } from "react";
import useWebSocket from "react-use-websocket";
import useSWR, { mutate as swrMutate } from "swr";
import { multiplexer } from "@/api/client";
import type { Candle } from "@/features/assets/types";
import { useWebsocketBaseUrl } from "@/features/trading/hooks/useWebsocketBaseUrl";
import { useWsReconnectStatusStore } from "@/stores/useWsReconnectStatusStore";

type CandleMessage = Candle & { symbol: string; interval: number };

const RT_KEY = (symbol: string, interval: number) =>
  `rt-candle:${symbol}:${interval}`;

// globals (module-scoped)
const refCounts = new Map<string, number>(); // "BTC/USD:60" -> count
const lastTimeByKey = new Map<string, number>(); // monotonic guard per key

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const isCandleMessage = (msg: unknown): msg is CandleMessage =>
  isObj(msg) &&
  typeof msg.symbol === "string" &&
  typeof msg.interval === "number" &&
  typeof msg.open === "number" &&
  typeof msg.high === "number" &&
  typeof msg.low === "number" &&
  typeof msg.close === "number" &&
  typeof msg.time === "number";

function advance(rtKey: string, next: Candle) {
  void swrMutate(
    rtKey,
    (prev?: Candle | null) => {
      if (!prev) return next;
      const prevT = Number(prev.time);
      const nextT = Number(next.time);
      // only move forward; overwrite same-time (OHLC update)
      if (nextT > prevT) return next;
      if (nextT === prevT) return next;
      return prev;
    },
    false, // no revalidate
  );
}

export function useRealTimeCandle(symbol: string, interval: number) {
  const { setExceeded } = useWsReconnectStatusStore();
  const websocketBaseUrl = useWebsocketBaseUrl();
  const multiplexerWsBase = websocketBaseUrl;

  const key = `${symbol}:${interval}`;
  const rtKey = RT_KEY(symbol, interval);

  // 1) global realtime cache read
  const { data: live } = useSWR<Candle>(rtKey, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
  });

  // 2) initial fallback
  const { data: last } = useSWR(
    `candles:last:${symbol}:${interval}`,
    async () => {
      const res = await multiplexer["/candles/last"].get({
        query: { symbol, interval },
      });
      const body = await res.json();
      if (body && "error" in body) return null;
      return body;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
    },
  );

  // prime realtime cache from fallback once (only if newer)
  useEffect(() => {
    if (!last) return;
    const prevTime = lastTimeByKey.get(key) ?? -Infinity;
    if (Number(last.time) >= prevTime) {
      lastTimeByKey.set(key, Number(last.time));
      advance(rtKey, last);
    }
  }, [key, rtKey, last]);

  const { sendJsonMessage } = useWebSocket(
    multiplexerWsBase
      ? `${multiplexerWsBase}/proxy/multiplexer/ws/candles`
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
      filter: (event) => {
        try {
          const msg = JSON.parse(event.data);
          return (
            isCandleMessage(msg) &&
            msg.symbol === symbol &&
            msg.interval === interval
          );
        } catch {
          return false;
        }
      },

      onMessage: (event) => {
        try {
          if (event.data === "pong") return;
          const msg = JSON.parse(event.data);
          if (!isCandleMessage(msg)) return;

          const msgKey = `${msg.symbol}:${msg.interval}`;
          const rtMsgKey = RT_KEY(msg.symbol, msg.interval);

          const t = Number(msg.time);
          const prevT = lastTimeByKey.get(msgKey) ?? -Infinity;
          if (t < prevT) return;
          lastTimeByKey.set(msgKey, t);

          advance(rtMsgKey, msg);
        } catch {
          // ignore invalid payloads
        }
      },
    },
  );

  // 3) refcounted subscribe/unsubscribe for this key (no API changes)
  useEffect(() => {
    if (!multiplexerWsBase) return;
    const c = refCounts.get(key) ?? 0;
    refCounts.set(key, c + 1);
    if (c === 0) sendJsonMessage({ action: "subscribe", assets: [key] });

    return () => {
      const cur = (refCounts.get(key) ?? 1) - 1;
      if (cur <= 0) {
        refCounts.delete(key);
        sendJsonMessage({ action: "unsubscribe", assets: [key] });
      } else {
        refCounts.set(key, cur);
      }
    };
  }, [key, multiplexerWsBase, sendJsonMessage]);

  // live wins; fallback if not yet live
  return { candle: live ?? last };
}
