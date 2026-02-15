"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEnv } from "@/env/provider";

export default function LandingFooter() {
  const env = useEnv();

  const siteName = env.SITE_NAME;
  const yearFounded = env.YEAR_FOUNDED;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col w-full px-6 max-sm:px-4">
      <div
        className="flex gap-10 py-6 justify-between items-end
        max-md:flex-col max-md:gap-8 max-md:items-start"
      >
        {/* <p className="opacity-50 text-xs">{t("footer.text", { siteName })}</p> */}
        <div>
          <nav>
            {/* <span className="block font-bold mb-3 text-sm">LEGAL</span> */}
            <ul
              className="flex gap-4 text-xs text-blue-600 underline
            max-md:flex-wrap"
            >
              <li>
                <Link href="/legal/agreement">
                  <ExternalLink className="inline-block mr-1" size={12} />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy">
                  <ExternalLink className="inline-block mr-1" size={12} />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/aml">
                  <ExternalLink className="inline-block mr-1" size={12} />
                  AML Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/risk">
                  <ExternalLink className="inline-block mr-1" size={12} />
                  Risk Statement
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="text-xxs">
          Copyright ©{yearFounded} - {currentYear} {siteName}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
