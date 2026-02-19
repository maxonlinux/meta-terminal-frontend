import {
  ChevronLeft,
  ChevronRight,
  ScrollText,
  Search,
  Star,
  TextSearch,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Input,
  ListBox,
  ListBoxItem,
  ListLayout,
  Popover,
  Radio,
  RadioGroup,
  SearchField,
  Virtualizer,
} from "react-aria-components";
import AssetImage from "@/components/common/AssetImage";
import { IconSkeleton } from "@/components/common/IconSkeleton";
import { Skeleton } from "@/components/common/Skeleton";
import { useAssets } from "@/features/assets/hooks/useAssets";
import type { AssetData } from "@/features/assets/types";
import { useHorizontalScroll } from "@/features/trading/hooks/useHorizontalScroll";
import { useInstrument } from "@/features/trading/hooks/useInstrument";
import { useRealTimeCandle } from "@/features/trading/hooks/useRealTimeCandle";
import Decimal from "decimal.js";
import { cls } from "@/utils/general.utils";

function getParamString(
  params: Readonly<Record<string, string | string[] | undefined>>,
  key: string,
) {
  const v = params[key];
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return "";
}

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-4 text-white/50">
      <ScrollText className="size-3" />
      <span className="text-muted-foreground text-sm">No results</span>
    </div>
  );
};

