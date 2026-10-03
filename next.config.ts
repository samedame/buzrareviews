import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix pass 1, issue 2: /bozeman was renamed to /setup. Permanent redirect
  // so old links (printed material, bookmarks, search results) keep working.
  async redirects() {
    return [
      {
        source: "/bozeman",
        destination: "/setup",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
