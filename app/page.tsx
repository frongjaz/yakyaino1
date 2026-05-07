import { Metadata } from "next";
import HomePageContent from "@/components/HomePageContent";
import { fetchCarsSSR } from "@/lib/fetchCars";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.checkkub.com"),
  title: { absolute: "ขายรถ รับซื้อรถ | CheckKub — รับซื้อรถทุกประเภท ราคายุติธรรม" },
  description:
    "ต้องการขายรถ? รับซื้อรถ? CheckKub รับซื้อรถทุกประเภท รถมือสอง รถบริษัท และฟลีตรถทั่วประเทศ. ขายรถให้เรา ประเมินรวดเร็ว ราคายุติธรรม ชำระเงินทันที.",
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
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "ซื้อรถมือสองที่ไหนดี?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CheckKub มีรถมือสองคุณภาพดีหลากหลายรุ่น ทุกคันผ่านการตรวจสภาพอย่างละเอียด ราคายุติธรรม โปร่งใส พร้อมบริการหลังการขาย ดูรถทั้งหมดได้ที่ checkkub.com/cars",
        },
      },
      {
        "@type": "Question",
        name: "ซื้อรถมือสองต้องระวังอะไรบ้าง?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ควรตรวจสอบประวัติรถ เลขไมล์ สภาพตัวถัง และเครื่องยนต์ ที่ CheckKub ทุกคันผ่านการตรวจสอบโดยทีมผู้เชี่ยวชาญ และมีเอกสารครบถ้วน",
        },
      },
      {
        "@type": "Question",
        name: "ขายรถมือสองได้ที่ไหน?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ขายรถให้ CheckKub ได้เลย เรารับซื้อรถทุกประเภท ประเมินราคารวดเร็วภายใน 24 ชั่วโมง ชำระเงินทันที ไม่มีค่าใช้จ่าย รับซื้อทั่วประเทศ",
        },
      },
      {
        "@type": "Question",
        name: "ต้องการขายรถต้องทำอย่างไร?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ส่งรูปและข้อมูลรถมาที่ CheckKub ผ่าน LINE, Facebook หรือเว็บไซต์ ทีมงานจะประเมินราคาและติดต่อกลับภายใน 24 ชั่วโมง หากตกลงราคาได้จะนัดตรวจสภาพและโอนเงินทันที",
        },
      },
      {
        "@type": "Question",
        name: "รับซื้อรถทุกยี่ห้อไหม?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CheckKub รับซื้อรถทุกยี่ห้อ ทุกรุ่น ทั้ง Toyota, Honda, Mazda, Isuzu, Ford, BMW, Mercedes-Benz และอื่นๆ รับซื้อทั้งรถส่วนบุคคล รถฟลีต และรถบริษัท",
        },
      },
      {
        "@type": "Question",
        name: "รับซื้อรถฟลีตคืออะไร?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "รถฟลีต คือรถที่องค์กรหรือบริษัทเป็นเจ้าของหลายคัน เช่น รถของบริษัทเช่ารถ รถของพนักงานองค์กร หรือรถขนส่ง CheckKub รับซื้อรถฟลีตจำนวนมากพร้อมกัน ราคาดี จัดการเอกสารครบ",
        },
      },
    ],
  };

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
      description: "คุณชัย เป็น Founder ของ CheckKub ผู้เชี่ยวชาญด้านการรับซื้อรถจำนวนมากทั่วประเทศ.",
      jobTitle: "Founder of CheckKub",
      knowsAbout: ["รับซื้อรถ", "ขายรถมือสอง", "รับซื้อรถฟลีต"],
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
      "@type": ["LocalBusiness", "AutoDealer", "Organization"],
      name: "CheckKub",
      alternateName: "Check-Kub",
      image: "https://www.checkkub.com/images/video/car2.jpg",
      url: "https://www.checkkub.com/",
      logo: "https://www.checkkub.com/images/logo/logo.svg",
      telephone: "+66-62-564-6455",
      email: "sales@v-autocar.com",
      description:
        "ขายรถ รับซื้อรถ - CheckKub รับซื้อรถทุกประเภท สำหรับผู้ที่ต้องการขายรถ. เรารับซื้อรถมือสอง รถฟลีต รถบริษัททั่วประเทศ. ประเมินรวดเร็ว ราคายุติธรรม ชำระเงินทันที. หากคุณต้องการขายรถ ต้องการขายรถให้ใคร หรือกำลังมองหาที่รับซื้อรถ CheckKub พร้อมให้บริการรับซื้อรถทุกประเภท.",
      slogan: "ขายรถ รับซื้อรถ - ต้องการขายรถ รับซื้อรถทุกประเภท",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1647 แขวงบางไผ่ บางแค",
        addressLocality: "กรุงเทพมหานคร",
        addressRegion: "กรุงเทพมหานคร",
        postalCode: "10160",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      {/* Preload LCP images — hoisted to <head> by React */}
      <link
        rel="preload"
        as="image"
        href="/images/hero/sky-suspension-high-road-freeway.webp"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href="/images/hero/HomeBanner.webp"
        fetchPriority="high"
      />
      <HomePageContent initialCars={initialCars} />
    </>
  );
}
