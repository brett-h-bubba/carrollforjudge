import Script from "next/script";

/**
 * GA4 tracking. Only renders when NEXT_PUBLIC_GA_MEASUREMENT_ID is set
 * (e.g. "G-XXXXXXXXXX"), so dev/preview stays clean.
 *
 * Conversion events are fired from client components via:
 *   window.gtag?.("event", "donate_click", { ... });
 * See src/lib/analytics.ts for typed helpers.
 */
export default function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${id}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
