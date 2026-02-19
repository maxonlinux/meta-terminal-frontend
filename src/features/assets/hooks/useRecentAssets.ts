"use client";

import { useEffect, useMemo } from "react";
import { useAssets } from "@/features/assets/hooks/useAssets";
import { useRecentAssetsStore } from "@/stores/useRecentAssetsStore";

export function useRecentAssets() {
  const { assets, isLoading } = useAssets();
  const { recentAssetSymbols, addRecentAsset, removeRecentAsset } =
    useRecentAssetsStore();

  useEffect(() => {
    if (!assets?.length) return;

    for (const symbol of recentAssetSymbols) {
      if (!assets.find((asset) => asset.symbol === symbol)) {
        removeRecentAsset(symbol);
      }
    }
  }, [assets, recentAssetSymbols, removeRecentAsset]);

  const validRecentAssetSymbols = useMemo(() => {
    if (!assets?.length) return undefined;
    const set = new Set(assets.map((a) => a.symbol));
    return recentAssetSymbols.filter((s) => set.has(s));
  }, [assets, recentAssetSymbols]);

  return {
    recentAssetSymbols: validRecentAssetSymbols,
    isLoading,
    addRecentAsset,
    removeRecentAsset,
  };
}
