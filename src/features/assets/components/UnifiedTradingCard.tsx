"use client";

import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  Eye,
  EyeOff,
  History,
  ScrollText,
} from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import Decimal from "decimal.js";
import { cls } from "@/utils/general.utils";

function DesktopActionButton(props: {
  label: string;
  tone: "primary" | "secondary";
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cls(
        "flex items-center gap-2 px-4 py-2 text-xs rounded-sm font-semibold cursor-pointer transition-colors",
        props.tone === "primary"
          ? "bg-accent text-white hover:brightness-110"
          : "border border-white/10 text-white/80 hover:text-white hover:border-white/20 hover:bg-white/5",
      )}
      onClick={props.onClick}
    >
      {props.icon}
      <span>{props.label}</span>
    </button>
  );
}

export function UnifiedTradingCard(props: {
  totalEquity: string;
  totalUpnl: string;
  onOpenTransactions: () => void;
}) {
  const [hideAmounts, setHideAmounts] = useState(false);
  const [, setModal] = useQueryState("modal");

  const equityText = new Decimal(props.totalEquity)
    .toDecimalPlaces(2, Decimal.ROUND_DOWN)
    .toString();
  const upnlText = new Decimal(props.totalUpnl)
    .toDecimalPlaces(2, Decimal.ROUND_DOWN)
    .toString();

  return (
    <div className="rounded-xs border border-border bg-secondary-background">
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-white/80">
            Unified Trading
          </h2>
          <button
            type="button"
            className="text-white/50 hover:text-white/80 cursor-pointer"
            onClick={() => setHideAmounts((v) => !v)}
            aria-label={hideAmounts ? "Show amounts" : "Hide amounts"}
          >
            {hideAmounts ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <DesktopActionButton
            tone="primary"
            label="Add Funds"
            icon={<BanknoteArrowUp size={16} />}
            onClick={() => void setModal("deposit")}
          />
          <DesktopActionButton
            tone="secondary"
            label="Withdraw"
            icon={<BanknoteArrowDown size={16} />}
            onClick={() => void setModal("withdrawal")}
          />
        </div>
      </div>

      <div className="px-4 pb-4 pt-3">
        <div className="text-white/50 text-xs">Total Equity</div>
        <div className="flex items-end gap-2">
          <div
            className={cls("text-4xl font-extrabold tracking-tight", {
              "blur-sm select-none": hideAmounts,
            })}
          >
            {equityText}
          </div>
          <div className="text-white/50 pb-1">USD</div>
        </div>

        <div className="mt-4 text-white/50 text-xs">
          Unrealized PnL of Perpetual and Futures
        </div>
        <div
          className={cls("text-lg font-semibold text-white/60", {
            "blur-sm select-none": hideAmounts,
          })}
        >
          {upnlText} USD
        </div>

        <div className="lg:hidden">
          <div className="mt-4 h-px bg-white/10" />

          <div className="mt-5 grid grid-cols-4 gap-3">
            <button
              type="button"
              className="group flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => void setModal("deposit")}
            >
              <div className="size-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10">
                <BanknoteArrowUp size={18} className="text-white/80" />
              </div>
              <div className="text-[11px] text-white/70 text-center leading-tight">
                Add Funds
              </div>
            </button>

            <button
              type="button"
              className="group flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => void setModal("withdrawal")}
            >
              <div className="size-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10">
                <BanknoteArrowDown size={18} className="text-white/80" />
              </div>
              <div className="text-[11px] text-white/70 text-center leading-tight">
                Withdraw
              </div>
            </button>

            <button
              type="button"
              className="group flex flex-col items-center gap-2 cursor-pointer"
              onClick={props.onOpenTransactions}
            >
              <div className="size-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10">
                <ScrollText size={18} className="text-white/80" />
              </div>
              <div className="text-[11px] text-white/70 text-center leading-tight">
                Transaction Log
              </div>
            </button>

            <button
              type="button"
              className="flex flex-col items-center gap-2 opacity-40 cursor-not-allowed"
              disabled
            >
              <div className="size-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <History size={18} className="text-white/80" />
              </div>
              <div className="text-[11px] text-white/70 text-center leading-tight">
                Exchange History
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
