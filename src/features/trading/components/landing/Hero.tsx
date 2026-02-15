"use client";

import { Brackets, Loader, Search } from "lucide-react";
import { useState } from "react";
import {
  ComboBox,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  SearchField,
} from "react-aria-components";
import useSWR from "swr";
import { useDebounceValue } from "usehooks-ts";
import AssetBackground from "@/components/common/AssetBackground";
import { useEnv } from "@/env/provider";
import { searchAssets } from "@/features/assets/api";
import type { AssetData } from "@/features/assets/types";
import { AssetListItem } from "./AssetListItem";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-2 py-4 text-white/50">
    <Brackets className="size-3" />
    <span className="text-muted-foreground text-sm">No results</span>
  </div>
);

export function Hero({ assets }: { assets: AssetData[] }) {
  const env = useEnv();

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounceValue(search, 500);

  const { data: searchedAssets = [], isValidating } = useSWR<AssetData[]>(
    debouncedSearch ? `assets:search:${debouncedSearch}` : null,
    async () => await searchAssets(debouncedSearch),
  );

  const isLoading = debouncedSearch !== search || isValidating;

  return (
    <div className="relative w-full max-w-495 mx-auto">
      <div className="relative">
        <div className="absolute -z-10 inset-0 overflow-hidden opacity-80 mask-y-from-50% mask-x-from-50%">
          <AssetBackground
            sizeMax={64}
            sizeMin={32}
            density={0.0002}
            assets={assets}
          />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col w-full px-8 py-40 mx-auto max-sm:px-4 max-md:py-20 max-md:items-center">
            <p className="text-7xl font-extrabold uppercase leading-none w-full mb-8 max-w-xl max-md:text-center max-md:text-5xl">
              Trading with{" "}
              <span className="inline-block p-1 px-3 bg-green-400 text-background">
                {env.SITE_NAME}
              </span>{" "}
              <br />
              made easy
            </p>

            <div className="max-md:mt-10">
              <ComboBox allowsEmptyCollection onInputChange={setSearch}>
                <Label className="inline-block text-xs text-gray-400 mb-2">
                  Start typing then select an asset from the dropdown list
                </Label>
                <SearchField
                  aria-label="Search assets"
                  className="relative flex items-center rounded-sm backdrop-blur-2xl bg-white/10 border border-white/10 max-w-sm mb-4"
                >
                  <Input
                    placeholder="Search asset"
                    aria-label="Asset search input"
                    className="w-full text-white p-2 pl-8 rounded-xs data-focused:ring data-focused:outline-none data-focused:ring-accent/50 placeholder:text-sm"
                  />
                  <Search
                    filter="contains"
                    className="absolute left-3 text-white/30 size-3"
                  />
                  {search && isLoading && (
                    <Loader className="absolute right-3 size-3 animate-spin" />
                  )}
                </SearchField>
                {search && !isLoading && (
                  <Popover className="w-(--trigger-width) bg-white/10 backdrop-blur-xl rounded-sm border border-white/10">
                    <ListBox
                      className="flex flex-col text-white w-full max-h-72 overflow-y-auto overflow-x-hidden"
                      aria-label="Virtualized asset list"
                      selectionMode="single"
                      items={searchedAssets}
                      renderEmptyState={() => <EmptyState />}
                    >
                      {(item) => (
                        <ListBoxItem
                          href={`/trade/SPOT/${item.symbol.replace("/", "_")}`}
                          textValue={item.symbol}
                          className="focus:bg-neutral-700"
                          id={item.symbol}
                        >
                          <AssetListItem asset={item} />
                        </ListBoxItem>
                      )}
                    </ListBox>
                  </Popover>
                )}
              </ComboBox>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
