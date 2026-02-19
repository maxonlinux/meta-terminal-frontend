import useSWR from "swr";
import { fetchAssets } from "@/api/assets";
import type { AssetData } from "@/features/assets/types";

export const useAssets = () => {
  const {
    data: assets,
    error,
    isLoading,
  } = useSWR<AssetData[]>("assets", fetchAssets);

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
