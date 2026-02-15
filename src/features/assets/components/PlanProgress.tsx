"use client";

import Decimal from "decimal.js";
import { Crown } from "lucide-react";
import useSWR from "swr";
import { apiFetch } from "@/api/http";

function normalizePlanName(name: string | null) {
  if (!name) return "None";
  return name
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function PlanProgress() {
  const { data } = useSWR("user:plan", async () => {
    const res = await apiFetch("/user/plan");

    return await res.json();
  });

  const current = data?.current ?? null;
  const next = data?.next ?? null;
  // Parse fixed-point string values from the API.
  const remaining = new Decimal(data?.remaining ?? "0");
  const netDeposits = new Decimal(data?.netDeposits ?? "0");

  // Shows progress only when a next plan exists.
  const threshold = netDeposits.plus(remaining);
  const percentage = threshold.gt(0)
    ? netDeposits.div(threshold).mul(100)
    : new Decimal(0);
  const percentValue = Math.min(100, Math.max(0, percentage.toNumber()));
  const hasNextPlan = Boolean(next);
  const isMaxPlan = Boolean(current) && !hasNextPlan;
  const showProgress = hasNextPlan && remaining.gt(0) && threshold.gt(0);

  return (
    <div className="px-4 pb-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
        <span>{normalizePlanName(current)}</span>
        {isMaxPlan ? <Crown className="h-3.5 w-3.5 text-yellow-400" /> : null}
      </div>

      {hasNextPlan ? (
        <>
          <div className="mt-1 text-xs text-white/50">
            Next plan: {normalizePlanName(next)}
          </div>
          <div className="text-xs text-white/50">
            Remaining to reach it: ${remaining.toFixed(2)}
          </div>
          {showProgress ? (
            <div className="mt-2 h-1.5 w-full rounded-full bg-black/20">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${percentValue}%` }}
              />
            </div>
          ) : null}
        </>
      ) : (
        <div className="mt-1 text-xs text-white/50">
          You are on the highest plan.
        </div>
      )}
    </div>
  );
}
