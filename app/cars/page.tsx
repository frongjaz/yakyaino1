import { Suspense } from "react";
import AllCarsHero from "@/components/AllCarsPage/AllCarsHero";
import CarCarousel from "@/components/CarCarousel";
import SearchFilterSection from "@/components/AllCarsPage/SearchFilterSection";
import CarListingsGrid from "@/components/AllCarsPage/CarListingsGrid";
import { Metadata } from "next";
import { fetchCarsSSR, fetchBrandsSSR, CarSSR, PaginationSSR } from "@/lib/fetchCars";
import { encodeCarId } from "@/lib/id-encoder";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.checkkub.com"),
  title: { absolute: "รถมือสองทั้งหมด | ขายรถ รับซื้อรถ | CheckKub" },
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
    url: "https://www.checkkub.com/cars",
    siteName: "CheckKub",
    type: "website",
    locale: "th_TH",
    images: [{ url: "https://www.checkkub.com/images/video/car2.jpg", width: 1200, height: 630, alt: "รถมือสอง CheckKub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ขายรถ รับซื้อรถ | CheckKub",
    description: "ค้นหาและดูรถยนต์มือสองทั้งหมดที่มีจำหน่าย",
    images: ["https://www.checkkub.com/images/video/car2.jpg"],
  },
};

export default async function AllCarsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.checkkub.com";

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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "รถยนต์มือสอง CheckKub",
    description: "รายการรถยนต์มือสองคุณภาพดีที่ CheckKub รับซื้อและจำหน่าย",
    url: `${baseUrl}/cars`,
    numberOfItems: initialPagination.total || initialCars.length,
    itemListElement: initialCars.map((car, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${baseUrl}/cars/${encodeCarId(car.id)}`,
      name: `${car.brand} ${car.model} ปี ${car.year}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <AllCarsHero />
      {carouselCars.length > 0 && <CarCarousel cars={carouselCars} />}
      <SearchFilterSection initialBrands={initialBrands} />
      <Suspense
        fallback={
          <section className="bg-[#1a1a1a] py-12 md:py-16">
            <div className="container mx-auto px-4 flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EF4444]"></div>
            </div>
          </section>
        }
      >
        <CarListingsGrid
          initialData={initialCars}
          initialPagination={initialPagination}
        />
      </Suspense>
    </>
  );
}
