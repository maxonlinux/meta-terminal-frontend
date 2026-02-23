import Decimal from "decimal.js";
import { toast } from "sonner";
import { createOrder } from "@/api/trading";
import { Button } from "@/components/ui/button";
import { formatDecimalOrDash, formatSignedDecimal } from "@/lib/decimal";
import { cls } from "@/utils/general.utils";
import type { TradingPositionWithSide } from "@/features/trading/types";
import { EmptyState } from "./EmptyState";
import { PositionTpSlModal } from "./PositionTpSlModal";

export function PositionsTable(props: {
  openPosition: TradingPositionWithSide | null;
  unrealizedPnl: Decimal | null;
  onRevalidate: () => void;
}) {
  const openPosition = props.openPosition;
  if (!openPosition) return <EmptyState />;

  const closePosition = async () => {
    const side = openPosition.side === "BUY" ? "SELL" : "BUY";
    const res = await createOrder({
      symbol: openPosition.symbol,
      category: "LINEAR",
      side,
      type: "MARKET",
      timeInForce: "IOC",
      qty: openPosition.size,
      reduceOnly: true,
    });

    if (!res.res.ok) {
      const body = res.body as { error?: string } | null;
      toast.error(body?.error ?? "Failed to close position");
      return;
    }

    props.onRevalidate();
    toast.success("Position closed");
  };

  return (
    <table className="w-full whitespace-nowrap text-current/60">
      <thead className="sticky top-0 z-10 bg-secondary-background">
        <tr className="*:px-3 *:py-2 *:font-semibold *:text-current/50 *:text-[11px] bg-black/10">
          <th className="text-left">Symbol</th>
          <th className="text-left">Side</th>
          <th className="text-left">Size</th>
          <th className="text-left">Entry</th>
          <th className="text-left">IM</th>
          <th className="text-left">MM</th>
          <th className="text-left">Leverage</th>
          <th className="text-left">Liq</th>
          <th className="text-left">UPnL</th>
          <th className="text-left">TP/SL</th>
          <th className="text-right"></th>
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
            {formatDecimalOrDash(openPosition.entryPrice, 8)}
          </td>
          <td className="text-left">
            {formatDecimalOrDash(openPosition.im, 8)}
          </td>
          <td className="text-left">
            {formatDecimalOrDash(openPosition.mm, 8)}
          </td>
          <td className="text-left">
            x{formatDecimalOrDash(openPosition.leverage, 1)}
          </td>
          <td className="text-left">
            {formatDecimalOrDash(openPosition.liqPrice, 8)}
          </td>
          <td
            className={cls("text-left font-semibold", {
              "text-green-400": !!(
                props.unrealizedPnl && props.unrealizedPnl.gt(0)
              ),
              "text-red-400": !!(
                props.unrealizedPnl && props.unrealizedPnl.lt(0)
              ),
            })}
          >
            {props.unrealizedPnl
              ? formatSignedDecimal(props.unrealizedPnl, 2)
              : "--"}
          </td>
          <td className="text-left">
            <div className="flex flex-col gap-1">
              <span className="text-green-400">
                TP {formatDecimalOrDash(openPosition.takeProfit, 8)}
              </span>
              <span className="text-red-400">
                SL {formatDecimalOrDash(openPosition.stopLoss, 8)}
              </span>
            </div>
          </td>
          <td className="text-right">
            <div className="flex items-center justify-end gap-2">
              <PositionTpSlModal
                position={openPosition}
                onUpdatedAction={() => props.onRevalidate()}
              />
              <Button
                intent="secondary"
                size="xs"
                onPress={() => closePosition()}
              >
                Close
              </Button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
