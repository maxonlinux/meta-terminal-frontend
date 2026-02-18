"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import { wsBaseFromWindow, wsUrl } from "@/lib/ws";

type BybitLevel = [price: string, size: string];

type SnapshotMsg = {
  event: "orderbook.snapshot";
  data: {
    s: string;
    b: BybitLevel[];
    a: BybitLevel[];
    ts: number;
    u: number;
    seq: number;
    cts?: number;
  };
};

type DeltaMsg = {
  event: "orderbook.delta";
  data: {
    s: string;
    b: BybitLevel[];
    a: BybitLevel[];
    ts: number;
    u: number;
    seq: number;
    cts?: number;
  };
};

type Envelope = { event: string; data: unknown; ts?: number };

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

function isEnvelope(v: unknown): v is Envelope {
  return isObj(v) && typeof v.event === "string" && "data" in v;
}

function buildSideMap(levels: BybitLevel[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const [price, qty] of levels) map.set(price, qty);
  return map;
}

function applyDeltaSide(prev: Map<string, string>, updates: BybitLevel[]) {
  const next = new Map(prev);
  for (const [price, qty] of updates) {
    if (qty === "0") next.delete(price);
    else next.set(price, qty);
  }
  return next;
}

function parseEnvelopeFromEventData(eventData: unknown): Envelope | null {
  if (eventData === "pong") return null;
  if (typeof eventData !== "string") return null;

  try {
    const parsed = JSON.parse(eventData) as unknown;
    return isEnvelope(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function nextOrderbookStateFromEnvelope(params: {
  envelope: Envelope;
  prevBids: Map<string, string> | null;
  prevAsks: Map<string, string> | null;
  prevSeq: number;
}): {
  bids: Map<string, string>;
  asks: Map<string, string>;
  seq: number;
} | null {
  if (params.envelope.event === "orderbook.snapshot") {
    const msg = params.envelope as SnapshotMsg;
    return {
      bids: buildSideMap(msg.data.b),
      asks: buildSideMap(msg.data.a),
      seq: msg.data.seq,
    };
  }

  if (params.envelope.event === "orderbook.delta") {
    const msg = params.envelope as DeltaMsg;
    const prevBids = params.prevBids;
    const prevAsks = params.prevAsks;
    if (!(prevBids && prevAsks)) return null;
    if (msg.data.seq <= params.prevSeq) return null;
    return {
      bids: applyDeltaSide(prevBids, msg.data.b),
      asks: applyDeltaSide(prevAsks, msg.data.a),
      seq: msg.data.seq,
    };
  }

  return null;
}

export function useOrderbook(params: {
  category: string;
  symbol: string;
  depth: number;
}) {
  const wsBase = wsBaseFromWindow();
  const url =
    wsUrl({ base: wsBase, path: "/proxy/main/ws/market" });

  const [bidsMap, setBidsMap] = useState<Map<string, string> | null>(null);
  const [asksMap, setAsksMap] = useState<Map<string, string> | null>(null);
  const [seq, setSeq] = useState(0);

  const bidsRef = useRef<Map<string, string> | null>(null);
  const asksRef = useRef<Map<string, string> | null>(null);
  const seqRef = useRef(0);

  const { sendJsonMessage } = useWebSocket(url, {
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
    onMessage: (event) => {
      const envelope = parseEnvelopeFromEventData(event.data);
      if (!envelope) return;

      const next = nextOrderbookStateFromEnvelope({
        envelope,
        prevBids: bidsRef.current,
        prevAsks: asksRef.current,
        prevSeq: seqRef.current,
      });
      if (!next) return;

      bidsRef.current = next.bids;
      asksRef.current = next.asks;
      seqRef.current = next.seq;
      setBidsMap(next.bids);
      setAsksMap(next.asks);
      setSeq(next.seq);
    },
  });

  useEffect(() => {
    if (!url) return;
    const topic = `orderbook:${params.category}:${params.symbol}`;
    sendJsonMessage({ op: "subscribe", topic, depth: params.depth });
    return () => {
      sendJsonMessage({ op: "unsubscribe", topic });
    };
  }, [params.category, params.symbol, params.depth, sendJsonMessage, url]);

  const bids = useMemo(() => {
    if (!bidsMap) return null;
    const items = Array.from(bidsMap.entries()).map(([price, qty]) => ({
      price,
      qty,
    }));
    items.sort((a, b) => Number(b.price) - Number(a.price));
    return items.slice(0, params.depth);
  }, [bidsMap, params.depth]);

  const asks = useMemo(() => {
    if (!asksMap) return null;
    const items = Array.from(asksMap.entries()).map(([price, qty]) => ({
      price,
      qty,
    }));
    items.sort((a, b) => Number(a.price) - Number(b.price));
    return items.slice(0, params.depth);
  }, [asksMap, params.depth]);

  const derivedBestBid = bids?.[0]?.price ?? null;
  const derivedBestAsk = asks?.[0]?.price ?? null;

  return {
    bids,
    asks,
    bestBid: derivedBestBid,
    bestAsk: derivedBestAsk,
    seq,
  };
}
