import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next, Young_Serif } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/organisms/SiteHeader";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { KiroMascot } from "@/components/organisms/KiroMascot";
import { GoogleAnalytics } from "@/components/atoms/GoogleAnalytics";
import { currentEdition } from "@/lib/content/editions";
import { getEventInfo } from "@/lib/content/event-info";
import { getFAQ } from "@/lib/content/faq";
import { getSiteUrl } from "@/lib/utils/seo";
import { getGaMeasurementId } from "@/lib/config/analytics";
import { THEME_STORAGE_KEY } from "@/lib/theme";

// Headlines: a single-weight old-style serif with some warmth. Body: a face
// designed for legibility. Neither is the framework default.
const displayFont = Young_Serif({
  variable: "--font-display-next",
  subsets: ["latin"],
  weight: "400",
});

const bodyFont = Atkinson_Hyperlegible_Next({
  variable: "--font-body-next",
  subsets: ["latin"],
  fallback: ["Arial", "sans-serif"],
  adjustFontFallback: false,
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
  // Unset outside production, so local and E2E builds load no analytics.
  const gaMeasurementId = getGaMeasurementId();

  return (
    // The font variables sit on <html>, not <body>: the theme tokens in
    // globals.css (`--font-sans`, `--font-display`) are declared on :root and
    // reference them, so they must be defined at that level or the whole
    // declaration is invalid and the page falls back to the system font.
    <html
      lang="es-PY"
      data-theme="light"
      className={`${displayFont.variable} ${bodyFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      {/* Browser extensions (e.g. ColorZilla's `cz-shortcut-listen`) add
          attributes to <body> before React hydrates; that is not a mismatch we
          can fix, so the warning is silenced here only. */}
      <body suppressHydrationWarning>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter
          eventInfo={eventInfo}
          analyticsEnabled={gaMeasurementId !== null}
        />
        <KiroMascot faq={faq} />
        {gaMeasurementId && <GoogleAnalytics measurementId={gaMeasurementId} />}
      </body>
    </html>
  );
}
