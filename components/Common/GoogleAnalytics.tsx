import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const AW_ID = process.env.NEXT_PUBLIC_AW_ID;

export default function GoogleAnalytics() {
  if (!GA_ID) return null;

  const configs = [
    `gtag('config', '${GA_ID}');`,
    AW_ID ? `gtag('config', '${AW_ID}');` : "",
  ].filter(Boolean).join("\n          ");

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${configs}
        `}
      </Script>
    </>
  );
}
