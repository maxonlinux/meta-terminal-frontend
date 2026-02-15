import { Folder, Play, TrendingUp } from "lucide-react";
import { fetchAssets } from "@/features/assets/api";
import type { AssetData } from "@/features/assets/types";
import { AssetGrid } from "@/features/trading/components/landing/AssetGrid";
import { Footer } from "@/features/trading/components/landing/Footer";
import { Hero } from "@/features/trading/components/landing/Hero";
import { gilroy } from "@/fonts";
import { cls } from "@/utils/general.utils";

const HOW_IT_WORKS = [
  {
    title: "Choose your asset",
    description:
      "Browse the list of supported assets. Select one to view detailed information and start trading",
    icon: <Folder size={16} />,
  },
  {
    title: "Analyze the market",
    description:
      "Analyze the market trends and make informed decisions based on the data provided by the platform",
    icon: <TrendingUp size={16} />,
  },
  {
    title: "Start trading confidently",
    description:
      "Start trading with confidence and enjoy the benefits of the platform",
    icon: <Play size={16} />,
  },
];

const AssetsOverview = ({ assets }: { assets: AssetData[] }) => {
  return (
    <div className="flex flex-col gap-6">
      <hgroup>
        <h2 className="text-3xl font-bold leading-none mb-2">
          Assets Overview
        </h2>
        <h3 className="text-sm opacity-50 mr-16 max-md:mr-10">
          Browse the list of supported assets. Select one to view detailed
          information and start trading
        </h3>
      </hgroup>

      <div className="mb-8">
        <AssetGrid assets={assets} />
      </div>
    </div>
  );
};

const HowItWorks = () => {
  return (
    <div className="flex flex-col gap-6">
      <hgroup>
        <h2 className="text-3xl font-bold leading-none mb-2">How it works</h2>
        <h3 className="text-sm opacity-50 mr-16 max-md:mr-10">
          Learn how to use the platform and start trading with confidence
        </h3>
      </hgroup>
      <ul className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
        {HOW_IT_WORKS.map((item) => (
          <li
            key={item.title}
            className="flex flex-col border border-border p-4 rounded-md w-full bg-secondary-background"
          >
            <div className="flex size-10 items-center justify-center rounded-full border border-border">
              {item.icon}
            </div>
            <br />
            <span className="font-bold text-xl">{item.title}</span>
            <span className="text-sm opacity-50">{item.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default async function TerminalLandingView() {
  const assets = await fetchAssets();

  if (!assets) {
    return null;
  }

  return (
    <div
      className={cls(
        "text-white flex flex-col w-full min-h-dvh",
        gilroy.className,
      )}
    >
      <Hero assets={assets} />

      <div className="flex flex-col gap-10 p-8 max-w-495 mx-auto w-full max-sm:px-4">
        <AssetsOverview assets={assets} />
        <HowItWorks />
      </div>

      <Footer />
    </div>
  );
}
