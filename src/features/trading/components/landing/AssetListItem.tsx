import Decimal from "decimal.js";
import { Star } from "lucide-react";
import AssetImage from "@/components/common/AssetImage";
import { IconSkeleton } from "@/components/common/IconSkeleton";
import { Skeleton } from "@/components/common/Skeleton";
import type { AssetData } from "@/features/assets/types";
import { useInstrument } from "@/features/trading/hooks/useInstrument";
import { useRealTimeCandle } from "@/features/trading/hooks/useRealTimeCandle";
import { formatDecimal } from "@/lib/decimal";
import { cls } from "@/utils/general.utils";

const AssetListItemSkeleton = () => (
  <div className="flex items-center gap-2 w-full select-none px-1 py-2 rounded-xs">
    <IconSkeleton icon={Star} className="size-3.5 text-white/30" />
    <Skeleton className="size-4.5 bg-white/30 rounded-full" />
    <div className="flex items-center gap-1">
      <Skeleton className="h-3 w-14 bg-white/30 rounded-xs" />
      <Skeleton className="h-3 w-24 bg-white/30 rounded-xs" />
    </div>
    <div className="flex gap-1 ml-auto">
      <Skeleton className="h-3 w-8 bg-white/30 rounded-xs" />
      <Skeleton className="h-3 w-8 bg-white/30 rounded-xs" />
    </div>
  </div>
);

export const AssetListItem = ({
  asset,
  className,
}: {
  asset: AssetData;
  className?: string;
}) => {
  const { candle } = useRealTimeCandle(asset.symbol, 86400); // 24h
  const { instrument } = useInstrument({ symbol: asset.symbol });

  if (!(candle && instrument)) return <AssetListItemSkeleton />;

  const close = new Decimal(candle.close);
  const open = new Decimal(candle.open);
  const changePercentage = open.isZero()
    ? new Decimal(0)
    : close.minus(open).div(open).mul(100);
  const priceText = formatDecimal(close, instrument.pricePrecision);
  const changeText = `${changePercentage.gt(0) ? "+" : ""}${formatDecimal(
    changePercentage,
    2,
  )}%`;

  return (
    <div
      className={cls(
        "relative flex items-center gap-2 w-full select-none px-1 py-2 rounded-xs",
        className,
      )}
    >
      <div className="flex justify-center items-center">
        <button
          type="button"
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          aria-label="Toggle favorite"
        >
          <Star className={cls("text-accent/50 hover:text-accent")} size={14} />
        </button>
      </div>
      <div className="flex items-center min-w-0">
        <div className="flex items-center justify-center shrink-0 rounded-full font-bold overflow-hidden bg-gray-400 bg-opacity-20">
          <AssetImage
            symbol={asset.symbol}
            imageUrl={asset.image_url}
            size={18}
          />
        </div>
        <div className="flex items-center text-left gap-1 ml-2 overflow-hidden">
          <span className="font-normal text-sm">{asset.symbol}</span>
          <span className={cls("text-xs truncate", "text-gray-500")}>
            {asset.description}
          </span>
        </div>
      </div>
      <div className="text-xs ml-auto whitespace-nowrap">
        <span>{priceText}</span>{" "}
        <span
          className={cls("inline-block min-w-16 text-end", {
            "text-green-400": changePercentage.gt(0),
            "text-red-400": changePercentage.lt(0),
            "text-neutral-400": changePercentage.isZero(),
          })}
        >
          {changeText}
        </span>
      </div>
    </div>
  );
};
