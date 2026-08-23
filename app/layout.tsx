import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/organisms/SiteHeader";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { currentEdition } from "@/lib/content/editions";
import { getEventInfo } from "@/lib/content/event-info";
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
    <html lang="es-PY">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SiteHeader editionYear={editionYear} />
        <main>{children}</main>
        <SiteFooter eventInfo={eventInfo} />
      </body>
    </html>
  );
}
