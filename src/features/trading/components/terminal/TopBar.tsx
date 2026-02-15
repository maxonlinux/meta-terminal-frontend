"use client";

import { BanknoteArrowUp, IndentDecrease, IndentIncrease } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AssetImage from "@/components/common/AssetImage";
import { Skeleton } from "@/components/common/Skeleton";
import { useAsset } from "@/features/assets/hooks/useAsset";
import type { AssetData, Candle } from "@/features/assets/types";
import { useRealTimeCandle } from "@/features/trading/hooks/useRealTimeCandle";
import type { TradingInstrument } from "@/features/trading/types";
import { formatNumber } from "@/utils/format";
import { cls, withLeadingPlus } from "@/utils/general.utils";
import AssetPicker from "./AssetPicker";
import RecentAssets from "./RecentAssets";

const AssetInfoSkeleton = () => (
  <>
    <div
      className={cls(
        "grid grid-cols-[auto_auto] gap-x-2 leading-none",
        "max-xs:grid-cols-1",
      )}
    >
      <div className={cls("row-span-2 my-auto", "max-xs:hidden")}>
        <Skeleton className="rounded-full size-7" />
      </div>
      <Skeleton className="rounded-xs w-20 h-3" />
      <Skeleton className="rounded-xs w-20 h-3" />
    </div>
    <div className="grid grid-rows-2 leading-none">
      <Skeleton className="rounded-xs w-20 h-3" />
      <Skeleton className="rounded-xs w-20 h-3" />
    </div>
  </>
);

const AssetInfo = ({
  asset,
  candle,
  pricePrecision,
}: {
  asset: AssetData;
  candle: Candle;
  pricePrecision: number;
}) => {
  if (!candle) return <AssetInfoSkeleton />;

  const price = candle.close;

  const change = candle.close - candle.open;
  const changePercentage = (change / candle.open) * 100;

  return (
    <>
      <div
        className={cls(
          "grid grid-cols-[auto_auto] gap-x-2 leading-none",
          "max-xs:grid-cols-1",
        )}
      >
        <div className={cls("row-span-2 my-auto", "max-xs:hidden")}>
          <AssetImage
            symbol={asset.symbol}
            imageUrl={asset.image_url}
            size={28}
          />
        </div>
        <span className="font-bold">{asset.symbol}</span>
        <span className="text-xs opacity-50 max-sm:truncate max-sm:max-w-28">
          {asset.description}
        </span>
      </div>
      <div className="grid grid-rows-2 leading-none">
        <span className="font-bold">
          {formatNumber(price, { maxDecimals: pricePrecision })} USD
        </span>
        <span
          className={cls(
            "text-xs",
            change >= 0 ? "text-green-400" : "text-red-400",
          )}
        >
          {formatNumber(+withLeadingPlus(change), {
            maxDecimals: pricePrecision,
          })}{" "}
          ({(+withLeadingPlus(changePercentage)).toFixed(2)}%)
        </span>
      </div>
    </>
  );
};

export default function TopBar({
  instrument,
}: {
  instrument: TradingInstrument;
}) {
  const [isRecentsOpen, setIsRecentsOpen] = useState(false);

  const { candle } = useRealTimeCandle(instrument.symbol, 86400); // 24h candle
  const { asset } = useAsset(instrument.symbol);

  return (
    <div className="relative flex bg-secondary-background">
      <div className="flex divide-x divide-white/10 text-sm [&>div]:p-2 whitespace-nowrap">
        <AssetPicker />
        {!candle || !asset ? (
          <AssetInfoSkeleton />
        ) : (
          <AssetInfo
            asset={asset}
            candle={candle}
            pricePrecision={instrument.pricePrecision}
          />
        )}
      </div>

      <div
        className={cls(
          "min-w-0 flex divide-x divide-white/10",
          "md:w-full",
          "max-md:absolute max-md:h-full max-md:z-10 max-md:right-0 max-md:justify-end",
          { "max-md:left-0": isRecentsOpen },
        )}
      >
        <div
          className={cls(
            "h-full flex min-w-0 px-2 bg-secondary-background w-full",
            "max-md:justify-end",
            {
              "max-md:hidden": !isRecentsOpen,
            },
          )}
        >
          <RecentAssets />
        </div>
        <div className="flex gap-2 p-2">
          <button
            type="button"
            className={cls(
              "flex items-center justify-center cursor-pointer",
              "md:hidden",
            )}
            onClick={() => {
              setIsRecentsOpen((prev) => !prev);
            }}
          >
            {isRecentsOpen ? (
              <IndentIncrease size={16} strokeWidth={1} />
            ) : (
              <IndentDecrease size={16} strokeWidth={1} />
            )}
          </button>
          <Link
            href="/assets?modal=deposit"
            className="flex h-full p-2 items-center gap-2 text-left text-xs rounded-xs bg-neutral-900 font-bold text-amber-500 cursor-pointer"
          >
            <BanknoteArrowUp size={16} />
            <span className="max-md:hidden">DEPOSIT</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
