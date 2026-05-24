// Dynamic Open Graph image for the home page (1200x630). Reads the current
// edition's metadata to keep the image in sync with content edits (FR-028).
//
// Edge runtime + `next/og` ImageResponse renders this at build time as a
// static asset. No external dependencies; works the same on AWS Amplify,
// Vercel, or any Next.js-compatible host.
//
// Note on color literals: Satori (the engine that renders this image) does
// not resolve CSS custom properties because the output is a PNG, not an HTML
// document. The palette tokens declared in `app/globals.css` are unreachable
// at this layer. The hex values below are intentionally synchronized with the
// palette: #0B1626 == --color-surface-inverse, #FF9900 == --color-action,
// #001022 == --color-text-on-action, #FFFFFF == --color-text-on-hero. If the
// palette changes, update both this file and `app/globals.css`.

/* eslint-disable local/no-color-literals */
import { ImageResponse } from "next/og";
import { currentEdition, getEdition } from "@/lib/content/editions";
import { formatDate } from "@/lib/utils/datetime";

export const size = { width: 1200, height: 630 } as const;
export const contentType = "image/png";
export const alt = "AWS Community Day Paraguay";

export default function OpengraphImage() {
  const year = currentEdition();
  const { eventInfo } = getEdition(year);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "linear-gradient(135deg, #0B1626 0%, #003FB3 60%, #0B5FFF 100%)",
          color: "#FFFFFF",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              fontSize: 28,
              fontWeight: 800,
              background: "#FF9900",
              color: "#001022",
              padding: "6px 16px",
              borderRadius: 12,
            }}
          >
            {year}
          </span>
          <span style={{ fontSize: 28, fontWeight: 600, opacity: 0.85 }}>
            AWS Community Day Paraguay
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <h1
            style={{
              fontSize: 88,
              lineHeight: 1.05,
              fontWeight: 800,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            {eventInfo.ogImageTitle ?? eventInfo.heroTitle}
          </h1>
          <p style={{ fontSize: 32, margin: 0, opacity: 0.92 }}>
            {formatDate(eventInfo.dates.start)} - {eventInfo.location.summary}
          </p>
        </div>

        <p style={{ fontSize: 24, margin: 0, opacity: 0.7 }}>
          awspy.com
        </p>
      </div>
    ),
    size
  );
}
