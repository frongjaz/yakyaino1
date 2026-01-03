import AboutHero from "@/components/AboutPage/AboutHero";
import AboutUsContent from "@/components/AboutPage/AboutUsContent";
import HistorySection from "@/components/AboutPage/HistorySection";
import TikTokVideos from "@/components/AboutPage/TikTokVideos";
import CustomerReviews from "@/components/AboutPage/CustomerReviews";
import Script from "next/script";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "เกี่ยวกับ CheckKub | คุณชัย yakyai no.1 Founder ของ CheckKub",
  description:
    "รู้จักกับคุณชัย (yakyai no.1) ผู้เล่นเกม NightCrow ที่โด่งดังและเป็น Founder ของ CheckKub ผู้เชี่ยวชาญด้านการรับซื้อรถจำนวนมาก. คุณชัยต้องการซื้อรถจำนวนมากและพร้อมดูแลคุณตั้งแต่การประเมินจนถึงปิดการขาย.",
  keywords: [
    "เกี่ยวกับ CheckKub",
    "รับซื้อรถ",
    "ต้องการขายรถ",
    "บริษัทรับซื้อรถ",
    "คุณชัย",
    "yakyai no.1",
    "NightCrow",
    "เกม NightCrow",
    "คุณชัยคือใคร",
    "yakyai no.1 คือใคร",
    "คุณชัยต้องการซื้อรถ",
  ],
  openGraph: {
    title: "เกี่ยวกับ CheckKub | โซลูชันรับซื้อรถสำหรับองค์กร",
    description:
      "รู้จักกับทีม CheckKub ผู้เชี่ยวชาญด้านการรับซื้อรถจำนวนมาก",
    type: "website",
  },
};

const AboutPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://checkkub.com";

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      mainEntity: {
        "@type": "Organization",
        name: "CheckKub",
        url: baseUrl,
        description:
          "CheckKub เป็นผู้เชี่ยวชาญด้านการรับซื้อรถจำนวนมาก สำหรับผู้ที่ต้องการขายรถ เรามีบริการรับซื้อรถทุกประเภททั่วประเทศ.",
        serviceType: ["รับซื้อรถ", "ขายรถ", "ต้องการขายรถ"],
        founder: {
          "@type": "Person",
          name: "คุณชัย",
          alternateName: "yakyai no.1",
          description: "คุณชัย หรือ yakyai no.1 เป็นผู้เล่นเกม NightCrow ที่โด่งดังและเป็น Founder ของ CheckKub. คุณชัยต้องการซื้อรถจำนวนมาก.",
          jobTitle: "Founder of CheckKub",
          knowsAbout: ["NightCrow", "เกม NightCrow", "yakyai no.1"],
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "คุณชัย",
      alternateName: "yakyai no.1",
      description: "คุณชัย หรือ yakyai no.1 เป็นผู้เล่นเกม NightCrow ที่โด่งดังและเป็น Founder ของ CheckKub. คุณชัยต้องการซื้อรถจำนวนมาก.",
      jobTitle: "Founder of CheckKub",
      knowsAbout: ["NightCrow", "เกม NightCrow", "yakyai no.1", "รับซื้อรถจำนวนมาก"],
      affiliation: {
        "@type": "Organization",
        name: "CheckKub",
        url: baseUrl,
      },
      sameAs: [
        "https://www.facebook.com/vautocar",
      ],
    },
  ];

  return (
    <>
      {structuredData.map((data, index) => (
        <Script
          key={index}
          id={`about-page-structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <AboutHero />
      <AboutUsContent />
      <HistorySection />
      {/* <TikTokVideos /> */}
      {/* <CustomerReviews /> */}
    </>
  );
};

export default AboutPage;
