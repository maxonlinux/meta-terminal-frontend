"use client";

import { useMemo, useState } from "react";
import Decimal from "decimal.js";
import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import defaultTheme from "tailwindcss/defaultTheme";
import { useIsMounted, useMediaQuery } from "usehooks-ts";
import { usePriceSymbolMap } from "@/features/assets/hooks/useBaseToSymbolMap";
import { useUserBalances } from "@/features/user/hooks/useUserBalances";
import { useUserTransactions } from "@/features/user/hooks/useUserTransactions";
import { cls } from "@/utils/general.utils";
import { AssetsTable } from "./AssetsTable";
import DepositModal from "./DepositModal";
import { TransactionsPanel } from "./TransactionsPanel";
import { UnifiedTradingCard } from "./UnifiedTradingCard";
import WithdrawModal from "./WithdrawModal";

function TabButton(props: { id: string; label: string; count: number }) {
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
}

export function PortfolioView() {
  const isMounted = useIsMounted();
  const isMobile = useMediaQuery(`(max-width: ${defaultTheme.screens.lg})`);
  const [mobileTab, setMobileTab] = useState<"assets" | "transactions">(
    "assets",
  );

  const { userBalances } = useUserBalances();
  const { transactions, isLoading: isTransactionsLoading } =
    useUserTransactions();

  const balances = useMemo(
    () => (Array.isArray(userBalances) ? userBalances : []),
    [userBalances],
  );
  const txs = useMemo(
    () => (Array.isArray(transactions) ? transactions : []),
    [transactions],
  );

  const bases = useMemo(() => balances.map((b) => b.asset), [balances]);

  const priceSymbolByBase = usePriceSymbolMap(bases);

  const [realTimePrices, setRealTimePrices] = useState<Record<string, string>>(
    {},
  );

  const [unrealizedPnls, setUnrealizedPnls] = useState<Record<string, string>>(
    {},
  );

  const [search, setSearch] = useState("");
  const [hideZeroBalances, setHideZeroBalances] = useState(false);

  const filteredBalances = useMemo(() => {
    const q = search.trim().toUpperCase();
    const base = balances.filter((b) =>
      hideZeroBalances
        ? !new Decimal(b.available).isZero() || !new Decimal(b.locked).isZero()
        : true,
    );
    if (!q) return base;
    return base.filter((b) => b.asset.toUpperCase().includes(q));
  }, [balances, hideZeroBalances, search]);

  const assetsCount = filteredBalances.length;
  const txCount = txs.length;

  const openTransactions = () => {
    if (isMobile) setMobileTab("transactions");
  };

  const totalUpnl = useMemo(() => {
    let sum = new Decimal(0);
    for (const v of Object.values(unrealizedPnls)) {
      sum = sum.plus(v);
    }
    return sum;
  }, [unrealizedPnls]);

  const totalEquity = useMemo(() => {
    let sum = new Decimal(0);
    for (const b of balances) {
      const symbol = priceSymbolByBase[b.asset];
      const price = realTimePrices[symbol];
      if (!price) continue;
      const current = new Decimal(b.available).mul(price);
      sum = sum.plus(current);
    }
    return sum;
  }, [balances, realTimePrices, priceSymbolByBase]);

  const assetsPanel = (
    <div className="flex flex-col gap-1">
      <UnifiedTradingCard
        totalEquity={totalEquity
          .toDecimalPlaces(2, Decimal.ROUND_DOWN)
          .toString()}
        totalUpnl={totalUpnl.toDecimalPlaces(2, Decimal.ROUND_DOWN).toString()}
        onOpenTransactions={openTransactions}
      />

      <div className="absolute">
        <DepositModal showTrigger={false} />
        <WithdrawModal showTrigger={false} />
      </div>

      <AssetsTable
        balances={filteredBalances}
        priceSymbolByBase={priceSymbolByBase}
        prices={realTimePrices}
        onPriceUpdate={setRealTimePrices}
        unrealizedPnls={unrealizedPnls}
        onPnlUpdate={setUnrealizedPnls}
        search={search}
        setSearch={setSearch}
        hideZeroBalances={hideZeroBalances}
        setHideZeroBalances={setHideZeroBalances}
      />
    </div>
  );

  const transactionsPanel = (
    <TransactionsPanel transactions={txs} isLoading={isTransactionsLoading} />
  );

  if (isMobile && isMounted()) {
    return (
      <div className="flex flex-col gap-1 w-full">
        <Tabs
          selectedKey={mobileTab}
          onSelectionChange={(key) => {
            if (key === "assets" || key === "transactions") setMobileTab(key);
          }}
        >
          <div className="flex items-center justify-between gap-2 flex-wrap px-2 py-2 border border-white/10 rounded-xs bg-secondary-background">
            <TabList
              className="flex items-center gap-1 rounded-xs border border-white/10 bg-black/20 p-1 overflow-x-auto min-w-0"
              aria-label="Assets tabs"
            >
              <TabButton id="assets" label="Assets" count={assetsCount} />
              <TabButton
                id="transactions"
                label="Transactions"
                count={txCount}
              />
            </TabList>
          </div>

          <TabPanel id="assets">{assetsPanel}</TabPanel>
          <TabPanel id="transactions">{transactionsPanel}</TabPanel>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[360px_1fr] gap-1 w-full overflow-hidden">
      <div className="min-w-0">{transactionsPanel}</div>
      <div className="min-w-0">{assetsPanel}</div>
    </div>
  );
}
