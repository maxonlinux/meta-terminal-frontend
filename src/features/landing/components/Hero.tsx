"use client";

import { ChevronsDown } from "lucide-react";
import Link from "next/link";
import AssetBackground from "@/components/common/AssetBackground";
import { useEnv } from "@/env/provider";
import { useAssets } from "@/features/assets/hooks/useAssets";
import LoginButton from "./LoginButton";

const SvgOrange = () => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Decorative orange icon</title>
      <rect
        width="24"
        height="24"
        rx="8"
        fill="url(#paint0_linear_15677_39406)"
      ></rect>
      <mask
        id="mask0_15677_39406"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <rect width="24" height="24" rx="8" fill="#FF8933"></rect>
      </mask>
      <g mask="url(#mask0_15677_39406)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-1 40C7.28427 40 14 33.2843 14 25C14 16.7157 7.28427 10 -1 10C-9.28427 10 -16 16.7157 -16 25C-16 33.2843 -9.28427 40 -1 40ZM-1 35C4.52285 35 9 30.5228 9 25C9 19.4772 4.52285 15 -1 15C-6.52285 15 -11 19.4772 -11 25C-11 30.5228 -6.52285 35 -1 35Z"
          fill="#0F0D19"
        ></path>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M28 18C40.1503 18 50 8.15026 50 -4C50 -16.1503 40.1503 -26 28 -26C15.8497 -26 6 -16.1503 6 -4C6 8.15026 15.8497 18 28 18ZM28 13.3333C37.5729 13.3333 45.3333 5.5729 45.3333 -4.00003C45.3333 -13.573 37.5729 -21.3334 28 -21.3334C18.427 -21.3334 10.6666 -13.573 10.6666 -4.00003C10.6666 5.5729 18.427 13.3333 28 13.3333Z"
          fill="#0F0D19"
        ></path>
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_15677_39406"
          x1="12"
          y1="0"
          x2="12"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF8933"></stop>
          <stop offset="1" stopColor="#FF5A33"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
};

const SvgPurple = () => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Decorative purple icon</title>
      <rect
        width="24"
        height="24"
        rx="8"
        fill="url(#paint0_linear_16376_45716)"
      ></rect>
      <mask
        id="mask0_16376_45716"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <rect width="24" height="24" rx="8" fill="#D99BFF"></rect>
      </mask>
      <g mask="url(#mask0_16376_45716)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-2.5 1L12.2224 9.5C15.0922 11.1569 16.0754 14.8264 14.4186 17.6962L4.91858 34.1506L-15 22.6506L-2.5 1Z"
          fill="#0F0D19"
        ></path>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-1.03613 6.46484L9.35617 12.4648C10.7911 13.2933 11.2827 15.128 10.4542 16.5629L3.45425 28.6873L-9.53613 21.1873L-1.03613 6.46484Z"
          fill="#9A3EFD"
        ></path>
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_16376_45716"
          x1="-1.5"
          y1="16.5"
          x2="24"
          y2="1.11759e-07"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7E3AFE"></stop>
          <stop offset="1" stopColor="#CC36FB"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
};

const SvgBlue = () => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Decorative blue icon</title>
      <rect
        width="24"
        height="24"
        rx="8"
        fill="url(#paint0_linear_21567_5995)"
      ></rect>
      <mask
        id="mask0_21567_5995"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <rect width="24" height="24" rx="8" fill="#D99BFF"></rect>
      </mask>
      <g mask="url(#mask0_21567_5995)">
        <path
          d="M17.9429 -6.97177L11.2665 6.46051C10.2832 8.43876 7.88245 9.24535 5.9042 8.26209L-9.31905 0.695536L-0.86232 -16.3187L17.9429 -6.97177Z"
          stroke="#0F0D19"
          strokeWidth="4"
        ></path>
        <path
          d="M31.9865 26.4945L20.8088 16.4915C19.1626 15.0183 16.6338 15.1586 15.1606 16.8048L3.8239 29.4728L17.9823 42.1432L31.9865 26.4945Z"
          stroke="#0F0D19"
          strokeWidth="4"
        ></path>
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_21567_5995"
          x1="12.8571"
          y1="24"
          x2="12.8571"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0C5DFD"></stop>
          <stop offset="1" stopColor="#00A5F8"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
};

