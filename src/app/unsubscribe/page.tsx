import type { Metadata } from "next";
import { pageMetadata } from "@/config/metadata";
import { UnsubscribeClient } from "./UnsubscribeClient";

export const metadata: Metadata = pageMetadata({
  title: "Stop review requests",
  description: "Unsubscribe from review request emails from this business.",
  noindex: true,
});

export default function UnsubscribePage() {
  return <UnsubscribeClient />;
}
