import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { getEnv } from "@/env/env";
import { EnvProvider } from "@/env/provider";
import OtpModal from "@/features/trading/components/landing/OtpModal";
import "./globals.css";
import { IBM_Plex_Sans } from "next/font/google";
import { Toast } from "@/components/ui/Toast";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const env = await getEnv();
  return {
    title: env.SITE_NAME,
    description: "Trade US stocks and crypto",
    openGraph: {
      title: env.SITE_NAME,
      description: "Trade US stocks and crypto",
      url: "https://flagcdn.com/us.svg",
      siteName: env.SITE_NAME,
      images: [
        {
          url: "https://flagcdn.com/us.svg",
          width: 1200,
          height: 630,
          alt: "Preview",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: env.SITE_NAME,
      description: "Trade US stocks and crypto",
      images: ["https://flagcdn.com/us.svg"],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const env = await getEnv();

  return (
    <html lang="en">
      <body className={`${ibmPlexSans.variable} antialiased dark`}>
        <EnvProvider env={env}>
          <Toast />
          <NuqsAdapter>
            <OtpModal />
            {children}
          </NuqsAdapter>
        </EnvProvider>
      </body>
    </html>
  );
}
