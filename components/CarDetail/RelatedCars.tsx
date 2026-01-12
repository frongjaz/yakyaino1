"use client";
import { getImagePath } from "@/lib/utils";
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
              <div key={index} className="animate-pulse">
                <div className="aspect-[4/3] w-full bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
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
        <h2 className="mb-8 text-2xl font-bold text-gray-900">รถที่เกี่ยวข้อง</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {relatedCars.map((car) => (
            <Link
              key={car.id}
              href={`/cars/${encodeCarId(car.id)}`}
              className="group relative block overflow-hidden rounded-lg bg-gray-800 transition hover:shadow-lg cursor-pointer"
            >
              {/* Car Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={getImagePath(car.image)}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                
                {/* Photo Count Badge */}
                <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-lg bg-black/60 backdrop-blur-sm px-2.5 py-1.5 border border-white/20 shadow-lg">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs font-medium text-white">
                    {car.photo_count || 0}
                  </span>
                </div>

                {/* Year Badge */}
                <div className="absolute right-4 top-4 z-10 rounded-md bg-[#EF4444] px-3 py-1.5 text-sm font-bold text-white">
                  {car.year}
                </div>
              </div>

              {/* Car Info */}
              <div className="bg-gray-800 p-4">
                <h3 className="mb-1 text-lg font-bold uppercase text-[#EF4444]">
                  {car.brand}
                </h3>
                <p className="mb-3 text-sm text-white">
                  {car.model} {car.year}
                </p>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex-1"></div>
                  <p className="text-xl font-bold text-[#EF4444]">
                    {formatPrice(car.price)}
                  </p>
                </div>
                <div className="mb-3 h-px bg-gray-700"></div>
                <div className="flex items-center justify-between text-sm text-white transition group-hover:text-gray-300">
                  <span>ดูทั้งหมด</span>
                  <svg
                    className="h-4 w-4 text-[#EF4444]"
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedCars;

