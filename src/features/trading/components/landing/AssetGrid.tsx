"use client";

import { Brackets } from "lucide-react";
import {
  Heading,
  ListBox,
  ListBoxItem,
  ListLayout,
  Virtualizer,
} from "react-aria-components";
import type { AssetData } from "@/features/assets/types";
import { AssetListItem } from "./AssetListItem";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-2 py-4 text-white/50">
    <Brackets className="size-3" />
    <span className="text-muted-foreground text-sm">No results</span>
  </div>
);

function AssetList({ type, assets }: { type: string; assets: AssetData[] }) {
  const filteredAssets = assets
    .filter((asset) => {
      const matchesType = asset.type === type;

      return matchesType;
    })
    .slice(0, 10);

  return (
    <div className="border border-border w-full rounded-md bg-secondary-background">
      <Heading className="p-2 border-b border-border">
        <span className="text-xs uppercase font-semibold">{type}</span>
      </Heading>
      <Virtualizer
        layout={ListLayout}
        layoutOptions={{
          rowHeight: 36,
          padding: 4,
          gap: 4,
        }}
      >
        <ListBox
          aria-label="Virtualized asset list"
          selectionMode="single"
          items={filteredAssets}
          className="flex flex-col text-white w-full"
          renderEmptyState={() => <EmptyState />}
        >
          {(item) => (
            <ListBoxItem
              style={{ width: "inherit" }}
              href={`/trade/SPOT/${item.symbol.replace("/", "_")}`}
              textValue={item.symbol}
              id={item.symbol}
            >
              <AssetListItem asset={item} className="hover:bg-neutral-800" />
            </ListBoxItem>
          )}
        </ListBox>
      </Virtualizer>
    </div>
  );
}

export function AssetGrid({ assets }: { assets: AssetData[] }) {
  const assetTypes = Array.from(
    new Set(assets.map((asset) => asset.type)),
  ).sort();

  return (
    <div className="grid grid-cols-2 gap-2 max-md:grid-cols-1 w-full">
      {assetTypes.map((type) => (
        <AssetList key={type} assets={assets} type={type} />
      ))}
    </div>
  );
}
