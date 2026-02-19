"use client";

import { useEffect, useMemo, useState } from "react";
import { useAssets } from "./useAssets";

export function usePriceSymbolMap(bases: readonly string[]) {
  const [symbolsSet, setSymbolsSet] = useState<Set<string>>(new Set());
  const { assets } = useAssets(); // SWR under the hood

  useEffect(() => {
    if (!assets?.length) return;
    setSymbolsSet(new Set(assets.map((a) => a.symbol)));
  }, [assets]);

  return useMemo(() => {
    const map: Record<string, string> = {};

    for (const base of bases) {
      // skip for USDT
      if (base === "USDT") {
        map[base] = `${base}USD`;
        continue;
      }

      const usdtPair = `${base}USDT`;
      // check
      if (symbolsSet.has(usdtPair)) {
        map[base] = usdtPair;
        continue;
      }

      if (symbolsSet.has(base)) {
        map[base] = base;
      }
    }

    return map;
  }, [bases, symbolsSet]);
}
