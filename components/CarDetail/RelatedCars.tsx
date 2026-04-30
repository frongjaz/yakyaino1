"use client";
import { getImagePath, IMAGE_PLACEHOLDER } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { encodeCarId } from "@/lib/id-encoder";
import { apiGet } from "@/lib/api";

type RelatedCar = {
  id: string | number;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  photo_count: number;
};

type CarData = {
  id: string | number;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  photo_count: number;
  status?: string;
};

// Fisher-Yates shuffle algorithm for random selection
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface RelatedCarsProps {
  currentCarId?: string | number;
  count?: number;
}

const RelatedCars = ({ currentCarId, count = 3 }: RelatedCarsProps) => {
  const [relatedCars, setRelatedCars] = useState<RelatedCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchRelatedCars();
  }, [currentCarId, count]);

  const fetchRelatedCars = async () => {
    try {
      setLoading(true);
      // Fetch all available cars from API
      const data = await apiGet<{ 
        success: boolean; 
        data: CarData[];
      }>('/api/cars?limit=100'); // Get more cars for better random selection
      
      if (data.success && data.data) {
        // Filter only available cars and exclude current car
        const availableCars = data.data
          .filter((car: CarData) => 
            (car.status === 'available' || !car.status) &&
            String(car.id) !== String(currentCarId)
          )
          .map((car: CarData): RelatedCar => ({
            id: car.id,
            brand: car.brand,
            model: car.model,
            year: car.year,
            price: car.price,
            image: car.image || '/images/placeholder.jpg',
            photo_count: car.photo_count || 0,
          }));

        // Shuffle and take the requested count
        const shuffled = shuffleArray(availableCars);
        setRelatedCars(shuffled.slice(0, Math.min(count, shuffled.length)));
      }
    } catch (error) {
      console.error('Error fetching related cars:', error);
      setRelatedCars([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH").format(price);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">รถที่เกี่ยวข้อง</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Loading placeholder - empty state during hydration */}
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">รถที่เกี่ยวข้อง</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="animate-pulse overflow-hidden rounded-xl bg-[#242424]">
                <div className="w-full bg-[#333]" style={{ paddingBottom: "66.66%" }}></div>
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-[#333] rounded w-1/3"></div>
                  <div className="h-4 bg-[#333] rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (relatedCars.length === 0) {
    return null; // Don't render if no related cars
  }

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">รถที่เกี่ยวข้อง</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {relatedCars.map((car) => (
            <Link
              key={car.id}
              href={`/cars/${encodeCarId(car.id)}`}
              className="group block overflow-hidden rounded-xl bg-[#242424] shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-white/5 hover:border-[#EF4444]/30"
            >
              {/* Car Image */}
              <div className="relative w-full overflow-hidden bg-[#111]" style={{ paddingBottom: "66.66%" }}>
                <Image
                  src={getImagePath(car.image)}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    if (t && t.src !== IMAGE_PLACEHOLDER) t.src = IMAGE_PLACEHOLDER;
                  }}
                  unoptimized
                />
                <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-md bg-black/70 backdrop-blur-sm px-2 py-1">
                  <svg className="h-3 w-3 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-white/90">{car.photo_count || 0}</span>
                </div>
                <div className="absolute right-3 top-3 z-10 rounded-md bg-[#EF4444] px-2.5 py-1 text-sm font-bold text-white">
                  {car.year}
                </div>
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#242424] to-transparent z-10 pointer-events-none" />
              </div>

              {/* Car Info */}
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
                  <span className="text-xs text-white/40">ราคา (บาท)</span>
                  <div className="flex items-center gap-1 text-xs font-medium text-white/60 group-hover:text-[#EF4444] transition-colors">
                    <span>ดูทั้งหมด</span>
                    <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedCars;