const Hero = ({
  authButtonsRef,
}: {
  authButtonsRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const env = useEnv();

  const { assets } = useAssets();

  const yearFounded = +env.YEAR_FOUNDED;
  const yearsOnMarket = new Date().getFullYear() - yearFounded;

  return (
    <section className="relative flex items-center max-w-7xl mx-auto">
      {/* <div className="absolute flex left-0 top-0 justify-center w-full h-full">
        <img
          src="/landing/bg-small.png" // image for smaller screens
          alt="background"
          className="absolute object-top top-0 left-0 w-full h-auto pointer-events-none object-cover opacity-50
          md:hidden"
        />
        <img
          src="/landing/bg-big.jpg" // image for larger screens
          alt="background"
          className="absolute object-right top-0 left-0 w-full h-full pointer-events-none object-cover
          max-md:hidden"
        />
      </div> */}
      {assets && (
        <div className="absolute inset-0 overflow-hidden opacity-80 mask-y-from-50% mask-x-from-50%">
          <AssetBackground
            sizeMax={64}
            sizeMin={32}
            density={0.0002}
            assets={assets}
          />
        </div>
      )}
      <div
        className="relative mx-auto w-full max-w-7xl max-h-screen flex flex-col gap-20 justify-center px-10 max-sm:px-4 h-300
      max-lg:h-250"
      >
        <div className="flex absolute w-full justify-center bottom-0 mb-10">
          <ChevronsDown size={30} className="animate-bounce opacity-80" />
        </div>
        <div className="flex max-sm:hidden">
          <div className="relative mb-8 flex items-center gap-3 rounded-full px-3 py-1 text-sm leading-6 text-gray-100 ring-1 hover:ring-gray-300/20 ring-gray-100/20 backdrop-blur-sm">
            Trading portal to world markets!
            <Link
              href="/assets?modal=replenish"
              className="font-semibold text-landing-secondary whitespace-nowrap"
            >
              <span className="absolute inset-0" aria-hidden="true"></span>
              Make a deposit <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
        <div
          className="relative z-10 flex flex-col
      max-sm:items-center max-sm:mt-20"
        >
          <h1
            className="max-w-4xl text-[90px] font-extrabold tracking-normal leading-none
        max-lg:max-w-2xl max-lg:text-[50px]
        max-sm:max-w-sm max-sm:text-3xl max-sm:text-center"
          >
            Trade US stocks and crypto
          </h1>
          <h2
            className="mt-6 text-xl leading-8 max-w-xl text-white/80
        max-lg:max-w-sm max-lg:text-lg
        max-sm:max-w-80 max-sm:text-base max-sm:text-center"
          >
            Join us today and start trading assets on our innovative platform
            Don&apos;t miss your opportunity to achieve financial success.
          </h2>
          <div
            className="mt-10 flex w-full gap-4 sm:gap-6 mx-auto
          max-sm:justify-center"
            ref={authButtonsRef}
          >
            <LoginButton className="rounded-xl bg-white/5 border border-white/10 text-white backdrop-blur-xl px-10 py-3 font-bold hover:border-white/20 hover:bg-accent transition-colors" />
          </div>
        </div>
        <div className="flex gap-10 items-start max-sm:mx-auto max-sm:gap-4">
          <div className="flex gap-4 items-center text-center text-xs max-md:max-w-22 max-md:flex-col">
            <SvgOrange />
            {yearsOnMarket} years on market
          </div>
          <div className="flex gap-4 items-center text-center text-xs max-md:max-w-17.5 max-md:flex-col">
            <SvgPurple />
            Over 200,000 users
          </div>
          <div className="flex gap-4 items-center text-center text-xs max-md:max-w-22 max-md:flex-col">
            <SvgBlue />
            Trading volume $8B+/mth
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
