import type { Metadata } from "next";
import { pageMetadata } from "@/config/metadata";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = pageMetadata({
  title: "Your dashboard",
  description: "Your reviews and drafted replies, in one place.",
  noindex: true,
});

export default function DashboardPage() {
  return <DashboardClient />;
}
