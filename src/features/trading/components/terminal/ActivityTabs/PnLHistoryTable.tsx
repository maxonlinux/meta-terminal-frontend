import Decimal from "decimal.js";
import type { TradingPnL } from "@/features/trading/types";
import { formatDecimalOrDash } from "@/lib/decimal";
import { formatTimestamp } from "@/lib/time";
import { cls } from "@/utils/general.utils";
import { EmptyState } from "./EmptyState";

export function PnLHistoryTable(props: { rows: TradingPnL[] }) {
  if (!props.rows.length) return <EmptyState />;

  return (
    <table className="w-full whitespace-nowrap text-current/60">
      <thead className="sticky top-0 z-10 bg-secondary-background">
        <tr className="*:px-3 *:py-2 *:font-semibold *:text-current/50 *:text-[11px] bg-black/10">
          <th className="text-left">Market</th>
          <th className="text-left">Instrument</th>
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
            <td className="text-left">{row.symbol}</td>
            <td className="text-left">{row.category}</td>
            <td className="text-left">{formatTimestamp(row.createdAt)}</td>
            <td
              className={cls("text-left font-semibold", {
                "text-green-400": row.side === 0,
                "text-red-400": row.side === 1,
              })}
            >
              {row.side === 0 ? "BUY" : "SELL"}
            </td>
            <td className="text-left">{formatDecimalOrDash(row.qty, 8)}</td>
            <td className="text-left">{formatDecimalOrDash(row.price, 8)}</td>
            <td
              className={cls("text-left font-semibold", {
                "text-green-400": new Decimal(row.realized).gt(0),
                "text-red-400": new Decimal(row.realized).lt(0),
              })}
            >
              {formatDecimalOrDash(row.realized, 8)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
