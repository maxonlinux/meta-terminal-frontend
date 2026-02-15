"use client";

import AssetBackground from "@/components/common/AssetBackground";
import { useAssets } from "@/features/assets/hooks/useAssets";

export default function AssetBackgroundWrapper() {
  const { assets } = useAssets();

  return (
    assets && (
      <div className="absolute opacity-30 -z-10 inset-0 overflow-hidden mask-y-from-50% mask-x-from-50%">
        <AssetBackground
          sizeMax={64}
          sizeMin={32}
          density={0.00005}
          assets={assets}
        />
      </div>
    )
  );
}
