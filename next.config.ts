import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Project AI guidance is maintained under .ai/ with a minimal root loader.
  agentRules: false,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
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

export default nextConfig;
