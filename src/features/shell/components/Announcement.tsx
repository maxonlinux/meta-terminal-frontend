"use client";

import { ExternalLink, Sparkles, X } from "lucide-react";
import { useState } from "react";

type Announcement = {
  text: string;
  link: string;
};

const Announcement = () => {
  const [isClosed, setIsClosed] = useState(false);
  const announcement = {
    text: "BTCUSD, ETHUSD and ETHUSD to be DELISTED effective 10/21/2025. Please use USDT pairs instead.",
    link: "https://google.com",
  };

  if (isClosed) {
    return null;
  }

  return (
    <div className="fixed z-50 top-0 right-0 m-4">
      <div className="relative flex flex-col rounded-md py-2 px-3 w-full bg-accent text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1 font-bold text-sm">
            <Sparkles size={14} /> Announcement
          </span>
          <button
            type="button"
            className="flex items-center justify-center cursor-pointer"
            onClick={() => {
              setIsClosed(true);
            }}
          >
            <span className="text-xs">
              <X size={14} />
            </span>
          </button>
        </div>
        <p className="text-sm">{announcement.text}</p>
        <a
          className="text-sm underline underline-offset-2"
          target="_blank"
          href={announcement.link}
          rel="noreferrer"
        >
          Learn more <ExternalLink className="inline-block mr-1" size={14} />
        </a>
      </div>
    </div>
  );
};

export default Announcement;
