import { Metadata } from "next";
import Script from "next/script";
import HomePageContent from "@/components/HomePageContent";
import { fetchCarsSSR } from "@/lib/fetchCars";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.checkkub.com"),
  title: "ขายรถ รับซื้อรถ | CheckKub - ต้องการขายรถ รับซื้อรถทุกประเภท",
  description:
    "ต้องการขายรถ? รับซื้อรถ? CheckKub รับซื้อรถทุกประเภท รถมือสอง รถบริษัท และฟลีตรถทั่วประเทศ. ขายรถให้เรา ประเมินรวดเร็ว ราคายุติธรรม ชำระเงินทันที. คุณชัย (yakyai no.1) ผู้เล่นเกม NightCrow ที่โด่งดังต้องการซื้อรถจำนวนมาก.",
  keywords: [
    "ขายรถ",
    "รับซื้อรถ",
    "ต้องการขายรถ",
    "ขายรถมือสอง",
    "รับซื้อรถมือสอง",
    "ขายรถให้เรา",
    "ที่รับซื้อรถ",
    "บริษัทรับซื้อรถ",
    "รับซื้อรถจำนวนมาก",
    "รับซื้อรถบริษัท",
    "ขายรถฟลีต",
    "รับซื้อรถฟลีต",
    "รับซื้อรถทั่วประเทศ",
    "ขายรถให้บริษัท",
    "รับซื้อรถขนส่ง",
    "ต้องการขายรถให้ใคร",
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
    title: "ขายรถ รับซื้อรถ | CheckKub - ต้องการขายรถ รับซื้อรถทุกประเภท",
    description:
      "ต้องการขายรถ? รับซื้อรถ? CheckKub รับซื้อรถทุกประเภท รถมือสอง รถบริษัท และฟลีตรถทั่วประเทศ. ขายรถให้เรา ประเมินรวดเร็ว ราคายุติธรรม ชำระเงินทันที.",
    url: "https://www.checkkub.com/",
    siteName: "CheckKub",
    images: [
      {
        url: "https://www.checkkub.com/images/video/car2.jpg",
        width: 1200,
        height: 630,
        alt: "ขายรถ รับซื้อรถ - CheckKub",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ขายรถ รับซื้อรถ | CheckKub",
    description:
      "ต้องการขายรถ? รับซื้อรถ? CheckKub รับซื้อรถทุกประเภท ประเมินรวดเร็ว ราคายุติธรรม ชำระเงินทันที.",
    images: ["https://www.checkkub.com/images/video/car2.jpg"],
  },
};

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.checkkub.com";

  let initialCars: { id?: string | number; name: string; image: string }[] = [];
  try {
    const { cars } = await fetchCarsSSR({ limit: 20 });
    initialCars = cars.map((car) => ({
      id: car.id,
      name: `${car.brand} ${car.model}`,
      image: car.image || "/images/placeholder.jpg",
    }));
  } catch (error) {
    console.error("[SSR] Failed to fetch initial cars for homepage:", error);
  }
  
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "CheckKub",
      url: baseUrl,
      description: "CheckKub รับซื้อรถทุกประเภท ประเมินรวดเร็ว ราคายุติธรรม ชำระเงินทันที",
      inLanguage: "th-TH",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${baseUrl}/cars?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "หน้าแรก", item: baseUrl },
      ],
    },
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
      "@type": ["AutoDealer", "Organization"],
      name: "CheckKub",
      alternateName: "Check-Kub",
      image: "https://www.checkkub.com/images/video/car2.jpg",
      url: "https://www.checkkub.com/",
      logo: "https://www.checkkub.com/images/logo/logo.svg",
      telephone: "+66-2-123-4567",
      email: "sales@v-autocar.com",
      description:
        "ขายรถ รับซื้อรถ - CheckKub รับซื้อรถทุกประเภท สำหรับผู้ที่ต้องการขายรถ. เรารับซื้อรถมือสอง รถฟลีต รถบริษัททั่วประเทศ. ประเมินรวดเร็ว ราคายุติธรรม ชำระเงินทันที. คุณชัย (yakyai no.1) ผู้เล่นเกม NightCrow ที่โด่งดังต้องการซื้อรถจำนวนมาก. หากคุณต้องการขายรถ ต้องการขายรถให้ใคร หรือกำลังมองหาที่รับซื้อรถ CheckKub พร้อมให้บริการรับซื้อรถทุกประเภท.",
      slogan: "ขายรถ รับซื้อรถ - ต้องการขายรถ รับซื้อรถทุกประเภท",
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
        "ขายรถ",
        "รับซื้อรถ",
        "ต้องการขายรถ",
        "ขายรถมือสอง",
        "รับซื้อรถมือสอง",
        "รับซื้อรถจำนวนมาก",
        "รับซื้อรถบริษัท",
        "รับซื้อรถฟลีต",
        "รับซื้อรถยนต์มือสอง",
        "ที่รับซื้อรถ",
        "บริษัทรับซื้อรถ",
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
        name: "บริการขายรถ รับซื้อรถ",
        itemListElement: [
          {
            "@type": "Offer",
            name: "ขายรถ รับซื้อรถมือสอง",
            description: "รับซื้อรถมือสองทุกประเภท สำหรับผู้ที่ต้องการขายรถ",
          },
          {
            "@type": "Offer",
            name: "ขายรถฟลีต รับซื้อรถฟลีต",
            description: "รับซื้อฟลีตรถบริษัทและรถเช่า สำหรับผู้ที่ต้องการขายรถฟลีต",
          },
          {
            "@type": "Offer",
            name: "ขายรถบริษัท รับซื้อรถบริษัท",
            description: "รับซื้อรถบริษัททั่วประเทศ สำหรับผู้ที่ต้องการขายรถบริษัท",
          },
          {
            "@type": "Offer",
            name: "รับซื้อรถบ้านและรถครอบครัวหลายคัน",
          },
          {
            "@type": "Offer",
            name: "รับซื้อสต็อกจากดีลเลอร์และเต็นท์รถ",
          },
        ],
      },
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
      <HomePageContent initialCars={initialCars} />
    </>
  );
}
