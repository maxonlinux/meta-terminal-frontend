"use client";

import { memo, useEffect, useRef, useState } from "react";

const MOB_HEADER_OFFSET = 92;
const HEADER_OFFSET = 55;
const BREAKPOINT = 347;
const LOCALE = "en";

const News = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  const [headerHeight, setHeaderHeight] = useState(0);
  const [headerOffset, setHeaderOffset] = useState(HEADER_OFFSET);

  const type = "text/javascript";
  const scriptSRC =
    "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";

  useEffect(() => {
    const updateOffsets = () => {
      if (ref.current && headerRef.current) {
        setHeaderHeight(headerRef.current.clientHeight);
        const width = ref.current.clientWidth;
        setHeaderOffset(width > BREAKPOINT ? HEADER_OFFSET : MOB_HEADER_OFFSET);
      }
    };

    updateOffsets();

    const observer = new ResizeObserver(updateOffsets);
    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const options = {
      feedMode: "all_symbols",
      // feedMode: "symbol",
      // symbol: symbol,
      isTransparent: true,
      displayMode: "regular",
      width: "100%",
      height: "100%",
      colorTheme: "dark",
      locale: LOCALE,
    };

    const current = ref.current;

    const script = document.createElement("script");
    script.innerHTML = JSON.stringify(options);
    script.src = scriptSRC;
    script.type = type;
    script.async = true;

    current?.appendChild(script);

    return () => {
      if (current?.querySelector("div")) {
        current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="size-full border border-white/10 overflow-y-hidden rounded-xs divide-y divide-white/10 bg-secondary-background">
      <div
        ref={headerRef}
        className="relative z-10 flex justify-between items-center p-2 bg-secondary-background border-b border-white/10"
      >
        <span className="text-[12px] font-semibold">NEWS</span>
      </div>
      <div className="relative size-full">
        <div
          ref={ref}
          className="absolute inset-0 w-full"
          style={{
            height: `calc(100% + ${headerOffset - headerHeight}px)`,
            marginTop: -headerOffset,
          }}
        />
      </div>
    </div>
  );
};

export default memo(News);
