"use client";

import Decimal from "decimal.js";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { TabList, TabPanel, Tabs } from "react-aria-components";
import { useSWRConfig } from "swr";
import { useFills } from "@/features/trading/hooks/useFills";
import { useOpenOrders } from "@/features/trading/hooks/useOpenOrders";
import { useOrderHistory } from "@/features/trading/hooks/useOrderHistory";
import { usePnLHistory } from "@/features/trading/hooks/usePnLHistory";
import { usePosition } from "@/features/trading/hooks/usePosition";
import { useUnrealizedPnl } from "@/features/trading/hooks/useUnrealizedPnl";
import type {
  TradingCategory,
  TradingPosition,
  TradingPositionWithSide,
} from "@/features/trading/types";
import { OpenOrdersTable } from "./OpenOrdersTable";
import { OrderHistoryTable } from "./OrderHistoryTable";
import { PnLHistoryTable } from "./PnLHistoryTable";
import { PositionsTable } from "./PositionsTable";
import { TradeHistoryTable } from "./TradeHistoryTable";
import { TabButton } from "./TabButton";
import cls from "clsx";

export const TableShell = (props: {
  children: React.ReactNode;
  className: string;
}) => (
  <div
    className={cls(
      "w-full overflow-auto max-h-90 [scrollbar-gutter:stable] bg-secondary-background",
      props.className,
    )}
  >
    {props.children}
  </div>
);

export default function ActivityTabs(props: { symbol: string }) {
  const params = useParams();
  const { mutate } = useSWRConfig();
  const categoryParam = getParamString(params, "category");
  const category: TradingCategory = isTradingCategory(categoryParam)
    ? categoryParam
    : "SPOT";

  const market = props.symbol;

  const { orders: openOrders, key: openOrdersKey } = useOpenOrders({
    category,
    symbol: props.symbol,
  });
  const { data: orderHistory } = useOrderHistory({
    category,
    symbol: props.symbol,
  });
  const { data: tradeHistory } = useFills({ category, symbol: props.symbol });
  const { data: pnlHistory } = usePnLHistory({
    category,
    symbol: props.symbol,
  });

  const { position, revalidate: revalidatePosition } = usePosition({
    symbol: props.symbol,
    enabled: category === "LINEAR",
  });
  const openPosition = useMemo(() => openPositionFrom(position), [position]);
  const unrealizedPnl = useUnrealizedPnl(position);

  if (!openOrders || !orderHistory || !tradeHistory || !pnlHistory) return null;

  const openOrdersCount = openOrders.length;
  const orderHistoryCount = orderHistory.length;
  const tradeHistoryCount = tradeHistory.length;
  const pnlHistoryCount = pnlHistory.length;
  const positionsCount = openPosition ? 1 : 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="border border-white/10 rounded-xs w-full min-h-80 bg-secondary-background">
        <Tabs>
          <div className="flex items-center justify-between gap-2 flex-wrap px-2 py-2 border-b border-white/10 bg-black/10">
            <TabList
              className="flex items-center gap-1 rounded-xs border border-white/10 bg-black/20 p-1 overflow-x-auto min-w-0"
              aria-label="Activity tabs"
            >
              <TabButton
                id="open"
                label="Open Orders"
                count={openOrdersCount}
              />
              <TabButton
                id="positions"
                label="Positions"
                count={positionsCount}
              />
              <TabButton
                id="orderHistory"
                label="Order History"
                count={orderHistoryCount}
              />
              <TabButton
                id="tradeHistory"
                label="Trade History"
                count={tradeHistoryCount}
              />
              <TabButton id="pnl" label="PNL" count={pnlHistoryCount} />
            </TabList>
          </div>

          <TabPanel id="open">
            <TableShell className="">
              <OpenOrdersTable
                orders={openOrders}
                category={category}
                market={market}
                onCanceled={() => mutate(openOrdersKey)}
              />
            </TableShell>
          </TabPanel>

          <TabPanel id="positions">
            <TableShell className="max-h-none">
              <PositionsTable
                openPosition={openPosition}
                unrealizedPnl={unrealizedPnl}
                onRevalidate={revalidatePosition}
              />
            </TableShell>
          </TabPanel>

          <TabPanel id="orderHistory">
            <TableShell className="">
              <OrderHistoryTable
                orders={orderHistory}
                category={category}
                market={market}
              />
            </TableShell>
          </TabPanel>

          <TabPanel id="tradeHistory">
            <TableShell className="">
              <TradeHistoryTable
                fills={tradeHistory}
                category={category}
                market={market}
              />
            </TableShell>
          </TabPanel>

          <TabPanel id="pnl">
            <TableShell className="">
              <PnLHistoryTable rows={pnlHistory} />
            </TableShell>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}

function isTradingCategory(raw: string): raw is TradingCategory {
  return raw === "SPOT" || raw === "LINEAR";
}

function getParamString(
  params: Readonly<Record<string, string | string[] | undefined>>,
  key: string,
) {
  const v = params[key];
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return "";
}

function openPositionFrom(
  position: TradingPosition | null,
): TradingPositionWithSide | null {
  if (!position) return null;
  const size = new Decimal(position.size);
  if (size.isZero()) return null;
  const side = size.gt(0) ? "BUY" : "SELL";
  return { ...position, side, size: size.abs().toString() };
}
