import type {
  TradingCategory,
  TradingHistoryOrder,
} from "@/features/trading/types";
import { formatDecimalOrDash } from "@/lib/decimal";
import { formatTimestamp } from "@/lib/time";
import { cls } from "@/utils/general.utils";
import { EmptyState } from "./EmptyState";

export function OrderHistoryTable(props: {
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
            o.type === "LIMIT" ? formatDecimalOrDash(o.price, 2) : "MKT";

          const filledQty = formatDecimalOrDash(o.filled, 8);
          const orderQty = formatDecimalOrDash(o.qty, 8);

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
                <span> / </span>
                <span>{orderQty}</span>
              </td>
              <td className="text-left">{formatTimestamp(o.updatedAt)}</td>
              <td className="text-left font-mono text-xs" title={String(o.id)}>
                {String(o.id).slice(-8)}
              </td>
              <td className="text-left">{o.status}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
