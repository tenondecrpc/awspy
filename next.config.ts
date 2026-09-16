import type { NextConfig } from "next";
import { REMOTE_IMAGE_HOSTS } from "./lib/config/image-hosts";

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
    // AVIF first (roughly 20% smaller than WebP), WebP for the browsers that
    // do not take it, original format as the last fallback. Both variants are
    // cached separately by the optimizer.
    formats: ["image/avif", "image/webp"],
    remotePatterns: REMOTE_IMAGE_HOSTS.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },
};

export default nextConfig;
