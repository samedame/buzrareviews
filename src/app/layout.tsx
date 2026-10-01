import type { Metadata, Viewport } from "next";
import { Libre_Franklin, Atkinson_Hyperlegible_Next } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { site } from "@/config/site";
import "./globals.css";

const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  subsets: ["latin"],
  weight: "variable",
});

const atkinson = Atkinson_Hyperlegible_Next({
  variable: "--font-atkinson",
  subsets: ["latin"],
  weight: "variable",
});

// Exported so the home page (src/app/(marketing)/page.tsx) can build its own
// metadata from the exact same strings -- its `metadata` export otherwise
// shallow-replaces everything below for that route, including the parts
// (openGraph, twitter) that would silently vanish if it set its own without
// repeating these.
export const DEFAULT_TITLE = `${site.name}: Google reviews for local businesses`;
export const DEFAULT_DESCRIPTION =
  "Ask every customer for a Google review and answer every review in your voice. Review request emails and drafted replies, $29 a month, no contract.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    template: `%s | ${site.name}`,
    default: DEFAULT_TITLE,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: site.url,
    siteName: site.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

// Light theme only (DESIGN.md: no prefers-color-scheme: dark block), so a
// single theme-color is correct here -- it matches the paper background
// at the very top of the page (the sticky header), the same value the
// browser chrome / status bar should take on mobile.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${libreFranklin.variable} ${atkinson.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {process.env.VERCEL === "1" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
