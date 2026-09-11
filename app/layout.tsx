import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/organisms/SiteHeader";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { Mascot } from "@/components/atoms/Mascot";
import { currentEdition } from "@/lib/content/editions";
import { getEventInfo } from "@/lib/content/event-info";
import { getSiteUrl } from "@/lib/utils/seo";
import { THEME_STORAGE_KEY } from "@/lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "AWS Community Day Paraguay",
  description:
    "La primera edición del AWS Community Day en Paraguay: charlas, talleres y networking organizados por la comunidad AWS local.",
};

// Dark is the default look of the event, not a follow-the-OS decision: the
// vivid red and blue were tuned against the midnight surfaces, and that is
// the face the Community Day family presents. A stored choice still wins, and
// the header toggle still switches both ways. Without JavaScript the CSS
// falls back to `prefers-color-scheme`.
const themeInitScript = `(()=>{try{const stored=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});const theme=stored==="light"||stored==="dark"?stored:"dark";document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme}catch{}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The header and footer are rendered server-side using the current
  // edition's event info, so every page has consistent chrome regardless
  // of which route inside the app loads.
  const editionYear = currentEdition();
  const eventInfo = getEventInfo(editionYear);

  return (
    <html lang="es-PY" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SiteHeader editionYear={editionYear} />
        <main>{children}</main>
        <SiteFooter eventInfo={eventInfo} />
        <Mascot />
      </body>
    </html>
  );
}
