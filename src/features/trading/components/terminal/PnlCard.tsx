"use client";

import AssetBackground from "@/components/common/AssetBackground";
import AssetImage from "@/components/common/AssetImage";
import { useAsset } from "@/features/assets/hooks/useAsset";

export const PnlCard = () => {
  const { asset } = useAsset("AAPL");

  return (
    <div className="fixed backdrop-blur-md flex items-center justify-center inset-0 z-50">
      <div className="relative overflow-hidden w-180 h-100 bg-secondary-background rounded-4xl border border-white/10">
        <div className="absolute left-0 top-0 blur-sm size-full">
          <AssetBackground assets={asset ? [asset] : []} density={0.0005} />
        </div>
        <div className="relative z-50 size-full p-8 bg-linear-to-r from-secondary-background from-25% to-transparent">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-black">TRADEMETA</div>
            <div className="text-2xl text-current/50">|</div>
            <div className="text-2xl text-current/50">LINEAR</div>
          </div>
          <div className="absolute right-0 bottom-0 m-8 max-sm:hidden">
            <AssetImage
              imageUrl={asset?.image_url}
              symbol={asset?.symbol ?? ""}
              size={256}
            />
          </div>
          <div className="flex items-center gap-4 mt-4">
            <span className="text-lg font-bold">{asset?.symbol}</span>
            <span className="rounded-full text-xs bg-green-400/20 text-green-400 px-2 py-0.5">
              LONG 50X
            </span>
          </div>
          <br />
          <span className="text-md text-current/50">ROI</span>
          <br />
          <span className="text-4xl text-green-400 font-bold">+42.63%</span>
          <div className="flex gap-4 mt-16">
            <div className="">
              <span>Entry Price</span>
              <br />
              <span className="text-xl font-bold">120.65</span>
            </div>
            <div className="">
              <span>Filled Price</span>
              <br />
              <span className="text-xl font-bold">132.31</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
