import AllCarsHero from "@/components/AllCarsPage/AllCarsHero";
import CarCarousel from "@/components/CarCarousel";
import SearchFilterSection from "@/components/AllCarsPage/SearchFilterSection";
import CarListingsGrid from "@/components/AllCarsPage/CarListingsGrid";
import Script from "next/script";
import { Metadata } from "next";
import { fetchCarsSSR, fetchBrandsSSR, CarSSR, PaginationSSR } from "@/lib/fetchCars";

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

export default async function AllCarsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://checkkub.com";

  let initialCars: CarSSR[] = [];
  let initialPagination: PaginationSSR = { page: 1, limit: 12, total: 0, totalPages: 1 };
  let initialBrands: string[] = [];

  // Fetch default first-page data server-side (no searchParams — compatible with static export).
  // Filtered/paginated views are handled client-side via CarListingsGrid.
  try {
    const [carsData, brands] = await Promise.all([
      fetchCarsSSR({ page: 1, limit: 12 }),
      fetchBrandsSSR(),
    ]);
    initialCars = carsData.cars;
    initialPagination = carsData.pagination;
    initialBrands = brands;
  } catch (error) {
    console.error("[SSR] Failed to fetch initial cars data:", error);
    // Falls through with empty defaults — client-side fetch will be used as fallback
  }

  const carouselCars = initialCars.slice(0, 20).map((car) => ({
    id: car.id,
    name: `${car.brand} ${car.model}`,
    image: car.image || "/images/placeholder.jpg",
  }));

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "หน้าแรก", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "รถยนต์มือสอง", item: `${baseUrl}/cars` },
    ],
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "CheckKub รับซื้อรถยี่ห้ออะไรบ้าง?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CheckKub รับซื้อรถทุกยี่ห้อ ไม่ว่าจะเป็น Toyota, Honda, Isuzu, Mitsubishi, Ford, Chevrolet, BMW, Mercedes-Benz, Mazda, Nissan และทุกแบรนด์อื่นๆ ทั้งรถเก๋ง รถกระบะ รถ SUV และรถบรรทุก",
        },
      },
      {
        "@type": "Question",
        name: "รถมือสองอายุมากขายได้ไหม?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CheckKub รับซื้อรถมือสองทุกอายุ ไม่ว่าจะเป็นรถใหม่หรือรถเก่า ขอเพียงสภาพรถดีและเอกสารครบ ทีมงานจะประเมินราคาที่ยุติธรรมตามสภาพจริง",
        },
      },
      {
        "@type": "Question",
        name: "ขายรถมือสองที่ CheckKub ได้เงินเมื่อไหร่?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "หลังตกลงราคาและตรวจสภาพรถเรียบร้อย CheckKub จะโอนเงินให้ภายใน 1-3 วันทำการ เร็วกว่าการขายผ่านเต็นท์ทั่วไปมาก",
        },
      },
    ],
  };

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
      <Script
        id="cars-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="cars-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <AllCarsHero />
      {carouselCars.length > 0 && <CarCarousel cars={carouselCars} />}
      <SearchFilterSection initialBrands={initialBrands} />
      <CarListingsGrid
        initialData={initialCars}
        initialPagination={initialPagination}
      />
    </>
  );
}
