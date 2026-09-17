const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const AW_ID = process.env.NEXT_PUBLIC_AW_ID;

export default function GoogleAnalytics() {
  if (!AW_ID && !GA_ID) return null;

  // ใช้ AW_ID เป็น primary ใน src URL — Google Ads verification ต้องการเห็น AW ID ใน script src
  const primaryId = AW_ID || GA_ID!;

  const configLines = [
    AW_ID ? `gtag('config','${AW_ID}');` : '',
    GA_ID ? `gtag('config','${GA_ID}');` : '',
  ].filter(Boolean).join('');

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${configLines}`,
        }}
      />
    </>
  );
}
