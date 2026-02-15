"use client";

import { ArrowRight } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import Link from "next/link";
import { useEnv } from "@/env/provider";
import { cls } from "@/utils/general.utils";

export default function LandingHeader() {
  const env = useEnv();

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <header className="fixed inset-x-0 top-0 z-50 max-w-7xl mx-auto">
      <motion.div
        className="absolute z-50 inset-0 bg-white w-full origin-left h-0.5"
        style={{ scaleX }}
      />
      <div
        className=""
        style={{
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        <nav className="flex w-full gap-4 py-4 px-4" aria-label="Global">
          <div className="rounded-full px-4 backdrop-blur-xs overflow-hidden border border-white/10">
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
          <div className="ml-auto flex items-center gap-4 rounded-full px-4 backdrop-blur-xs overflow-hidden border border-white/10">
            <div className="flex gap-4 items-center">
              <Link
                href="/trade"
                className={cls(
                  "flex items-center gap-2 w-full text-sm font-semibold leading-6",
                )}
              >
                Trade <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
