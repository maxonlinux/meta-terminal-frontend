"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type {
  TradingCategory,
  TradingInstrument,
} from "@/features/trading/types";
import { cls } from "@/utils/general.utils";
import { MarginForm } from "./MarginForm";
import { SpotForm } from "./SpotForm";

const CATEGORIES: TradingCategory[] = ["SPOT", "LINEAR"];

const TradeForm = ({
  category,
  instrument,
}: {
  category: string;
  instrument: TradingInstrument;
}) => {
  if (category === "SPOT") {
    return <SpotForm instrument={instrument} />;
  }

  if (category === "LINEAR") {
    return <MarginForm instrument={instrument} />;
  }

  return null;
};

export function TradePanel({ instrument }: { instrument: TradingInstrument }) {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const category = segments[1];

  return (
    <div className="flex flex-col h-full divide-y divide-white/10 bg-secondary-background @container">
      <div className="flex justify-between items-center p-2">
        <span className="text-[12px] font-semibold">TRADE PANEL</span>

        <div className="ml-auto">
          <div className="flex gap-2 text-xs text-white/50">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/trade/${cat}/${instrument.symbol}`}
                className={cls(
                  "relative flex items-center justify-center cursor-pointer capitalize whitespace-nowrap",
                  { "font-semibold text-white": cat === category },
                )}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <TradeForm instrument={instrument} category={category} />
    </div>
  );
}
