"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { type Dispatch, type SetStateAction, useMemo } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogTrigger,
  Popover,
} from "react-aria-components";
import type { UserBalance } from "@/features/user/types";
import { cls } from "@/utils/general.utils";
import { AssetRow } from "./AssetRow";

function bybitSort(
  a: UserBalance,
  b: UserBalance,
  prices: Record<string, number>,
) {
  if (a.currency === "USDT" && b.currency !== "USDT") return -1;
  if (b.currency === "USDT" && a.currency !== "USDT") return 1;

  const pa = a.currency === "USDT" ? 1 : (prices[a.currency] ?? 0);
  const pb = b.currency === "USDT" ? 1 : (prices[b.currency] ?? 0);
  const ea = Number(a.free) * pa;
  const eb = Number(b.free) * pb;

  if (ea !== eb) return eb - ea;
  return a.currency.localeCompare(b.currency);
}

const Rows = (props: {
  rows: UserBalance[];
  onPriceUpdate: Dispatch<SetStateAction<Record<string, number>>>;
  onPnlUpdate: Dispatch<SetStateAction<Record<string, number>>>;
  priceSymbolByBase: Record<string, string | null>;
}) => {
  return props.rows.map((b) => {
    const symbol = props.priceSymbolByBase[b.currency];

    if (!symbol) return null;

    return (
      <AssetRow
        key={b.currency}
        balance={b}
        onPriceUpdate={props.onPriceUpdate}
        onPnlUpdate={props.onPnlUpdate}
        symbol={symbol}
      />
    );
  });
};

export function AssetsTable(props: {
  balances: UserBalance[];
  prices: Record<string, number>;
  priceSymbolByBase: Record<string, string>;
  onPriceUpdate: Dispatch<SetStateAction<Record<string, number>>>;
  unrealizedPnls: Record<string, number>;
  onPnlUpdate: Dispatch<SetStateAction<Record<string, number>>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  hideZeroBalances: boolean;
  setHideZeroBalances: Dispatch<SetStateAction<boolean>>;
}) {
  const rows = useMemo(() => {
    const out = [...props.balances];
    out.sort((a, b) => bybitSort(a, b, props.prices));
    return out;
  }, [props.balances, props.prices]);

  return (
    <div className="rounded-xs border border-border bg-secondary-background">
      <div className="flex items-center justify-between gap-3 px-4 pt-4">
        <div className="text-lg font-semibold">Assets</div>
        <div className="flex items-center gap-2">
          <DialogTrigger>
            <Button
              className="p-2 rounded-sm border border-white/10 text-white/70 hover:text-white hover:border-white/20 cursor-pointer"
              aria-label="Assets settings"
            >
              <SlidersHorizontal size={16} />
            </Button>
            <Popover
              offset={10}
              placement="bottom end"
              className="m-0 outline-hidden"
            >
              <Dialog className="w-65 rounded-sm border border-white/10 bg-neutral-950 shadow-lg p-3">
                <div className="text-sm font-semibold text-white/90">
                  Assets settings
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  <Checkbox
                    isSelected={props.hideZeroBalances}
                    onChange={props.setHideZeroBalances}
                    className="flex items-center gap-2 text-xs text-white/70 cursor-pointer select-none"
                  >
                    {({ isSelected }) => (
                      <>
                        <div
                          className={cls(
                            "size-4 rounded-xs border border-white/20 bg-black/20 flex items-center justify-center",
                            { "border-accent bg-accent/20": isSelected },
                          )}
                        >
                          <div
                            className={cls("size-2 rounded-xs bg-accent", {
                              hidden: !isSelected,
                            })}
                          />
                        </div>
                        Hide Zero Balances
                      </>
                    )}
                  </Checkbox>
                  <div className="text-xxs text-white/50 leading-snug">
                    Asset classes (crypto/stocks/indices) will be enabled once
                    backend provides per-asset metadata.
                  </div>
                </div>
              </Dialog>
            </Popover>
          </DialogTrigger>
        </div>
      </div>

      <div className="px-4 pt-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            size={16}
          />
          <input
            value={props.search}
            onChange={(e) => props.setSearch(e.target.value)}
            placeholder="Search"
            className={cls(
              "w-full h-10 rounded-sm bg-black/20 border border-white/10 pl-9 pr-3 text-sm text-white outline-hidden",
              "focus:border-white/20",
            )}
          />
        </div>

        <Checkbox
          isSelected={props.hideZeroBalances}
          onChange={props.setHideZeroBalances}
          className="mt-3 flex items-center gap-2 text-xs text-white/70 cursor-pointer select-none"
        >
          {({ isSelected }) => (
            <>
              <div
                className={cls(
                  "size-4 rounded-xs border border-white/20 bg-black/20 flex items-center justify-center",
                  { "border-accent bg-accent/20": isSelected },
                )}
              >
                <div
                  className={cls("size-2 rounded-xs bg-accent", {
                    hidden: !isSelected,
                  })}
                />
              </div>
              Hide Zero Balances
            </>
          )}
        </Checkbox>
      </div>

      <div className="mt-3 overflow-auto">
        <table className="w-full text-xs">
          <thead className="border-y border-white/10 bg-black/10">
            <tr className="[&>th]:font-semibold [&>th]:py-3 text-xs text-white/50">
              <th className="pl-4 pr-1 text-left">Currency</th>
              <th className="px-1 text-right">Equity</th>
              <th className="px-1 text-right @max-sm:hidden">Free / Locked</th>
              <th className="pl-1 pr-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 [&>tr>td]:py-3">
            {rows.length ? (
              <Rows
                rows={rows}
                onPriceUpdate={props.onPriceUpdate}
                onPnlUpdate={props.onPnlUpdate}
                priceSymbolByBase={props.priceSymbolByBase}
              />
            ) : (
              <tr>
                <td colSpan={100} className="py-10 text-center text-white/50">
                  Nothing to show
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
