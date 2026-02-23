import { toast } from "sonner";
import { cancelOrder } from "@/api/trading";
import { Button } from "@/components/ui/button";
import type {
  TradingCategory,
  TradingOpenOrder,
} from "@/features/trading/types";
import { formatDecimalOrDash } from "@/lib/decimal";
import { formatTimestamp } from "@/lib/time";
import { cls } from "@/utils/general.utils";
import { EmptyState } from "./EmptyState";

export function OpenOrdersTable(props: {
  orders: TradingOpenOrder[];
  category: TradingCategory;
  market: string;
  onCanceled: () => void;
}) {
  const orders = props.orders;
  if (orders.length === 0) return <EmptyState />;

  const handleCancel = async (orderId: string) => {
    const res = await cancelOrder(orderId);
    if (!res.res.ok) {
      const body = res.body as { error?: string } | null;
      toast.error(body?.error ?? "Failed to cancel order");
      return;
    }
    props.onCanceled();
    toast.success("Order canceled");
  };

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
          <th className="text-right"></th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => {
          const orderPrice =
            o.type === "LIMIT" ? formatDecimalOrDash(o.price, 8) : "MKT";
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
              <td className="text-left">{formatDecimalOrDash(o.qty, 8)}</td>
              <td className="text-left">{formatDecimalOrDash(o.filled, 8)}</td>
              <td className="text-left">{formatTimestamp(o.updatedAt)}</td>
              <td className="text-left font-mono text-xs" title={String(o.id)}>
                {String(o.id).slice(-8)}
              </td>
              <td className="text-left">{o.status}</td>
              <td className="text-right">
                <Button
                  intent="secondary"
                  size="xs"
                  onPress={() => handleCancel(o.id)}
                >
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
