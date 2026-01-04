import SellHero from "@/components/SellPage/SellHero";
import SellBenefits from "@/components/SellPage/SellBenefits";
import SellPolicy from "@/components/SellPage/SellPolicy";
import AcceptCars from "@/components/SellPage/AcceptCars";
import SellSteps from "@/components/SellPage/SellSteps";
import ScrollUp from "@/components/Common/ScrollUp";
import Script from "next/script";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://v-autocar.co.th"),
  title: "ขายรถ รับซื้อรถ | CheckKub - ต้องการขายรถ รับซื้อรถทุกประเภท",
  description: "ต้องการขายรถ? รับซื้อรถ? CheckKub รับซื้อรถทุกประเภท รวดเร็ว โปร่งใส ราคายุติธรรม ชำระเงินทันที. เรารับซื้อรถมือสอง รถฟลีต รถบริษัททั่วประเทศ. ขายรถให้เรา รับซื้อรถที่ไหนดี CheckKub พร้อมให้บริการ.",
  keywords: [
    "ขายรถ",
    "รับซื้อรถ",
    "ต้องการขายรถ",
    "ขายรถมือสอง",
    "รับซื้อรถมือสอง",
    "ขายรถให้เรา",
    "ที่รับซื้อรถ",
    "บริษัทรับซื้อรถ",
    "ขายรถฟลีต",
    "รับซื้อรถฟลีต",
  ],
  alternates: {
    canonical: "/sell",
  },
  openGraph: {
    title: "ขายรถ รับซื้อรถ | CheckKub - ต้องการขายรถ รับซื้อรถทุกประเภท",
    description: "ต้องการขายรถ? รับซื้อรถ? CheckKub รับซื้อรถทุกประเภท รวดเร็ว โปร่งใส ราคายุติธรรม ชำระเงินทันที",
    url: "https://v-autocar.co.th/sell",
    siteName: "CheckKub",
    type: "website",
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: "ขายรถ รับซื้อรถ | CheckKub",
    description: "ต้องการขายรถ? รับซื้อรถ? CheckKub รับซื้อรถทุกประเภท ราคายุติธรรม ชำระเงินทันที",
  },
};

export default function SellPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://checkkub.com";

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: ["ขายรถ", "รับซื้อรถ", "ต้องการขายรถ"],
      name: "บริการขายรถ รับซื้อรถ",
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
        "ขายรถ รับซื้อรถ - CheckKub รับซื้อรถทุกประเภท สำหรับผู้ที่ต้องการขายรถ. เรามีบริการรับซื้อรถมือสอง รถฟลีต รถบริษัททั่วประเทศ. ประเมินรวดเร็ว ราคายุติธรรม ชำระเงินทันที. ที่รับซื้อรถ CheckKub พร้อมให้บริการ.",
      offers: {
        "@type": "Offer",
        name: "ขายรถ รับซื้อรถ",
        description: "รับซื้อรถทุกประเภท ราคายุติธรรม ชำระเงินทันที สำหรับผู้ที่ต้องการขายรถ",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "ต้องการขายรถ ควรขายให้ใครดี?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "หากคุณต้องการขายรถ CheckKub เป็นตัวเลือกที่ดี เพราะเรามีทีมประเมินราคามืออาชีพ ให้ราคาตามสภาพจริง ไม่กดราคา และชำระเงินทันทีหลังตกลงราคา. เรารับซื้อรถทุกประเภท ทั้งรถส่วนบุคคล รถฟลีต และรถบริษัท.",
          },
        },
        {
          "@type": "Question",
          name: "รับซื้อรถที่ไหนบ้าง?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "CheckKub รับซื้อรถทั่วประเทศ เรามีทีมตรวจสภาพและประเมินราคาในทุกจังหวัด. ไม่ว่าคุณต้องการขายรถที่กรุงเทพ เชียงใหม่ ขอนแก่น หรือจังหวัดไหน เราพร้อมให้บริการ.",
          },
        },
        {
          "@type": "Question",
          name: "ขายรถที่ไหนดี?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "ขายรถที่ CheckKub รับซื้อรถทุกประเภท ให้ราคายุติธรรม ประเมินรวดเร็ว ชำระเงินทันที. เรารับซื้อรถมือสอง รถฟลีต รถบริษัททั่วประเทศ.",
          },
        },
      ],
    },
  ];

  return (
    <>
      {structuredData.map((data, index) => (
        <Script
          key={index}
          id={`sell-page-structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <ScrollUp />
      <SellHero />
      <SellBenefits />
      <SellPolicy />
      <AcceptCars />
      <SellSteps />
    </>
  );
}

