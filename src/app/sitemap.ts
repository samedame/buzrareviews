import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { VERTICAL_SLUGS } from "@/content/verticals";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/pricing", "/setup", "/privacy", "/terms"];
  const verticalRoutes = VERTICAL_SLUGS
    // Dental stays reachable by direct link but is left out of the sitemap
    // while site.showHealthcare is false (issue 7).
    .filter((slug) => site.showHealthcare || slug !== "dental")
    .map((slug) => `/for/${slug}`);

  return [...staticRoutes, ...verticalRoutes].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));
}
