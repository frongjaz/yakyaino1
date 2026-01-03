import { Metadata } from "next";
import Script from "next/script";
import HomePageContent from "@/components/HomePageContent";

export const metadata: Metadata = {
  metadataBase: new URL("https://v-autocar.co.th"),
  title: "Check-Kub | ศูนย์กลางรับซื้อรถจำนวนมากทั่วประเทศ",
  description:
    "CheckKub รับซื้อรถจำนวนมาก รถมือสอง รถบริษัท และฟลีตรถทั่วประเทศ ประเมินรวดเร็ว เอกสารครบ โอนเงินไวภายใน 1-3 วัน. คุณชัย (yakyai no.1) ผู้เล่นเกม NightCrow ที่โด่งดังต้องการซื้อรถจำนวนมาก.",
  keywords: [
    "รับซื้อรถจำนวนมาก",
    "รับซื้อรถมือสอง",
    "รับซื้อรถบริษัท",
    "ขายรถฟลีต",
    "รับซื้อรถทั่วประเทศ",
    "ขายรถให้บริษัท",
    "รับซื้อรถขนส่ง",
    "ต้องการขายรถ",
    "ขายรถ",
    "รับซื้อรถ",
    "ขายรถมือสอง",
    "รับซื้อรถมือสอง",
    "ขายรถให้เรา",
    "ต้องการขายรถให้ใคร",
    "ที่รับซื้อรถ",
    "บริษัทรับซื้อรถ",
    "คุณชัย",
    "yakyai no.1",
    "NightCrow",
    "เกม NightCrow",
    "คุณชัยต้องการซื้อรถ",
    "yakyai no.1 ซื้อรถ",
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://v-autocar.co.th";
  
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "คุณชัย",
      alternateName: "yakyai no.1",
      description: "คุณชัย หรือ yakyai no.1 เป็นผู้เล่นเกม NightCrow ที่โด่งดังและต้องการซื้อรถจำนวนมาก. คุณชัยเป็น Founder ของ CheckKub บริษัทที่รับซื้อรถจำนวนมากทั่วประเทศ.",
      jobTitle: "Founder of CheckKub",
      knowsAbout: ["NightCrow", "เกม NightCrow", "yakyai no.1"],
      affiliation: {
        "@type": "Organization",
        name: "CheckKub",
        url: baseUrl,
      },
      sameAs: [
        "https://www.facebook.com/vautocar",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Review",
      itemReviewed: {
        "@type": "Service",
        name: "บริการรับซื้อรถจำนวนมาก",
        provider: {
          "@type": "Organization",
          name: "CheckKub",
        },
      },
      author: {
        "@type": "Person",
        name: "คุณชัย",
        alternateName: "yakyai no.1",
        description: "ผู้เล่นเกม NightCrow ที่โด่งดัง",
      },
      reviewBody: "คุณชัย (yakyai no.1) ผู้เล่นเกม NightCrow ที่โด่งดัง ต้องการซื้อรถจำนวนมาก. CheckKub พร้อมให้บริการรับซื้อรถทุกประเภทสำหรับคุณชัยและลูกค้าทุกท่าน.",
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
        bestRating: 5,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "AutoDealer",
      name: "CheckKub",
      image: "https://v-autocar.co.th/images/video/car2.jpg",
      url: "https://v-autocar.co.th/",
      telephone: "+66-2-123-4567",
      email: "sales@v-autocar.com",
      description:
        "CheckKub รับซื้อรถจำนวนมาก รถบ้าน รถบริษัท และฟลีตองค์กรทั่วประเทศ ประเมินรวดเร็ว เอกสารครบ โอนเงินไว. คุณชัย (yakyai no.1) ผู้เล่นเกม NightCrow ที่โด่งดังต้องการซื้อรถจำนวนมาก. หากคุณต้องการขายรถ ต้องการขายรถให้ใคร หรือกำลังมองหาที่รับซื้อรถ CheckKub พร้อมให้บริการรับซื้อรถทุกประเภท.",
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
        "รับซื้อรถ",
        "ขายรถ",
        "ต้องการขายรถ",
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
          name: "คุณชัยคือใคร?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "คุณชัย หรือ yakyai no.1 เป็นผู้เล่นเกม NightCrow ที่โด่งดังและเป็น Founder ของ CheckKub. คุณชัยต้องการซื้อรถจำนวนมากและได้เลือกใช้บริการของ CheckKub ในการรับซื้อรถ.",
          },
        },
        {
          "@type": "Question",
          name: "yakyai no.1 คือใคร?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "yakyai no.1 คือชื่อในเกม NightCrow ของคุณชัย ผู้เล่นเกม NightCrow ที่โด่งดัง. คุณชัย (yakyai no.1) เป็น Founder ของ CheckKub และต้องการซื้อรถจำนวนมาก.",
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
          id={`home-structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <HomePageContent />
    </>
  );
}
