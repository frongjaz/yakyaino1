import AllCarsHero from "@/components/AllCarsPage/AllCarsHero";
import CarCarousel from "@/components/CarCarousel";
import SearchFilterSection from "@/components/AllCarsPage/SearchFilterSection";
import CarListingsGrid from "@/components/AllCarsPage/CarListingsGrid";
import Pagination from "@/components/AllCarsPage/Pagination";
import Script from "next/script";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "รถทั้งหมด | CheckKub - รับซื้อรถมือสอง",
  description: "ค้นหาและดูรถยนต์มือสองทั้งหมดที่มีจำหน่าย. CheckKub รับซื้อรถมือสองทุกประเภท ราคายุติธรรม.",
  keywords: [
    "รับซื้อรถมือสอง",
    "รถมือสอง",
    "ขายรถมือสอง",
    "รับซื้อรถ",
    "ต้องการขายรถ",
  ],
  openGraph: {
    title: "รถทั้งหมด | CheckKub - รับซื้อรถมือสอง",
    description: "ค้นหาและดูรถยนต์มือสองทั้งหมดที่มีจำหน่าย",
    type: "website",
  },
};

export default function AllCarsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://checkkub.com";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "รายการรถยนต์มือสอง",
    description: "รายการรถยนต์มือสองทั้งหมดที่ CheckKub รับซื้อและจำหน่าย",
    url: `${baseUrl}/cars`,
    itemListElement: {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Product",
        name: "รถยนต์มือสอง",
        description: "CheckKub รับซื้อและจำหน่ายรถยนต์มือสองทุกประเภท",
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

