import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  // Allow MDX pages so we can co-locate the code-of-conduct content.
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    remotePatterns: [
      // Sessionize hosts speaker headshots under sessionize.com.
      { protocol: "https", hostname: "sessionize.com" },
      // Eventbrite-hosted images (event banners, organizer logos) come from
      // these two CDNs.
      { protocol: "https", hostname: "img.evbuc.com" },
      { protocol: "https", hostname: "cdn.evbuc.com" },
    ],
  },
};

export default withMDX(nextConfig);
