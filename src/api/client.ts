import type { NormalizeOAS } from "fets";
import { createClient } from "fets";
import type coreOas from "./oas.core";
import type muxOas from "./oas.mux";

type FetchFn = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

const DEFAULT_TIMEOUT_MS = 15_000;

function makeFetchFn(params: { timeoutMs: number }): FetchFn {
  return async (input, init) => {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), params.timeoutMs);

    // если пришёл signal — объединим (минимально, без лишней магии)
    const upstream = init?.signal;
    if (upstream) {
      if (upstream.aborted) controller.abort();
      else
        upstream.addEventListener("abort", () => controller.abort(), {
          once: true,
        });
    }

    const method = init?.method?.toUpperCase();

    try {
      return await fetch(input, {
        ...init,
        method,
        signal: controller.signal,
        credentials: "include",
        cache: "no-store",
      });
    } finally {
      clearTimeout(t);
    }
  };
}

export const core = createClient<NormalizeOAS<typeof coreOas>>({
  endpoint: "/proxy/core",
  fetchFn: makeFetchFn({ timeoutMs: DEFAULT_TIMEOUT_MS }),
});

export const multiplexer = createClient<NormalizeOAS<typeof muxOas>>({
  endpoint: "/proxy/multiplexer",
  fetchFn: makeFetchFn({ timeoutMs: DEFAULT_TIMEOUT_MS }),
});
