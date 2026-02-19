import useSWR from "swr";
import { fetchAsset } from "@/api/assets";
import type { AssetData } from "@/features/assets/types";
import { useAssets } from "./useAssets";

export const useAsset = (symbol: string) => {
  const existingAsset = useAssets().get(symbol);

  const {
    data: asset,
    error,
    isLoading,
  } = useSWR<AssetData | null>(
    existingAsset ? null : `asset:${symbol}`,
    async () => fetchAsset(symbol),
  );

  if (existingAsset) {
    return {
      asset: existingAsset,
      isLoading: false,
      error: null,
    };
  }

  return {
    asset,
    isLoading,
    error,
  };
};
