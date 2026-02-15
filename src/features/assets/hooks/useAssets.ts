import useSWR from "swr";
import { fetchAssets } from "@/features/assets/api";
import type { AssetData } from "@/features/assets/types";

export const useAssets = () => {
  const {
    data: assets,
    error,
    isLoading,
  } = useSWR<AssetData[] | null>("assets", async () => {
    const body = await fetchAssets();
    return body.length ? body : null;
  });

  const get = (symbol: string) => {
    if (!assets) return null;
    return assets.find((asset) => asset.symbol === symbol);
  };

  return {
    get,
    assets,
    isLoading,
    error,
  };
};