const ListItemSkeleton = () => (
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

const ListItem = ({ asset }: { asset: AssetData }) => {
  const { candle } = useRealTimeCandle(asset.symbol, 86400); // 24h
  const { instrument } = useInstrument({ symbol: asset.symbol });

  if (!(candle && instrument)) return <ListItemSkeleton />;

  const close = new Decimal(candle.close);
  const open = new Decimal(candle.open);
  const changePercentage = open.isZero()
    ? new Decimal(0)
    : close.minus(open).div(open).mul(100);
  const priceText = close
    .toDecimalPlaces(instrument.pricePrecision, Decimal.ROUND_DOWN)
    .toString();
  const changeText = `${changePercentage.gt(0) ? "+" : ""}${changePercentage
    .toDecimalPlaces(2, Decimal.ROUND_DOWN)
    .toString()}%`;

  return (
    <div className="group-data-focused:bg-neutral-700 group-hover:bg-neutral-700/50 relative flex items-center gap-2 w-full select-none px-1 py-2 rounded-xs">
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
          <Star className="text-accent/50 hover:text-accent" size={14} />
        </button>
      </div>
      <div className="flex items-center min-w-0">
        <div className="flex items-center justify-center shrink-0 rounded-full font-bold overflow-hidden bg-gray-400 bg-opacity-20">
          <AssetImage
            imageUrl={asset.image_url}
            symbol={asset.symbol}
            size={18}
          />
        </div>
        <div className="flex items-center text-left gap-1 ml-2 overflow-hidden">
          <span className="font-normal text-sm">{asset.symbol}</span>
          <span className="text-xs text-gray-500 truncate">
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

const DialogContent = ({ assets }: { assets: AssetData[] }) => {
  const params = useParams();
  const rawCategory = getParamString(params, "category");
  const category = rawCategory === "LINEAR" ? "LINEAR" : "SPOT";

  const {
    showLeftScrollButton,
    showRightScrollButton,
    scrollContainerRef,
    handleScrollClick,
  } = useHorizontalScroll();

  const assetTypes = Array.from(
    new Set(assets.map((asset) => asset.type)),
  ).sort();

  const [selectedType, setSelectedType] = useState<string>(assetTypes[0]);
  const [search, setSearch] = useState<string>("");

  const filteredAssets = assets.filter((asset) => {
    const matchesType = asset.type === selectedType;
    const matchesSearch =
      asset.symbol.toLowerCase().includes(search.toLowerCase()) ||
      asset.description.toLowerCase().includes(search.toLowerCase());

    return matchesType && matchesSearch;
  });

  return (
    <>
      <SearchField
        onChange={setSearch}
        aria-label="Search assets"
        className="relative flex items-center p-1 border-b border-white/10"
      >
        <Input
          aria-label="Asset search input"
          className="w-full text-white p-1 pl-7 rounded-xs data-focused:ring data-focused:outline-none data-focused:ring-accent/50"
        />
        <Search className="absolute left-3 text-white/30 size-3" />
      </SearchField>
      <div className="flex items-center border-b border-white/10">
        {(showLeftScrollButton || showRightScrollButton) && (
          <Button
            isDisabled={!showLeftScrollButton}
            className="h-full flex items-center disabled:opacity-10 px-1 cursor-pointer"
            onClick={() => handleScrollClick(-1)}
          >
            <ChevronLeft size={16} />
          </Button>
        )}

        <RadioGroup
          ref={scrollContainerRef}
          orientation="horizontal"
          className={cls(
            "flex gap-4 text-xs text-white/50 min-w-0 overflow-x-auto no-scrollbar",
            {
              "mask-l-from-90%": showLeftScrollButton,
              "mask-r-from-90%": showRightScrollButton,
            },
          )}
          aria-label="Asset type filter"
          onChange={setSelectedType}
          value={selectedType}
        >
          {assetTypes.map((type) => (
            <Radio
              value={type}
              key={type}
              className="cursor-pointer whitespace-nowrap font-semibold border-b border-transparent px-1 py-1.5 selected:border-b-2 selected:text-white selected:border-accent capitalize"
            >
              {type}
            </Radio>
          ))}
        </RadioGroup>

        {(showLeftScrollButton || showRightScrollButton) && (
          <Button
            isDisabled={!showRightScrollButton}
            className="items-center h-full flex disabled:opacity-10 px-1 cursor-pointer"
            onClick={() => handleScrollClick(1)}
          >
            <ChevronRight size={16} />
          </Button>
        )}
      </div>
      <Virtualizer
        layout={ListLayout}
        layoutOptions={{
          estimatedRowHeight: 36,
          padding: 4,
        }}
      >
        <ListBox
          aria-label="Virtualized asset list"
          selectionMode="single"
          items={filteredAssets}
          className="flex flex-col text-white max-h-96 overflow-y-auto"
          renderEmptyState={() => <EmptyState />}
        >
          {(item) => (
            <ListBoxItem
              href={`/trade/${category}/${item.symbol.replace("/", "_")}`}
              textValue={item.symbol}
              className="group"
              id={item.symbol}
            >
              <ListItem asset={item} />
            </ListBoxItem>
          )}
        </ListBox>
      </Virtualizer>
    </>
  );
};

const DialogSkeleton = () => (
  <>
    <div className="relative flex items-center p-1 border-b border-white/10">
      <Input disabled className="w-full text-white p-1 pl-7 rounded-xs" />
      <IconSkeleton
        icon={Search}
        className="absolute left-3 size-3 text-white/30"
      />
    </div>
    <div className="flex gap-1 border-b border-white/10 p-1">
      {["s1", "s2", "s3"].map((id) => (
        <Skeleton key={id} className="h-3 w-20 rounded-xs bg-white/30" />
      ))}
    </div>
    <div className="flex flex-col px-1">
      {["r1", "r2", "r3", "r4", "r5"].map((id) => (
        <ListItemSkeleton key={id} />
      ))}
    </div>
  </>
);

export default function AssetPicker() {
  const { assets } = useAssets();

  return (
    <DialogTrigger>
      <Button className="flex items-center justify-center w-12 cursor-pointer pressed:bg-neutral-900">
        <TextSearch />
      </Button>
      <Popover>
        <Dialog className="bg-neutral-900 rounded-xs border border-white/10 shadow-md shadow-black w-2xs xs:w-sm">
          {assets ? <DialogContent assets={assets} /> : <DialogSkeleton />}
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
