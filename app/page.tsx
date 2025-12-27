import AboutUs from "@/components/AboutUs";
import CarCarousel from "@/components/CarCarousel";
import HowToSell from "@/components/HowToSell";
import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/Hero";
import SellBanner from "@/components/SellBanner";
import SocialVideos from "@/components/SocialVideos";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://v-autocar.co.th"),
  title: "Check-Kub | ศูนย์กลางรับซื้อรถจำนวนมากทั่วประเทศ",
  description:
    "CheckKub รับซื้อรถจำนวนมาก รถมือสอง รถบริษัท และฟลีตรถทั่วประเทศ ประเมินรวดเร็ว เอกสารครบ โอนเงินไวภายใน 1-3 วัน.",
  keywords: [
    "รับซื้อรถจำนวนมาก",
    "รับซื้อรถมือสอง",
    "รับซื้อรถบริษัท",
    "ขายรถฟลีต",
    "รับซื้อรถทั่วประเทศ",
    "ขายรถให้บริษัท",
    "รับซื้อรถขนส่ง",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CheckKub | บริการรับซื้อรถจำนวนมาก ครบวงจร",
    description:
      "ปิดดีลรถหลายคันภายในไม่กี่วัน พร้อมทีมตรวจสภาพ เอกสารนิติบุคคล และการชำระเงินที่เชื่อถือได้ทั่วประเทศ.",
    url: "https://v-autocar.co.th/",
    siteName: "CheckKub",
    images: [
      {
        url: "https://v-autocar.co.th/images/video/car2.jpg",
        width: 1200,
        height: 630,
        alt: "CheckKub รับซื้อรถจำนวนมาก",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CheckKub | รับซื้อรถจำนวนมาก ปิดดีลไว",
    description:
      "บริการรับซื้อรถมือสอง รถบริษัท และฟลีตครบวงจร ประเมินรวดเร็ว ติดต่อทีมผู้เชี่ยวชาญได้ทันที.",
    images: ["https://v-autocar.co.th/images/video/car2.jpg"],
  },
};

export default function Home() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "AutoDealer",
      name: "CheckKub",
      image: "https://v-autocar.co.th/images/video/car2.jpg",
      url: "https://v-autocar.co.th/",
      telephone: "+66-2-123-4567",
      email: "sales@v-autocar.com",
      description:
        "CheckKub รับซื้อรถจำนวนมาก รถบ้าน รถบริษัท และฟลีตองค์กรทั่วประเทศ ประเมินรวดเร็ว เอกสารครบ โอนเงินไว.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "123 ถนนสุขุมวิท",
        addressLocality: "เขตวัฒนา",
        addressRegion: "กรุงเทพมหานคร",
        postalCode: "10110",
        addressCountry: "TH",
      },
      areaServed: [
        "Bangkok",
        "Chiang Mai",
        "Khon Kaen",
        "Phuket",
        "Thailand",
      ],
      sameAs: [
        "https://www.facebook.com/vautocar",
        "https://line.me/R/ti/p/@vautocar",
      ],
      serviceType: [
        "รับซื้อรถจำนวนมาก",
        "รับซื้อรถบริษัท",
        "รับซื้อรถฟลีต",
        "รับซื้อรถยนต์มือสอง",
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
          opens: "09:00",
          closes: "18:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Saturday"],
          opens: "09:00",
          closes: "16:00",
        },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "บริการรับซื้อรถจำนวนมาก",
        itemListElement: [
          {
            "@type": "Offer",
            name: "รับซื้อรถบ้านและรถครอบครัวหลายคัน",
          },
          {
            "@type": "Offer",
            name: "รับซื้อฟลีตรถบริษัทและรถเช่า",
          },
          {
            "@type": "Offer",
            name: "รับซื้อสต็อกจากดีลเลอร์และเต็นท์รถ",
          },
        ],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "ทำไมควรขายรถจำนวนมากให้ CheckKub?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "CheckKub มีทีมประเมินราคามืออาชีพ จัดทีมตรวจสภาพทั่วประเทศ และดูแลเอกสารโอนกรรมสิทธิ์ครบ ทำให้ปิดดีลได้รวดเร็วและโปร่งใส.",
          },
        },
        {
          "@type": "Question",
          name: "ต้องเตรียมเอกสารอะไรสำหรับรถบริษัทหรือรถลีสซิ่ง?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "ลูกค้าต้องเตรียมสำเนาทะเบียนรถ หนังสือปลดภาระ หนังสือมอบอำนาจ และเอกสารนิติบุคคล ทีมงานจะส่งเช็กลิสต์ให้ก่อนวันนัดหมาย.",
          },
        },
        {
          "@type": "Question",
          name: "ใช้เวลานานเท่าไรตั้งแต่ประเมินจนถึงโอนเงิน?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "หลังส่งข้อมูลครบ ทีมงานจะเสนอราคาภายใน 24 ชั่วโมง และสามารถโอนเงินได้ภายใน 1-3 วันทำการหลังตรวจสภาพเรียบร้อย.",
          },
        },
      ],
    },
  ];

  return (
    <>
      <ScrollUp />
      <Hero />
      <CarCarousel />
      <SellBanner />
      <HowToSell />
      <AboutUs />
      
      <SocialVideos />
      <Script
        id="checkkub-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
