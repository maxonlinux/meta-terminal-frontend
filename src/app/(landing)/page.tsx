"use client";

import { Coins, Gauge, History, Telescope } from "lucide-react";
import { useRef } from "react";
import AccountTiers from "@/features/landing/components/AccountTiers";
import AdaptiveDesign from "@/features/landing/components/AdaptiveDesign";
import { BentoCard, BentoGrid } from "@/features/landing/components/BentoGrid";
import ChatButton from "@/features/landing/components/ChatButton";
import Commissions from "@/features/landing/components/Commissions";
import Contacts from "@/features/landing/components/Contacts";
import DepositAndWithdrawal from "@/features/landing/components/DepositAndWithdrawal";
import DiscoverTrading from "@/features/landing/components/DiscoverTrading";
import Exchanges from "@/features/landing/components/Exchanges";
import Hero from "@/features/landing/components/Hero";
import PreIPO from "@/features/landing/components/PreIPO";
import Security from "@/features/landing/components/Security";
import SpotTrading from "@/features/landing/components/SpotTrading";
import Trust from "@/features/landing/components/Trust";

function IndexPage() {
  const authButtonsRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      Icon: History,
      name: "Pre-IPO Trading",
      description:
        "Trade shares of prospective private companies that have not yet gone public.",
      href: "/register",
      cta: "Learn more",
      className: "col-span-3 lg:col-span-1",
      background: (
        <div className="absolute p-4 inset-0 mask-r-from-50%">
          <PreIPO />
        </div>
      ),
    },
    {
      Icon: Gauge,
      name: "Spot Trading",
      description:
        "Fund your account and withdraw cryptocurrency. Trade to USD and USDT.",
      href: "/register",
      cta: "Learn more",
      className: "col-span-3 lg:col-span-2",
      background: (
        <div className="absolute size-full">
          <SpotTrading />
        </div>
      ),
    },
    {
      Icon: Coins,
      name: "Deposit and withdraw in USDT",
      description:
        "Deposit and withdraw in USDT through Ethereum (ERC-20) and Tron (TRC-20) blockchain networks.",
      href: "/register",
      cta: "Learn more",
      className: "col-span-3 lg:col-span-2",
      background: (
        <div className="absolute p-4 size-full">
          <DepositAndWithdrawal />
        </div>
      ),
    },
    {
      Icon: Telescope,
      name: "Discover asset trading",
      description: "Register now and start trading.",
      className: "col-span-3 lg:col-span-1",
      href: "/trade",
      cta: "Start trading",
      background: (
        <div className="absolute size-full">
          <DiscoverTrading />
        </div>
      ),
    },
  ];

  return (
    <>
      <Hero authButtonsRef={authButtonsRef} />
      <div className="relative flex flex-col items-center mx-auto px-2 sm:px-4 max-w-7xl gap-8">
        <BentoGrid>
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
        <AdaptiveDesign />
        <AccountTiers />
        <Commissions />
        <Exchanges />
        <Security />
        <Trust />
        <Contacts />
      </div>
      <ChatButton authButtonsRef={authButtonsRef} />
    </>
  );
}

export default IndexPage;
