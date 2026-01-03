import SellHero from "@/components/SellPage/SellHero";
import SellBenefits from "@/components/SellPage/SellBenefits";
import SellPolicy from "@/components/SellPage/SellPolicy";
import AcceptCars from "@/components/SellPage/AcceptCars";
import SellSteps from "@/components/SellPage/SellSteps";
import ScrollUp from "@/components/Common/ScrollUp";
import Script from "next/script";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ขายรถ | CheckKub - ต้องการขายรถ รับซื้อรถทุกประเภท",
  description: "ต้องการขายรถ? CheckKub รับซื้อรถทุกประเภท รวดเร็ว โปร่งใส ราคายุติธรรม ชำระเงินทันที. เรารับซื้อรถมือสอง รถฟลีต รถบริษัททั่วประเทศ.",
  keywords: [
    "ต้องการขายรถ",
    "ขายรถ",
    "รับซื้อรถ",
    "ขายรถมือสอง",
    "รับซื้อรถมือสอง",
    "ขายรถให้เรา",
    "ที่รับซื้อรถ",
    "บริษัทรับซื้อรถ",
    "ขายรถฟลีต",
    "รับซื้อรถฟลีต",
  ],
  openGraph: {
    title: "ขายรถ | CheckKub - ต้องการขายรถ รับซื้อรถทุกประเภท",
    description: "ต้องการขายรถ? CheckKub รับซื้อรถทุกประเภท รวดเร็ว โปร่งใส ราคายุติธรรม",
    type: "website",
  },
};

export default function SellPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://checkkub.com";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "รับซื้อรถ",
    provider: {
      "@type": "AutoDealer",
      name: "CheckKub",
      url: baseUrl,
      telephone: "+66-2-123-4567",
      email: "sales@v-autocar.com",
    },
    areaServed: {
      "@type": "Country",
      name: "Thailand",
    },
    description:
      "CheckKub รับซื้อรถทุกประเภท สำหรับผู้ที่ต้องการขายรถ เรามีบริการรับซื้อรถมือสอง รถฟลีต รถบริษัททั่วประเทศ. ประเมินรวดเร็ว ราคายุติธรรม ชำระเงินทันที.",
    offers: {
      "@type": "Offer",
      description: "รับซื้อรถทุกประเภท ราคายุติธรรม ชำระเงินทันที",
    },
  };

  return (
    <>
      <Script
        id="sell-page-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ScrollUp />
      <SellHero />
      <SellBenefits />
      <SellPolicy />
      <AcceptCars />
      <SellSteps />
    </>
  );
}

