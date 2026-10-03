import type { Metadata } from "next";
import { site } from "@/config/site";
import { alt as ogImageAlt, size as ogImageSize, contentType as ogImageType } from "@/app/opengraph-image";

// Fix pass 1, issue 4: every marketing page needs its own openGraph/twitter
// metadata (Next shallow-replaces nested metadata objects per-segment, so a
// page that sets nothing here silently inherits the home page's og:title,
// og:description, og:url, and Twitter tags verbatim -- confirmed in the
// installed Next 16 docs, node_modules/next/dist/docs/01-app/03-api-reference/
// 04-functions/generate-metadata.md, "Merging"/"Overwriting fields").
//
// og:title must equal what the browser tab actually shows, including the
// root layout's "%s | BuzraReviews" title template -- but that template only
// applies to the rendered <title> tag, not to openGraph.title/twitter.title,
// so this computes the same final string by hand. `absoluteTitle` is for the
// home page only: its title is the layout's own `default`, which the
// template does not suffix (there is no "%s" page title to substitute).
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  noindex = false,
}: {
  title: string;
  description: string;
  // Omit for routes with no single canonical URL (the 404 catch-all matches
  // any path) -- when absent, alternates.canonical and openGraph.url are
  // both skipped rather than pointing at a made-up or misleading path.
  path?: string;
  absoluteTitle?: boolean;
  noindex?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(path && { alternates: { canonical: path } }),
    openGraph: {
      title: fullTitle,
      description,
      ...(path && { url: path }),
      siteName: site.name,
      locale: "en_US",
      type: "website",
      // Setting a page-level `openGraph` object replaces the root layout's
      // entirely (confirmed empirically in Fix pass 1, and again here --
      // removing this and relying on the file-based convention alone
      // leaves every subpage with no og:image at all). Repeating the full
      // set of fields here, imported from opengraph-image.tsx's own
      // exports rather than duplicated as literals, so the two can't drift.
      images: [{ url: `${site.url}/opengraph-image`, ...ogImageSize, type: ogImageType, alt: ogImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [{ url: `${site.url}/opengraph-image`, ...ogImageSize, type: ogImageType, alt: ogImageAlt }],
    },
    ...(noindex && { robots: { index: false, follow: false } }),
  };
}
