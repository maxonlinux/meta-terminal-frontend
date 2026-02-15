import { useMemo } from "react";

/**
 * Returns the base WebSocket URL derived from the current window location.
 * Example: http://localhost → ws://localhost
 */
export function useWebsocketBaseUrl(): string | null {
  return useMemo(() => {
    if (typeof window === "undefined") return null;
    return window.location.origin.replace(/^http/, "ws");
  }, []);
}
