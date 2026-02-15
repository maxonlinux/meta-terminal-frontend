"use client";

import { ScrollText } from "lucide-react";
import { useMemo } from "react";
import type { FundingRequest } from "@/features/user/types";
import PlanProgress from "./PlanProgress";
import TransactionRow from "./TransactionRow";

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 justify-center h-60 text-sm text-current/50">
      <ScrollText className="text-white/80" size={28} strokeWidth={1} />
      No transactions
    </div>
  );
}

export function TransactionsPanel(props: {
  transactions: FundingRequest[];
  isLoading: boolean;
}) {
  const sorted = useMemo(() => {
    const out = [...props.transactions];
    out.sort((a, b) => b.createdAt - a.createdAt);
    return out;
  }, [props.transactions]);

  return (
    <div className="rounded-xs border border-border bg-secondary-background h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="text-lg font-semibold">Transactions</div>
      </div>

      <div className="pt-2">
        <PlanProgress />
      </div>

      <div className="overflow-auto">
        <table className="w-full text-xs">
          <thead className="border-y border-white/10 bg-black/10">
            <tr className="[&>th]:font-semibold [&>th]:py-3 text-xs text-white/50">
              <th className="pl-4 pr-1 text-left">Date</th>
              <th className="px-1 text-left">Type</th>
              <th className="px-1 text-left">Amount</th>
              <th className="px-1 text-left">Status</th>
              <th className="pl-1 pr-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 [&>tr>td]:py-2">
            {props.isLoading ? (
              <tr>
                <td colSpan={100} className="py-10 text-center text-white/50">
                  Loading...
                </td>
              </tr>
            ) : sorted.length ? (
              sorted.map((t) => <TransactionRow key={t.id} transaction={t} />)
            ) : (
              <tr>
                <td colSpan={100}>
                  <EmptyState />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
