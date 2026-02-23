import type { TradingCategory, TradingFill } from "@/features/trading/types";
import { formatDecimalOrDash } from "@/lib/decimal";
import { formatTimestamp } from "@/lib/time";
import { cls } from "@/utils/general.utils";
import { EmptyState } from "./EmptyState";

export function TradeHistoryTable(props: {
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
          <th className="text-left">Filled Qty</th>
          <th className="text-left">Role</th>
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
              <td className="text-left">{formatDecimalOrDash(t.price, 8)}</td>
              <td className="text-left">{formatDecimalOrDash(t.qty, 8)}</td>
              <td className="text-left">{t.role}</td>
              <td className="text-left font-mono text-xs" title={String(t.id)}>
                {String(t.id).slice(-8)}
              </td>
              <td className="text-left">{formatTimestamp(t.timestamp)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
