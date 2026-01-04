import AllCarsHero from "@/components/AllCarsPage/AllCarsHero";
import CarCarousel from "@/components/CarCarousel";
import SearchFilterSection from "@/components/AllCarsPage/SearchFilterSection";
import CarListingsGrid from "@/components/AllCarsPage/CarListingsGrid";
import Pagination from "@/components/AllCarsPage/Pagination";
import Script from "next/script";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://v-autocar.co.th"),
  title: "ขายรถ รับซื้อรถ | CheckKub - รับซื้อรถมือสอง",
  description: "ขายรถ รับซื้อรถ - ค้นหาและดูรถยนต์มือสองทั้งหมดที่มีจำหน่าย. CheckKub รับซื้อรถมือสองทุกประเภท ราคายุติธรรม. สำหรับผู้ที่ต้องการขายรถ.",
  keywords: [
    "ขายรถ",
    "รับซื้อรถ",
    "ต้องการขายรถ",
    "ขายรถมือสอง",
    "รับซื้อรถมือสอง",
    "รับซื้อรถมือสอง",
    "รถมือสอง",
  ],
  alternates: {
    canonical: "/cars",
  },
  openGraph: {
    title: "ขายรถ รับซื้อรถ | CheckKub - รับซื้อรถมือสอง",
    description: "ขายรถ รับซื้อรถ - ค้นหาและดูรถยนต์มือสองทั้งหมดที่มีจำหน่าย",
    url: "https://v-autocar.co.th/cars",
    siteName: "CheckKub",
    type: "website",
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: "ขายรถ รับซื้อรถ | CheckKub",
    description: "ค้นหาและดูรถยนต์มือสองทั้งหมดที่มีจำหน่าย",
  },
};

export default function AllCarsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://checkkub.com";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "รายการขายรถ รับซื้อรถ",
    description: "รายการรถยนต์มือสองทั้งหมดที่ CheckKub รับซื้อและจำหน่าย สำหรับผู้ที่ต้องการขายรถ",
    url: `${baseUrl}/cars`,
    itemListElement: {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Product",
        name: "ขายรถ รับซื้อรถมือสอง",
        description: "CheckKub รับซื้อและจำหน่ายรถยนต์มือสองทุกประเภท สำหรับผู้ที่ต้องการขายรถ",
      },
    },
  };

  return (
    <>
      <Script
        id="cars-page-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AllCarsHero />
      <CarCarousel />
      <SearchFilterSection />
      <CarListingsGrid />
      <Pagination />
    </>
  );
}

