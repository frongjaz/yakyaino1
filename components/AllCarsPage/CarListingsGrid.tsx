"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getImagePath, IMAGE_PLACEHOLDER } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import { encodeCarId } from "@/lib/id-encoder";
import {
  toggleCompare,
  isInCompare,
  COMPARE_EVENT,
  MAX_COMPARE,
  getCompareCars,
} from "@/lib/compareStore";
import Pagination from "./Pagination";

type CarListing = {
  id: string | number;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  photo_count: number;
  status?: string;
};

type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

interface CarListingsGridProps {
  initialData?: CarListing[];
  initialPagination?: PaginationInfo;
}

const CarListingsGrid = ({
  initialData,
  initialPagination,
}: CarListingsGridProps = {}) => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const brand = searchParams.get("brand") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const page = searchParams.get("page") || "1";

  const [cars, setCars] = useState<CarListing[]>(initialData || []);
  const [pagination, setPagination] = useState<PaginationInfo>(
    initialPagination || { page: 1, limit: 12, total: 0, totalPages: 1 }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());

  const skipFirstFetch = useRef(!!initialData?.length);

  // Sync compare state from localStorage
  useEffect(() => {
    const syncCompare = () => {
      const ids = new Set(getCompareCars().map((c) => String(c.id)));
      setCompareIds(ids);
    };
    syncCompare();
    window.addEventListener(COMPARE_EVENT, syncCompare);
    return () => window.removeEventListener(COMPARE_EVENT, syncCompare);
  }, []);

  useEffect(() => {
    if (skipFirstFetch.current) {
      skipFirstFetch.current = false;
      return;
    }
    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, brand, minPrice, maxPrice, page]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (brand && brand !== "ทั้งหมด") params.set("brand", brand);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      params.set("page", page);
      params.set("limit", "12");

      const data = await apiGet<{
        success: boolean;
        data: CarListing[];
        pagination?: PaginationInfo;
      }>(`/api/cars?${params.toString()}`);

      if (data.success && data.data) {
        const availableCars = data.data.filter(
          (car: CarListing) => car.status === "available" || !car.status
        );
        setCars(availableCars);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } else {
        setError("ไม่สามารถโหลดข้อมูลรถได้");
      }
    } catch (err: any) {
      console.error("Error fetching cars:", err);
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompare = (car: CarListing) => {
    const added = toggleCompare({
      id: car.id,
      brand: car.brand,
      model: car.model,
      year: car.year,
      image: car.image,
      price: car.price,
    });
    if (!added && !isInCompare(car.id)) {
      // Already at max — isInCompare returns false and addToCompare returned false
      // toggleCompare already handled the logic; just let the event update state
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("th-TH").format(price);

  if (loading) {
    return (
      <section className="bg-[#1a1a1a] py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EF4444] mx-auto mb-4"></div>
              <p className="text-white/60">กำลังโหลดข้อมูล...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-[#1a1a1a] py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchCars}
                className="px-4 py-2 bg-[#EF4444] text-white rounded hover:bg-[#DC2626] transition"
              >
                ลองอีกครั้ง
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (cars.length === 0) {
    return (
      <>
        <section className="bg-[#1a1a1a] py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center py-12">
              <p className="text-white/60 text-lg">ยังไม่มีข้อมูลรถ</p>
            </div>
          </div>
        </section>
        <Pagination totalPages={pagination.totalPages} />
      </>
    );
  }

  return (
    <>
      <section className="bg-[#1a1a1a] py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => {
              const inCompare = compareIds.has(String(car.id));
              const compareCount = compareIds.size;
              const canAdd = !inCompare && compareCount < MAX_COMPARE;

              return (
                <div
                  key={car.id}
                  className="group relative overflow-hidden rounded-xl bg-[#242424] shadow-md hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 border border-white/5 hover:border-[#EF4444]/30 flex flex-col"
                >
                  {/* Clickable area — navigates to car detail */}
                  <Link
                    href={`/cars/${encodeCarId(car.id)}`}
                    className="block flex-1"
                  >
                    {/* Image */}
                    <div
                      className="relative w-full overflow-hidden bg-[#111]"
                      style={{ paddingBottom: "66.66%" }}
                    >
                      <Image
                        src={getImagePath(car.image)}
                        alt={`${car.brand} ${car.model}`}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        onError={(e) => {
                          const t = e.target as HTMLImageElement;
                          if (t && t.src !== IMAGE_PLACEHOLDER)
                            t.src = IMAGE_PLACEHOLDER;
                        }}
                        unoptimized
                      />

                      {/* Photo count badge */}
                      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-black/70 backdrop-blur-sm px-2 py-1 z-10">
                        <svg
                          className="h-3 w-3 text-white/80"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs font-medium text-white/90">
                          {car.photo_count || 0}
                        </span>
                      </div>

                      {/* Year badge */}
                      <div className="absolute right-3 top-3 rounded-md bg-[#EF4444] px-2.5 py-1 text-sm font-bold text-white z-10 shadow-lg">
                        {car.year}
                      </div>

                      {/* Bottom gradient */}
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#242424] to-transparent z-10 pointer-events-none" />
                    </div>

                    {/* Info */}
                    <div className="p-4 pt-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#EF4444] mb-0.5">
                            {car.brand}
                          </h3>
                          <p className="text-sm font-medium text-white/90 truncate">
                            {car.model} {car.year}
                          </p>
                        </div>
                        <p className="shrink-0 text-lg font-bold text-[#EF4444] tabular-nums">
                          {formatPrice(car.price)}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                        <span className="text-xs text-white/50">ราคา (บาท)</span>
                        <div className="flex items-center gap-1 text-xs font-medium text-white/70 group-hover:text-[#EF4444] transition-colors duration-200">
                          <span>ดูทั้งหมด</span>
                          <svg
                            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Compare button — outside <Link> to avoid nested interactive elements */}
                  <div className="px-4 pb-4 pt-0">
                    <button
                      onClick={() => handleToggleCompare(car)}
                      disabled={!inCompare && !canAdd}
                      title={
                        !inCompare && !canAdd
                          ? `เลือกได้สูงสุด ${MAX_COMPARE} คัน`
                          : undefined
                      }
                      className={`w-full py-2 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                        inCompare
                          ? "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/40 hover:bg-[#EF4444]/25"
                          : canAdd
                          ? "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/80"
                          : "bg-white/5 text-white/20 border-white/5 cursor-not-allowed"
                      }`}
                    >
                      {inCompare ? "✓ เปรียบเทียบแล้ว" : "+ เพิ่มเปรียบเทียบ"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Pagination totalPages={pagination.totalPages} />
    </>
  );
};

export default CarListingsGrid;
