"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Button } from "react-aria-components";
import { Skeleton } from "@/components/common/Skeleton";
import { WithSkeleton } from "@/components/common/WithSkeleton";
import { useRecentAssets } from "@/features/assets/hooks/useRecentAssets";
import { useHorizontalScroll } from "@/features/trading/hooks/useHorizontalScroll";
import { cls } from "@/utils/general.utils";

const encodeSymbol = (symbol: string) => symbol.replace("/", "_");
const decodeSymbol = (symbol: string) => symbol.replace("_", "/");
const RECENT_ASSET_SKELETON_KEYS = ["1", "2", "3", "4", "5"] as const;

const RecentAssetSkeleton = () => (
  <Skeleton className="h-8 w-18 rounded-full" />
);

const RecentAsset = ({
  symbol,
  isSelected,
  isLast,
  onClose,
}: {
  symbol: string;
  isSelected: boolean;
  isLast: boolean;
  onClose: () => void;
}) => (
  <div
    className={cls(
      "relative flex items-center gap-2 py-1 px-3 h-full rounded-full snap-start shrink-0",
      isSelected ? "bg-accent/30 text-accent" : "bg-neutral-900",
    )}
  >
    <Link
      href={`/trade/SPOT/${encodeSymbol(symbol)}`}
      className="text-sm font-semibold leading-none"
    >
      {symbol}
    </Link>
    {!isLast && (
      <Button
        aria-label="Remove recent asset"
        className={cls(
          "leading-none hover:text-white cursor-pointer",
          isSelected ? "text-accent/60" : "text-gray-600",
        )}
        onClick={onClose}
      >
        <X size={16} />
      </Button>
    )}
  </div>
);

export default function RecentAssets() {
  const {
    showLeftScrollButton,
    showRightScrollButton,
    scrollContainerRef,
    handleScrollClick,
  } = useHorizontalScroll();

  // Assets
  const { recentAssetSymbols, addRecentAsset, removeRecentAsset } =
    useRecentAssets();

  const { symbol } = useParams<{ symbol: string }>();

  const restoredSymbol = decodeSymbol(symbol);

  useEffect(() => {
    addRecentAsset(restoredSymbol);
  }, [restoredSymbol, addRecentAsset]);

  const isSelected = (symbol: string) => symbol === restoredSymbol;

  const orderedRecentAssets = useMemo(() => {
    if (!recentAssetSymbols) return;

    return [...recentAssetSymbols].sort((a, b) => {
      if (a === restoredSymbol) return -1;
      if (b === restoredSymbol) return 1;
      return 0;
    });
  }, [recentAssetSymbols, restoredSymbol]);

  return (
    <div className="relative flex min-w-0">
      {(showLeftScrollButton || showRightScrollButton) && (
        <button
          type="button"
          disabled={!showLeftScrollButton}
          className="h-full flex items-center disabled:opacity-10 pr-1 cursor-pointer"
          onClick={() => handleScrollClick(-1)}
        >
          <ChevronLeft size={16} />
        </button>
      )}
      <div
        className={cls(
          "flex min-w-0 items-center gap-2 overflow-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2",
          { "mask-l-from-95%": showLeftScrollButton },
          { "mask-r-from-95%": showRightScrollButton },
        )}
        ref={scrollContainerRef}
      >
        <WithSkeleton
          skeleton={RECENT_ASSET_SKELETON_KEYS.map((k) => (
            <RecentAssetSkeleton key={k} />
          ))}
          data={{ orderedRecentAssets }}
        >
          {({ orderedRecentAssets }) =>
            orderedRecentAssets.map((symbol) => (
              <RecentAsset
                key={symbol}
                symbol={symbol}
                isSelected={isSelected(symbol)}
                // isLast={orderedRecentAssets.length <= 1}
                // is delete allowed
                isLast={isSelected(symbol)}
                onClose={() => removeRecentAsset(symbol)}
              />
            ))
          }
        </WithSkeleton>
      </div>
      {(showLeftScrollButton || showRightScrollButton) && (
        <button
          type="button"
          disabled={!showRightScrollButton}
          className="items-center h-full flex disabled:opacity-10 pl-1 cursor-pointer"
          onClick={() => handleScrollClick(1)}
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
