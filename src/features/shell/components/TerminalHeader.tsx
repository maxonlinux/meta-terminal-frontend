"use client";

import Link from "next/link";
import { useEnv } from "@/env/provider";
import TickerTape from "@/features/trading/components/terminal/TickerTape";
import { gilroy } from "@/fonts";
import { cls } from "@/utils/general.utils";
import { HeaderMenu } from "./HeaderMenu";

function TerminalHeader() {
  const env = useEnv();

  return (
    <header className="text-white p-2 pb-1 w-full max-w-495 mx-auto">
      <nav
        className="flex items-center justify-between gap-2"
        aria-label="Global"
      >
        <div className="flex px-2">
          <Link href="/">
            <span className="sr-only">{env.SITE_NAME}</span>
            <span
              className={cls(
                "h-10 w-auto text-accent font-black",
                gilroy.className,
              )}
            >
              {env.SITE_NAME}
            </span>
          </Link>
        </div>

        <div className="w-full mask-x-from-90% border border-white/10 rounded-xs">
          <TickerTape />
        </div>

        <div className="flex gap-4">
          <HeaderMenu />
        </div>
      </nav>
    </header>
  );
}

export default TerminalHeader;
