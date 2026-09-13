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

// The header theme toggle was removed to match the light-first "colored"
// mockups, so the site is light-only: `data-theme="light"` is set statically
// on <html> below. The dark tokens and the ThemeToggle atom remain in the
// codebase, so re-enabling dual themes later is a small change (re-add the
// toggle and a localStorage-aware init script).

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
    <html lang="es-PY" data-theme="light">
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
