import { create } from "zustand";
import { persist } from "zustand/middleware";

type RecentAssetsStore = {
  recentAssetSymbols: string[];
  addRecentAsset: (symbol: string) => void;
  removeRecentAsset: (symbol: string) => void;
};

export const useRecentAssetsStore = create<RecentAssetsStore>()(
  persist(
    (set, get) => ({
      recentAssetSymbols: [],
      addRecentAsset: (symbol) => {
        const current = get().recentAssetSymbols;
        if (!current.includes(symbol)) {
          set({ recentAssetSymbols: [...current, symbol] });
        }
      },
      removeRecentAsset: (symbol) => {
        set({
          recentAssetSymbols: get().recentAssetSymbols.filter(
            (s) => s !== symbol,
          ),
        });
      },
    }),
    {
      name: "recentAssets", // key for localStorage
    },
  ),
);
