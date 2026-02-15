"use client";

import { useRealTimeEvents } from "@/features/trading/hooks/useRealTimeEvents";

export function Events() {
  useRealTimeEvents();
  return null;
}
