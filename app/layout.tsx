import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/organisms/SiteHeader";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { KiroMascot } from "@/components/organisms/KiroMascot";
// Disabled: the rectangular photo mascot fought the shaded Kiro ghost for the
// same bottom-right corner. Keep the import commented so the ghost stands alone.
// import { Mascot } from "@/components/atoms/Mascot";
import { currentEdition } from "@/lib/content/editions";
import { getEventInfo } from "@/lib/content/event-info";
import { getFAQ } from "@/lib/content/faq";
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

// Light is the default look of the site: the redesigned pages were tuned
// against the light surfaces, and a dark OS setting no longer flips the site
// on its own. A choice stored by the header toggle still wins, and the toggle
// switches both ways. Without JavaScript the CSS base palette renders light,
// which is exactly the default, so no fallback media query is needed.
const themeInitScript = `(()=>{try{const stored=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});const theme=stored==="light"||stored==="dark"?stored:"light";document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme}catch{document.documentElement.dataset.theme="light"}})();`;

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
  const faq = getFAQ(editionYear);

  return (
    <html lang="es-PY" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter eventInfo={eventInfo} />
        <KiroMascot faq={faq} />
        {/* Disabled so the shaded Kiro ghost owns the bottom-right corner. */}
        {/* <Mascot /> */}
      </body>
    </html>
  );
}
