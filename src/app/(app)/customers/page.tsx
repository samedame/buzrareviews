import type { Metadata } from "next";
import { pageMetadata } from "@/config/metadata";
import { CustomersClient } from "./CustomersClient";

export const metadata: Metadata = pageMetadata({
  title: "Your customers",
  description: "Add a customer and send them a review request.",
  noindex: true,
});

export default function CustomersPage() {
  return <CustomersClient />;
}
