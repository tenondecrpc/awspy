// Edition-aware, 1200x630 social card for messaging and social previews.
// The event logo and Asuncion skyline are local assets, so image generation
// remains deterministic at build time and does not depend on an external host.

/* eslint-disable local/no-color-literals */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { currentEdition, getEdition } from "@/lib/content/editions";

export const size = { width: 1200, height: 630 } as const;
export const contentType = "image/png";
export const alt = "AWS Community Day Paraguay: fecha y sede del evento";

export default async function OpengraphImage() {
  const year = currentEdition();
  const { eventInfo } = getEdition(year);
  const [logo, skyline] = await Promise.all([
    readFile(join(process.cwd(), "public/assets/logo.png")),
    readFile(join(process.cwd(), "public/assets/hero/skyline.jpg")),
  ]);
  const date = new Intl.DateTimeFormat("es-PY", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Asuncion",
  }).format(new Date(eventInfo.dates.start));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#01051D",
        color: "#FFFFFF",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 10,
          backgroundColor: "#FF9900",
        }}
      />
      <img
        src={`data:image/jpeg;base64,${skyline.toString("base64")}`}
        alt=""
        width={1200}
        height={235}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 1200,
          height: 235,
          objectFit: "cover",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 235,
          backgroundImage:
            "linear-gradient(180deg, #01051D 0%, #01051D80 45%, #01051DCC 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "52px 70px 45px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <img
            src={`data:image/png;base64,${logo.toString("base64")}`}
            alt=""
            width={330}
            height={92}
            style={{ width: 330, height: 92, objectFit: "contain" }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "2px solid #FF9900",
              borderRadius: 16,
              padding: "12px 18px",
              color: "#FF9900",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "0.06em",
            }}
          >
            ENTRADA GRATUITA
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              width: 86,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#FF9900",
              marginBottom: 22,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 1040,
              fontSize: 77,
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: "-0.035em",
            }}
          >
            <span>AWS Community Day</span>
            <span style={{ color: "#FF9900" }}>Paraguay {year}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 31, fontWeight: 700 }}>{date}</div>
          <div style={{ fontSize: 27, color: "#DCE4FF" }}>
            {eventInfo.location.summary}
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#C5CCEA",
              marginTop: 12,
              letterSpacing: "0.02em",
            }}
          >
            Charlas · Talleres · Comunidad
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 8,
          backgroundColor: "#F02F3B",
        }}
      />
    </div>,
    size
  );
}
