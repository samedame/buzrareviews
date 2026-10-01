import type { Metadata } from "next";
import { Libre_Franklin, Atkinson_Hyperlegible_Next } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    template: `%s | ${site.name}`,
    default: `${site.name}: Google reviews for local businesses`,
  },
  description:
    "Ask every customer for a Google review and answer every review in your voice. Review request emails and drafted replies, $29 a month, no contract.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${libreFranklin.variable} ${atkinson.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
