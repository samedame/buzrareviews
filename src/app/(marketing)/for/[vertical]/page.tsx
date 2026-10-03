import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VerticalPageTemplate } from "@/components/marketing/VerticalPageTemplate";
import { VERTICAL_PAGES, VERTICAL_SLUGS, type VerticalSlug } from "@/content/verticals";
import { site } from "@/config/site";
import { pageMetadata } from "@/config/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return VERTICAL_SLUGS.map((vertical) => ({ vertical }));
}

function getContent(vertical: string) {
  return VERTICAL_SLUGS.includes(vertical as VerticalSlug)
    ? VERTICAL_PAGES[vertical as VerticalSlug]
    : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vertical: string }>;
}): Promise<Metadata> {
  const { vertical } = await params;
  const content = getContent(vertical);
  if (!content) return {};

  return pageMetadata({
    title: content.metaTitle,
    description: content.metaDescription,
    path: `/for/${content.slug}`,
    // Dental stays reachable by direct link (per the showHealthcare flag's
    // own rules) but shouldn't be indexed or linked to from search/social
    // while the HIPAA question is unresolved.
    noindex: content.slug === "dental" && !site.showHealthcare,
  });
}

export default async function VerticalPage({ params }: { params: Promise<{ vertical: string }> }) {
  const { vertical } = await params;
  const content = getContent(vertical);
  if (!content) notFound();

  return <VerticalPageTemplate content={content} />;
}
