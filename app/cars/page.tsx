import AllCarsHero from "@/components/AllCarsPage/AllCarsHero";
import CarCarousel from "@/components/CarCarousel";
import SearchFilterSection from "@/components/AllCarsPage/SearchFilterSection";
import CarListingsGrid from "@/components/AllCarsPage/CarListingsGrid";
import Pagination from "@/components/AllCarsPage/Pagination";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "รถทั้งหมด | CheckKub",
  description: "ค้นหาและดูรถยนต์ทั้งหมดที่มีจำหน่าย",
};

export default function AllCarsPage() {
  return (
    <>
      <AllCarsHero />
      <CarCarousel />
      <SearchFilterSection />
      <CarListingsGrid />
      <Pagination />
    </>
  );
}

