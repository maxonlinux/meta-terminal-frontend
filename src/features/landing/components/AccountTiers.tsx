import type { EmblaCarouselType } from "embla-carousel";
import AutoPlay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "react-aria-components";
import { cls } from "@/utils/general.utils";

const Tier = ({
  title,
  index,
  selectedIndex,
  description,
  spotStocksCount,
  commission,
  minDeposit,
  leverage,
  disabledFrom,
}: {
  title: string;
  index: number;
  selectedIndex: number;
  description: string;
  commission: string;
  spotStocksCount?: number;
  minDeposit: string;
  leverage: string;
  disabledFrom?: number;
}) => {
  const list = [
    `Minimum deposit: ${minDeposit}`,
    `Leverage: ${leverage}`,
    `Outgoing transactions fee: ${commission}%`,
    "Instant execution",
    spotStocksCount
      ? "Spot trading"
      : `Spot trading. Available stocks: ${spotStocksCount}`,
    "Trading stocks and cryptocurrencies",
    "Personal manager",
    "Commodity trading",
    "Deposit insurance",
    "Opening a personal PAMM account",
    "No swap",
    "Trading ETFs and indices",
  ];

  const selected = index === selectedIndex;

  return (
    <div
      className={cls(
        "relative group transition-transform min-w-80",
        selected ? "scale-110 z-10" : "hover:scale-105",
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className={cls(
          `relative flex flex-col h-full items-center justify-between rounded-lg bg-background border border-border overflow-hidden`,
          "select-none opacity-0",
          { "border-white/50": selected },
        )}
      >
        <div className="w-full h-full p-4 border-b border-white/10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h3 className="font-bold uppercase">{title}</h3>
            <p className="opacity-50 font-light text-xs">{description}</p>
          </motion.div>
        </div>
        <div className="p-4 w-full">
          <motion.ul
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-sm max-md:text-base w-full"
          >
            {list.map((item, i) => (
              <li
                key={item}
                className={
                  disabledFrom && disabledFrom <= i
                    ? "opacity-20 font-light"
                    : ""
                }
              >
                {item}
              </li>
            ))}
          </motion.ul>
        </div>
        <div className="w-full p-4 border-t border-border">
          <Link
            className="group/link inline-flex items-center justify-between w-full px-4 py-2 rounded-sm bg-white/5 hover:bg-accent transition-colors"
            href="/assets"
          >
            Choose tier
            <ArrowRight
              size={16}
              className="inline group-hover/link:translate-x-2 transition-transform"
            />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default function AccountTiers() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      dragFree: false,
      containScroll: false,
    },
    [
      WheelGesturesPlugin(),
      AutoPlay({
        delay: 5000,
        stopOnInteraction: true,
      }),
    ],
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [isPrevDisabled, setIsPrevDisabled] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setIsPrevDisabled(!emblaApi.canScrollPrev());
    setIsNextDisabled(!emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onSelect]);

  const tiers = [
    {
      title: "Low-Base",
      description: "Starting option for learning",
      spotStocksCount: 5,
      commission: "10",
      minDeposit: "10",
      leverage: "--",
      disabledFrom: 6,
    },
    {
      title: "Base",
      description: "A basic entry-level option for getting started in trading",
      commission: "8",
      minDeposit: "500",
      leverage: "--",
      disabledFrom: 6,
    },
    {
      title: "Standard",
      description: "A universal option for a novice trader",
      commission: "5",
      minDeposit: "1 000",
      leverage: "1:15",
      disabledFrom: 7,
    },
    {
      title: "Silver",
      description: "An enhanced plan with better benefits for traders",
      commission: "4",
      minDeposit: "5 000",
      leverage: "1:30",
      disabledFrom: 7,
    },
    {
      title: "Gold",
      description:
        "Offers higher leverage and lower commission for committed traders",
      commission: "3",
      minDeposit: "10 000",
      leverage: "1:45",
      disabledFrom: 8,
    },
    {
      title: "Platinum",
      description: "A prestigious plan offering significant leverage and perks",
      commission: "2",
      minDeposit: "25 000",
      leverage: "1:60",
      disabledFrom: 8,
    },
    {
      title: "Advanced",
      description: "An improved option for an experienced trader",
      commission: "1",
      minDeposit: "50 000",
      leverage: "1:75",
      disabledFrom: 9,
    },
    {
      title: "Professional",
      description:
        "An option with all the bonuses and privileges for a real VIP trader",
      commission: "0.5",
      minDeposit: "100 000",
      leverage: "1:100",
    },
  ];

  return (
    <section className="w-full my-32">
      <div className="mb-10">
        <h3 className="font-bold text-center">
          <span className="text-3xl max-sm:text-[6vw]">Check out our</span>
          <br />
          <span className="text-6xl max-sm:text-[8vw] text-gradient-animated bg-linear-to-r from-accent via-green-400 to-accent">
            account tiers
          </span>
        </h3>
      </div>

      <div className="flex items-center gap-4">
        <Button
          aria-label="Prev Button"
          onClick={scrollPrev}
          className="max-sm:hidden cursor-pointer p-2 rounded-full hover:bg-white/10 transition disabled:opacity-25"
          isDisabled={isPrevDisabled}
        >
          <ChevronLeft />
        </Button>
        <div
          className="overflow-hidden w-full mask-x-from-90% sm:mask-x-from-70%"
          ref={emblaRef}
        >
          <div className="grid grid-flow-col grid-rows-1 gap-3 py-10">
            {tiers.map((tier, i) => (
              <Tier
                key={tier.title}
                title={tier.title}
                index={i}
                selectedIndex={selectedIndex}
                description={tier.description}
                spotStocksCount={tier.spotStocksCount}
                commission={tier.commission}
                minDeposit={tier.minDeposit}
                leverage={tier.leverage}
                disabledFrom={tier.disabledFrom}
              />
            ))}
          </div>
        </div>
        <Button
          aria-label="Next Button"
          onClick={scrollNext}
          className="max-sm:hidden cursor-pointer p-2 rounded-full hover:bg-white/10 transition disabled:opacity-25"
          isDisabled={isNextDisabled}
        >
          <ChevronRight />
        </Button>
      </div>
      <div className="flex gap-2 justify-center mt-6">
        {tiers.map((tier, i) => (
          <Button
            key={tier.title}
            aria-label="Dot Button"
            onClick={() => emblaApi?.scrollTo(i)}
            className={cls(
              "cursor-pointer h-1.5 w-4 rounded-full",
              selectedIndex === i ? "bg-white" : "bg-white/20",
            )}
          />
        ))}
      </div>
    </section>
  );
}
