"use client";

import { memo, useEffect, useRef } from "react";

const symbols = [
  {
    title: "",
    proName: "BTCUSD",
  },
  {
    title: "",
    proName: "AAPL",
  },
  {
    title: "",
    proName: "ETHUSD",
  },
  {
    title: "",
    proName: "TSLA",
  },
  {
    title: "",
    proName: "MSFT",
  },
  {
    title: "",
    proName: "NVDA",
  },
  {
    title: "",
    proName: "ABNB",
  },
  {
    title: "",
    proName: "META",
  },
];

const TickerTape = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const type = "text/javascript";
  const scriptSRC =
    "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";

  useEffect(() => {
    if (!ref.current) return;

    const current = ref.current;

    const options = {
      symbols,
      showSymbolLogo: false,
      largeChartUrl: `${window.location.origin}/tw`,
      isTransparent: true,
      displayMode: "regular",
      colorTheme: "dark",
      locale: "en",
    };

    const script = document.createElement("script");
    script.innerHTML = JSON.stringify(options);
    script.src = scriptSRC;
    script.type = type;
    script.async = true;

    if (!current.hasChildNodes()) {
      current.appendChild(script);
    }

    return () => {
      if (current?.querySelector("div")) {
        current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="rounded-xs overflow-hidden">
      <div className=" -mr-10" ref={ref} />
    </div>
  );
};

export default memo(TickerTape);
