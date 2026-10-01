import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { VERTICAL_SLUGS } from "@/content/verticals";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/pricing", "/setup", "/privacy", "/terms"];
  const verticalRoutes = VERTICAL_SLUGS.map((slug) => `/for/${slug}`);

  return [...staticRoutes, ...verticalRoutes].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));
}
