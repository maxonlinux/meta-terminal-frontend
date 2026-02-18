"use client";

import { ScrollText, Sliders } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "react-aria-components";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CustomTextField } from "@/components/ui/CustomTextField";
import { useFills } from "@/features/trading/hooks/useFills";
import { useOpenOrders } from "@/features/trading/hooks/useOpenOrders";
import { useOrderHistory } from "@/features/trading/hooks/useOrderHistory";
import { usePnLHistory } from "@/features/trading/hooks/usePnLHistory";
import { usePosition } from "@/features/trading/hooks/usePosition";
import type {
  TradingCategory,
  TradingFill,
  TradingHistoryOrder,
  TradingOpenOrder,
  TradingPnL,
  TradingPosition,
} from "@/features/trading/types";
import { cls } from "@/utils/general.utils";
import { formatDateTime, formatNumber } from "@/utils/format";

type TradingPositionWithSide = TradingPosition & { side: "BUY" | "SELL" };

function formatMaybeNumber(raw: string, decimals = 8) {
  const n = Number(raw);
  if (!Number.isFinite(n) || n === 0) return "--";
  return formatNumber(n, { maxDecimals: decimals });
}

function PositionTpSlModal(props: {
  position: TradingPositionWithSide;
  onUpdated: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const normalizeValue = (value: string) => (value === "0" ? "" : value);
  const [takeProfit, setTakeProfit] = useState<string>(
    normalizeValue(props.position.takeProfit),
  );
  const [stopLoss, setStopLoss] = useState<string>(
    normalizeValue(props.position.stopLoss),
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setTakeProfit(normalizeValue(props.position.takeProfit));
      setStopLoss(normalizeValue(props.position.stopLoss));
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;
    setIsSaving(true);

    const res = await fetch(
      `/proxy/main/api/v1/user/positions?symbol=${props.position.symbol}`,
      {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({
          tp: takeProfit.trim(),
          sl: stopLoss.trim(),
        }),
      },
    );

    setIsSaving(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const message =
        body && typeof body.error === "string"
          ? body.error
          : "Failed to update TP/SL";
      toast.error(message);
      return;
    }

    props.onUpdated();
    setIsOpen(false);
    toast.success("TP/SL updated");
  };

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Button size="xs" intent="secondary">
        <Sliders className="size-3.5" />
        TP/SL
      </Button>
      <ModalOverlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
        <Modal className="fixed left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2">
          <Dialog className="outline-hidden relative divide-y divide-border rounded-xs border border-white/10 bg-secondary-background">
            <div className="px-4 py-3 text-sm font-semibold">Update TP/SL</div>
            <form className="flex flex-col gap-3 px-4 py-4" onSubmit={onSubmit}>
              <CustomTextField
                label="Take profit"
                inputProps={{
                  type: "number",
                  step: "any",
                  placeholder: "Leave empty to remove",
                  value: takeProfit,
                  onChange: (event) => setTakeProfit(event.target.value),
                }}
              />
              <CustomTextField
                label="Stop loss"
                inputProps={{
                  type: "number",
                  step: "any",
                  placeholder: "Leave empty to remove",
                  value: stopLoss,
                  onChange: (event) => setStopLoss(event.target.value),
                }}
              />
              <div className="flex items-center justify-end gap-2">
                <Button
                  intent="secondary"
                  type="button"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button intent="primary" type="submit" isDisabled={isSaving}>
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
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
  const size = Number(position.size);
  if (!Number.isFinite(size) || size === 0) return null;
  const side = size > 0 ? "BUY" : "SELL";
  return { ...position, side, size: String(Math.abs(size)) };
}

const Slash = () => <span className=""> / </span>;

const EmptyState = () => (
  <div className="flex flex-col items-center gap-2 justify-center h-72 text-sm text-current/50">
    <ScrollText className="text-white/80" size={28} strokeWidth={1} />
    No data
  </div>
);

const TabButton = (props: { id: string; label: string; count: number }) => {
  return (
    <Tab
      id={props.id}
      className={({ isSelected }) =>
        cls(
          "cursor-pointer select-none whitespace-nowrap px-3 py-1.5 rounded-xs text-xs font-semibold transition-colors",
          isSelected
            ? "bg-white/10 text-white"
            : "text-white/60 hover:text-white hover:bg-white/5",
        )
      }
    >
      <span>{props.label}</span>
      <span className="ml-2 inline-flex min-w-6 justify-center rounded-xs bg-black/20 px-1.5 py-0.5 text-xxs text-white/70">
        {props.count}
      </span>
    </Tab>
  );
};

const TableShell = (props: {
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

function OpenOrdersTable(props: {
  orders: TradingOpenOrder[];
  category: TradingCategory;
  market: string;
}) {
  const orders = props.orders;
  if (orders.length === 0) return <EmptyState />;

  return (
    <table className="w-full whitespace-nowrap text-current/60">
      <thead className="sticky top-0 z-10 bg-secondary-background">
        <tr className="*:px-3 *:py-2 *:font-semibold *:text-current/50 *:text-[11px] bg-black/10">
          <th className="text-left">Market</th>
          <th className="text-left">Instrument</th>
          <th className="text-left">Order Type</th>
          <th className="text-left">Direction</th>
          <th className="text-left">Order Price</th>
          <th className="text-left">Order Qty</th>
          <th className="text-left">Filled Qty</th>
          <th className="text-left">Order Time</th>
          <th className="text-left">Order ID</th>
          <th className="text-left">Status</th>
        </tr>
      </thead>
      <tbody className="">
        {orders.map((o) => {
          const orderPrice =
            o.type === "LIMIT" ? formatMaybeNumber(o.price, 8) : "MKT";
          const direction = o.side;
          return (
            <tr
              key={o.id}
              className="text-xs *:px-3 *:py-3 text-white hover:bg-white/5 transition-colors"
            >
              <td className="text-left">{props.market}</td>
              <td className="text-left">{props.category}</td>
              <td className="text-left">{o.type}</td>
              <td
                className={cls("text-left font-medium", {
                  "text-green-400": o.side === "BUY",
                  "text-red-400": o.side === "SELL",
                })}
              >
                {direction}
              </td>
              <td className="text-left">{orderPrice}</td>
              <td className="text-left">{formatMaybeNumber(o.qty, 8)}</td>
              <td className="text-left">{formatMaybeNumber(o.filled, 8)}</td>
              <td className="text-left">{formatDateTime(o.updatedAt)}</td>
              <td className="text-left font-mono text-xs" title={String(o.id)}>
                {String(o.id).slice(0, 8)}
              </td>
              <td className="text-left">{o.status}</td>
              <td>
                <Button intent="outline" size="xs">
                  Cancel
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function OrderHistoryTable(props: {
  orders: TradingHistoryOrder[];
  category: TradingCategory;
  market: string;
}) {
  const orders = props.orders;
  if (orders.length === 0) return <EmptyState />;

  return (
    <table className="w-full whitespace-nowrap text-current/60">
      <thead className="sticky top-0 z-10 bg-secondary-background">
        <tr className="*:px-3 *:py-2 *:font-semibold *:text-current/50 *:text-[11px] bg-black/10">
          <th className="text-left">Market</th>
          <th className="text-left">Instrument</th>
          <th className="text-left">Order Type</th>
          <th className="text-left">Direction</th>
          <th className="text-left">Order Price</th>
          <th className="text-left">Filled/Order Qty</th>
          <th className="text-left">Order Time</th>
          <th className="text-left">Order ID</th>
          <th className="text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => {
          const direction = o.side;
          const orderPrice =
            o.type === "LIMIT" ? formatMaybeNumber(o.price, 2) : "MKT";

          const filledQty = formatMaybeNumber(o.filled, 8);
          const orderQty = formatMaybeNumber(o.qty, 8);

          return (
            <tr
              key={o.id}
              className="text-xs *:px-3 *:py-3.5 text-white hover:bg-white/5 transition-colors"
            >
              <td className="text-left">{props.market}</td>
              <td className="text-left">{props.category}</td>
              <td className="text-left">{o.type}</td>
              <td
                className={cls("text-left font-medium", {
                  "text-green-400": o.side === "BUY",
                  "text-red-400": o.side === "SELL",
                })}
              >
                {direction}
              </td>
              <td className="text-left">{orderPrice}</td>
              <td className="text-left">
                <span>{filledQty}</span>
                <Slash />
                <span>{orderQty}</span>
              </td>
              <td className="text-left">{formatDateTime(o.updatedAt)}</td>
              <td className="text-left font-mono text-xs" title={String(o.id)}>
                {String(o.id).slice(0, 8)}
              </td>
              <td className="text-left">{o.status}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function TradeHistoryTable(props: {
  fills: TradingFill[];
  category: TradingCategory;
  market: string;
}) {
  const fills = props.fills;
  if (fills.length === 0) return <EmptyState />;

  return (
    <table className="w-full whitespace-nowrap text-current/60">
      <thead className="sticky top-0 z-10 bg-secondary-background">
        <tr className="*:px-3 *:py-2 *:font-semibold *:text-current/50 *:text-[11px] bg-black/10">
          <th className="text-left">Market</th>
          <th className="text-left">Instrument</th>
          <th className="text-left">Order Type</th>
          <th className="text-left">Direction</th>
          <th className="text-left">Filled Price</th>
          <th className="text-left">Filled Price</th>
          <th className="text-left">Filled Qty</th>
          <th className="text-left">Filled Type</th>
          <th className="text-left">Transaction ID</th>
          <th className="text-left">Transaction Time</th>
        </tr>
      </thead>
      <tbody>
        {fills.map((t) => {
          const direction = t.side;
          return (
            <tr
              key={t.id}
              className="text-xs *:px-3 *:py-3.5 text-white hover:bg-white/5 transition-colors"
            >
              <td className={cls("text-left")}>{props.market}</td>
              <td className="text-left">{props.category}</td>
              <td className="text-left">{t.orderType}</td>
              <td
                className={cls("text-left", {
                  "text-green-400": t.side === "BUY",
                  "text-red-400": t.side === "SELL",
                })}
              >
                {direction}
              </td>
              <td className="text-left">{formatMaybeNumber(t.price, 8)}</td>
              <td className="text-left">{formatMaybeNumber(t.qty, 8)}</td>
              <td className="text-left">Trade</td>
              <td className="text-left font-mono text-xs" title={String(t.id)}>
                {String(t.id).slice(0, 8)}
              </td>
              <td className="text-left">{formatDateTime(t.timestamp)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function PnLHistoryTable(props: { rows: TradingPnL[] }) {
  if (!props.rows.length) return <EmptyState />;

  return (
    <table className="w-full whitespace-nowrap text-current/60">
      <thead className="sticky top-0 z-10 bg-secondary-background">
        <tr className="*:px-3 *:py-2 *:font-semibold *:text-current/50 *:text-[11px] bg-black/10">
          <th className="text-left">Time</th>
          <th className="text-left">Side</th>
          <th className="text-left">Qty</th>
          <th className="text-left">Price</th>
          <th className="text-left">Realized</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/10">
        {props.rows.map((row) => (
          <tr key={row.id} className="*:px-3 *:py-3 text-xs hover:bg-white/5">
            <td className="text-left">{formatDateTime(row.createdAt)}</td>
            <td
              className={cls("text-left font-semibold", {
                "text-green-400": row.side === 0,
                "text-red-400": row.side === 1,
              })}
            >
              {row.side === 0 ? "BUY" : "SELL"}
            </td>
            <td className="text-left">{formatMaybeNumber(row.qty)}</td>
            <td className="text-left">{formatMaybeNumber(row.price)}</td>
            <td
              className={cls("text-left font-semibold", {
                "text-green-400": Number(row.realized) > 0,
                "text-red-400": Number(row.realized) < 0,
              })}
            >
              {formatMaybeNumber(row.realized)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function OrderTabs(props: { symbol: string }) {
  const params = useParams();
  const categoryParam = getParamString(params, "category");
  const category: TradingCategory = isTradingCategory(categoryParam)
    ? categoryParam
    : "SPOT";

  const market = props.symbol;

  const { orders: openOrders } = useOpenOrders({
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
              aria-label="Order tabs"
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
              />
            </TableShell>
          </TabPanel>

          <TabPanel id="positions">
            {openPosition ? (
              <TableShell className="max-h-none">
                <table className="w-full whitespace-nowrap text-current/60">
                  <thead className="sticky top-0 z-10 bg-secondary-background">
                    <tr className="*:px-3 *:py-2 *:font-semibold *:text-current/50 *:text-[11px] bg-black/10">
                      <th className="text-left">Symbol</th>
                      <th className="text-left">Side</th>
                      <th className="text-left">Size</th>
                      <th className="text-left">Entry</th>
                      <th className="text-left">Leverage</th>
                      <th className="text-left">Liq</th>
                      <th className="text-left">TP</th>
                      <th className="text-left">SL</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    <tr className="*:px-3 *:py-3 text-xs hover:bg-white/5 text-white transition-colors">
                      <td className="text-left">{openPosition.symbol}</td>
                      <td
                        className={cls("text-left px-3 py-3 font-semibold", {
                          "text-green-400": openPosition.side === "BUY",
                          "text-red-400": openPosition.side === "SELL",
                        })}
                      >
                        {openPosition.side}
                      </td>
                      <td className="text-left">{openPosition.size}</td>
                      <td className="text-left">
                        {formatMaybeNumber(openPosition.entryPrice, 8)}
                      </td>
                      <td className="text-left">
                        x{formatMaybeNumber(openPosition.leverage, 1)}
                      </td>
                      <td className="text-left">
                        {formatMaybeNumber(openPosition.liqPrice)}
                      </td>
                      <td className="text-left">
                        {formatMaybeNumber(openPosition.takeProfit)}
                      </td>
                      <td className="text-left">
                        {formatMaybeNumber(openPosition.stopLoss)}
                      </td>
                      <td className="text-right">
                        <PositionTpSlModal
                          position={openPosition}
                          onUpdated={() => revalidatePosition()}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </TableShell>
            ) : (
              <EmptyState />
            )}
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
