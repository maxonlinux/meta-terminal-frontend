import { BadgeHelp, LockKeyhole } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { getEnv } from "@/env/env";
import AssetBackgroundWrapper from "@/features/auth/components/AssetBackgroundWrapper";
import { cls } from "@/utils/general.utils";

const texts = [
  {
    title: "CONVENIENT TRADING PLATFORM",
    text: "Get real-time market data",
  },
  {
    title: "RELIABLE SECURITY SYSTEM",
    text: "We securely store your assets in cold wallets for maximum protection",
  },
  {
    title: "PROMPT ASSISTANCE",
    text: "Our multilingual support service is ready to answer your questions 24/7",
  },
];

export default async function Layout({ children }: { children: ReactNode }) {
  const env = await getEnv();

  return (
    <div className="h-dvh flex flex-col justify-between">
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          style={{
            paddingTop: "env(safe-area-inset-top)",
            paddingRight: "env(safe-area-inset-right)",
            paddingLeft: "env(safe-area-inset-left)",
          }}
        >
          <nav
            className="flex w-full items-center gap-4 py-4 px-4"
            aria-label="Global"
          >
            <div className="rounded-full shrink-0 px-4 backdrop-blur-xs overflow-hidden border border-white/10">
              <Link
                href="/"
                className="inline-flex items-center h-10 text-gradient-animated bg-linear-to-r from-accent via-green-400 to-accent"
              >
                <span className="sr-only">{env.SITE_NAME}</span>
                <span className="w-auto text-accent font-extrabold">
                  {env.SITE_NAME}
                </span>
              </Link>
            </div>
            <div className="ml-auto h-10 flex items-center gap-4 rounded-full px-4 backdrop-blur-xs overflow-hidden border border-white/10">
              <Link
                href={env.SUPPORT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm leading-6 font-semibold"
              >
                Help <BadgeHelp size={16} />
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <div className="grid grid-cols-[auto_auto] h-full overflow-y-scroll max-md:grid-cols-[auto]">
        <div
          className={cls(
            "flex flex-col justify-center w-full h-full p-20 mx-auto",
            "max-md:px-8 max-md:max-w-md",
            "md:max-w-lg",
          )}
        >
          {children}
        </div>

        <div className="relative flex items-center justify-center max-md:hidden">
          <AssetBackgroundWrapper />
          <div className="divide-y divide-white/10 p-20 max-md:px-12 max-md:pt-0 max-sm:px-8">
            {texts.map((text, i) => (
              <div key={text.title} className="py-4">
                <div className="flex gap-4 items-center mb-4">
                  <div className="flex shrink-0 items-center justify-center font-bold h-12 w-12 rounded-full border border-white/10">
                    {i + 1}
                  </div>
                  <div className="font-semibold">{text.title}</div>
                </div>
                <div className="text-sm">{text.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <footer
        className="fixed bottom-0 inset-x-0"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom) - 10px)",
          paddingRight: "env(safe-area-inset-right)",
          paddingLeft: "env(safe-area-inset-left)",
        }}
      >
        <div className="flex flex-col items-center p-2">
          <div className="flex items-center gap-2 text-xs">
            <LockKeyhole className="text-green-400" size={12} />
            <span className="opacity-50">Connection secure</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
