import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/common/Skeleton";
import { fetchInstrument } from "@/features/trading/api";
import { CandlestickChart } from "@/features/trading/components/terminal/CandlestickChart";
import News from "@/features/trading/components/terminal/News";
import OrderBook from "@/features/trading/components/terminal/OrderBook";
import OrderTableTabs from "@/features/trading/components/terminal/OrderTabs/OrderTabs";
import TopBar from "@/features/trading/components/terminal/TopBar";
import { TradePanel } from "@/features/trading/components/terminal/TradePanel/TradePanel";

const SKELETON_COL_IDS = Array.from({ length: 5 }, (_, i) => `col-${i}`);
const SKELETON_ROWS_IDS = Array.from({ length: 24 }, (_, i) => `row-${i}`);

const TerminalSkeleton = () => (
  <main className="relative w-full px-2 mb-auto max-sm:px-2">
    <div
      className="w-full gap-1 max-w-495 mx-auto grid grid-cols-[1fr_2fr_1fr_1fr]
max-xl:grid-cols-[auto_1fr_1fr]
max-md:grid-cols-1
max-sm:grid-cols-1"
    >
      <div
        className="col-span-full rounded-xs
  max-md:row-start-1"
      >
        <div className="flex gap-1">
          <Skeleton className="w-1/12 h-12" />
          <Skeleton className="w-1/5 h-12" />
          <Skeleton className="w-1/5 h-12" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-1/5 h-12" />
        </div>
      </div>
      <div
        className="min-w-2xs
  max-lg:row-start-3
  max-md:row-start-5 max-md:min-h-80"
      >
        <div className="flex flex-col gap-1 h-full">
          {SKELETON_COL_IDS.map((id) => (
            <Skeleton key={id} className="w-full h-full" />
          ))}
        </div>
      </div>
      <div
        className="max-lg:col-span-2
  max-md:col-span-1 max-md:row-start-2"
      >
        <Skeleton className="w-full h-160 max-md:h-100" />
      </div>
      <div
        className="max-lg:row-start-3 max-lg:col-span-2
  max-md:col-span-1 max-md:row-start-4"
      >
        <div className="flex flex-col gap-1 h-full min-h-150">
          {SKELETON_ROWS_IDS.map((id) => (
            <Skeleton key={id} className="w-full h-full" />
          ))}
        </div>
      </div>
      <div
        className="rounded-xs
  max-md:row-start-3"
      >
        <Skeleton className="w-full h-full min-h-150" />
      </div>
      <div className="col-span-full">
        <div className="flex gap-1">
          {SKELETON_COL_IDS.map((id) => (
            <Skeleton key={id} className="w-full h-12" />
          ))}
        </div>
      </div>
    </div>
  </main>
);

export default async function TerminalView({
  symbol,
  category,
}: {
  symbol: string;
  category: string;
}) {
  const instrument = await fetchInstrument(symbol);
  if (!instrument) redirect("/trade");

  return (
    <Suspense fallback={<TerminalSkeleton />}>
      <div
        className="w-full gap-1 max-w-495 mx-auto grid grid-cols-[1fr_2fr_1fr_1fr]
      max-xl:grid-cols-[auto_1fr_1fr]
      max-md:grid-cols-1
      max-sm:grid-cols-1"
      >
        <div
          className="col-span-full border border-white/10 rounded-xs
        max-md:row-start-1"
        >
          <TopBar instrument={instrument} />
        </div>
        <div
          className="min-w-2xs
        max-xl:row-start-3
        max-md:row-start-5 max-md:min-h-80"
        >
          <News />
        </div>
        <div
          className="max-xl:col-span-2
        max-md:col-span-1 max-md:row-start-2"
        >
          <CandlestickChart instrument={instrument} category={category} />
        </div>
        <div
          className="max-xl:row-start-3 max-xl:col-span-2
        max-md:col-span-1 max-md:row-start-4"
        >
          <OrderBook instrument={instrument} category={category} />
        </div>
        <div
          className="border border-white/10 rounded-xs
        max-md:row-start-3"
        >
          <TradePanel instrument={instrument} />
        </div>
        <div className="w-full col-span-full">
          <OrderTableTabs symbol={symbol} />
        </div>
      </div>
    </Suspense>
  );
}
