import AboutHero from "@/components/AboutPage/AboutHero";
import AboutUsContent from "@/components/AboutPage/AboutUsContent";
import HistorySection from "@/components/AboutPage/HistorySection";
import TikTokVideos from "@/components/AboutPage/TikTokVideos";
import CustomerReviews from "@/components/AboutPage/CustomerReviews";

import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.checkkub.com"),
  title: { absolute: "เกี่ยวกับ CheckKub | บริษัทรับซื้อรถ ขายรถมือสอง" },
  description:
    "CheckKub ผู้เชี่ยวชาญด้านการรับซื้อรถและขายรถมือสองคุณภาพดี. ทีมงานมืออาชีพพร้อมประเมินราคายุติธรรม ชำระเงินทันที ดูแลเอกสารครบจบในที่เดียว.",
  keywords: [
    "เกี่ยวกับ CheckKub",
    "ขายรถ",
    "รับซื้อรถ",
    "ต้องการขายรถ",
    "บริษัทรับซื้อรถ",
    "รับซื้อรถมือสอง",
    "ขายรถมือสอง",
    "รับซื้อรถทั่วประเทศ",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "เกี่ยวกับ CheckKub | บริษัทรับซื้อรถ ขายรถมือสองทั่วประเทศ",
    description:
      "CheckKub ผู้เชี่ยวชาญด้านการรับซื้อรถและขายรถมือสองคุณภาพดี ประเมินราคายุติธรรม ชำระเงินทันที",
    url: "https://www.checkkub.com/about",
    siteName: "CheckKub",
    type: "website",
    locale: "th_TH",
    images: [{ url: "https://www.checkkub.com/images/video/car4.jpg", width: 1200, height: 630, alt: "เกี่ยวกับ CheckKub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "เกี่ยวกับ CheckKub | บริษัทรับซื้อรถ ขายรถมือสอง",
    description: "CheckKub ผู้เชี่ยวชาญด้านการรับซื้อรถและขายรถมือสองคุณภาพดีทั่วประเทศ",
    images: ["https://www.checkkub.com/images/video/car4.jpg"],
  },
};

const AboutPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.checkkub.com";

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
          description: "คุณชัย เป็น Founder ของ CheckKub ผู้เชี่ยวชาญด้านการรับซื้อรถและขายรถมือสองจำนวนมากทั่วประเทศ.",
          jobTitle: "Founder of CheckKub",
          knowsAbout: ["รับซื้อรถ", "ขายรถมือสอง", "รับซื้อรถฟลีต"],
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "คุณชัย",
      description: "คุณชัย เป็น Founder ของ CheckKub ผู้เชี่ยวชาญด้านการรับซื้อรถและขายรถมือสองจำนวนมากทั่วประเทศ.",
      jobTitle: "Founder of CheckKub",
      knowsAbout: ["รับซื้อรถ", "ขายรถมือสอง", "รับซื้อรถฟลีต", "รับซื้อรถจำนวนมาก"],
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

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "หน้าแรก", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "เกี่ยวกับเรา", item: `${baseUrl}/about` },
    ],
  };

  return (
    <>
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <AboutHero />
      <AboutUsContent />
      <HistorySection />
      {/* <TikTokVideos /> */}
      {/* <CustomerReviews /> */}
    </>
  );
};

export default AboutPage;
