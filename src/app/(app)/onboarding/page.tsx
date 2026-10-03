import type { Metadata } from "next";
import { pageMetadata } from "@/config/metadata";
import { OnboardingClient } from "./OnboardingClient";

export const metadata: Metadata = pageMetadata({
  title: "Find your business",
  description: "Search for your business on Google to get started with BuzraReviews.",
  noindex: true,
});

export default function OnboardingPage() {
  return <OnboardingClient />;
}
