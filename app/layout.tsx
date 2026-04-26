import type { Metadata } from "next";
import { DM_Mono, Instrument_Serif, Syne } from "next/font/google";

import "~/app/globals.css";
import { appUrl } from "~/lib/app-url";
import { CursorGlow } from "~/components/ui/CursorGlow";
import { Providers } from "~/components/ui/Providers";
import { RevealObserver } from "~/components/ui/RevealObserver";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-syne"
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-dm-mono"
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif"
});

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "SaveFlow",
  description: "Savings goals and expense tracking without complicated budgeting."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmMono.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <body>
        <Providers>
          <CursorGlow />
          <RevealObserver />
          <div className="orb orb-right" />
          <div className="orb orb-left" />
          <div className="page-shell">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
