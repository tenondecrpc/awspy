// Google Analytics 4 through the Google tag (gtag.js), per ADR 0010.
//
// Both scripts use `afterInteractive`: Next.js injects them after hydration,
// so they never sit on the path to the largest contentful paint (FR-033).
// GA4's enhanced measurement records the App Router's client-side navigations
// from the History API, so no route listener is needed here.
//
// Google signals and ad personalization stay off: the privacy notice discloses
// audience measurement only.
//
// `measurementId` must come from `getGaMeasurementId`, which restricts it to
// `G-` plus uppercase letters and digits before it reaches the inline script.

import Script from "next/script";

type GoogleAnalyticsProps = {
  measurementId: string;
};

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const configScript = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config",${JSON.stringify(
    measurementId
  )},{allow_google_signals:false,allow_ad_personalization_signals:false});`;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
          measurementId
        )}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {configScript}
      </Script>
    </>
  );
}
