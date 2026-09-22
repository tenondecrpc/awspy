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
      {
        // Amplify serves unhashed files out of `public/` with `max-age=5`, so
        // the marquee icons, the logos and the photo sources are refetched on
        // essentially every navigation. A week of freshness plus a month of
        // stale-while-revalidate keeps them on the CDN without making them
        // immutable: a file replaced in place is picked up on the next
        // revalidation instead of being pinned for a year.
        //
        // Amplify ignores this block for the files it serves directly, so
        // `customHttp.yml` carries the same value for that host. This one is
        // the portable copy and applies anywhere else.
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=2592000",
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
    // Capped at the widest source in `public/assets`, so no rung re-encodes the
    // same pixels: the default 3840 spent about 6s of optimizer time on a cold
    // CDN entry to hand back output identical to a smaller width. 2400 is the
    // top rung because the hero paints 1172 CSS px on a desktop, which is 2344
    // device pixels at 2x; below it the ladder stays coarse so CDN hits
    // concentrate instead of fragmenting.
    deviceSizes: [640, 828, 1080, 1200, 1440, 1920, 2400],
    // `imageSizes` is appended to every srcset that carries a `sizes` prop.
    // The smallest slot in the UI is the 96px avatar, so the 32/48/64 rungs
    // only ever pad the markup.
    imageSizes: [96, 128, 256, 384],
    // Left at the default. Dropping the photo frames to q60 was tried and
    // reverted: the hero renders about 1:1 against the 1200px entry on a
    // non-retina desktop, so nothing downscales the artifacts away, and the
    // two encoders in play disagree about what the number means — sharp
    // locally produced 49 kB where Amplify's produced 65 kB for the same q60,
    // and the local one visibly waxed over faces and hair.
    qualities: [75],
    // The 4-hour default left most visitors landing on a cold CloudFront POP,
    // where they wait out the AVIF encode (1.3s-6s) instead of getting a cache
    // hit (~0.1s). A month amortises the encode. There is no invalidation API
    // for the optimizer cache, so a photo replaced in place is only picked up
    // once the TTL lapses unless the filename changes with it.
    minimumCacheTTL: 2678400, // 31 days
    remotePatterns: REMOTE_IMAGE_HOSTS.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },
};

export default nextConfig;
