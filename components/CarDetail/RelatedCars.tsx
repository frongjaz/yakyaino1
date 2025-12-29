"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { encodeCarId } from "@/lib/id-encoder";

type RelatedCar = {
  id: string | number;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  photoCount: number;
};

// All available cars data
const allCars: RelatedCar[] = [
  {
    id: 1,
    brand: "Benz",
    model: "GLA200",
    year: 2022,
    price: 1199000,
    image: "/images/hero/main1.png",
    photoCount: 4,
  },
  {
    id: 2,
    brand: "BENZ",
    model: "CLS 250",
    year: 2016,
    price: 1090000,
    image: "/images/hero/main11.jpg",
    photoCount: 3,
  },
  {
    id: 3,
    brand: "TOYOTA",
    model: "Corolla Altis",
    year: 2023,
    price: 699000,
    image: "/images/hero/main21.jpg",
    photoCount: 5,
  },
  {
    id: 4,
    brand: "HONDA",
    model: "ACCORD",
    year: 2022,
    price: 899000,
    image: "/images/hero/main31.jpg",
    photoCount: 4,
  },
  {
    id: 5,
    brand: "TOYOTA",
    model: "Harrier",
    year: 2014,
    price: 699000,
    image: "/images/hero/main41.jpg",
    photoCount: 6,
  },
  {
    id: 6,
    brand: "BMW",
    model: "530E",
    year: 2020,
    price: 799000,
    image: "/images/hero/main51.jpg",
    photoCount: 3,
  },
  {
    id: 7,
    brand: "TOYOTA",
    model: "Alphard",
    year: 2023,
    price: 2459000,
    image: "/images/hero/main61.jpg",
    photoCount: 5,
  },
  {
    id: 8,
    brand: "Benz",
    model: "SLK200",
    year: 2013,
    price: 899000,
    image: "/images/hero/main71.jpg",
    photoCount: 4,
  },
  {
    id: 9,
    brand: "BMW",
    model: "740LI",
    year: 2017,
    price: 1269000,
    image: "/images/hero/main81.jpg",
    photoCount: 6,
  },
];

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Filter out current car if provided
    const availableCars = allCars.filter(
      (car) => String(car.id) !== String(currentCarId)
    );

    // Shuffle and take the requested count (only on client-side)
    const shuffled = shuffleArray(availableCars);
    setRelatedCars(shuffled.slice(0, Math.min(count, shuffled.length)));
  }, [currentCarId, count]);

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

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">รถที่เกี่ยวข้อง</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {relatedCars.map((car) => (
            <div
              key={car.id}
              className="group relative overflow-hidden rounded-lg bg-gray-800"
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
                <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-white">
                  <svg
                    className="h-3.5 w-3.5 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="ml-0.5 text-xs font-semibold text-black">
                    {car.photoCount}
                  </span>
                </div>

                {/* Year Badge */}
                <div className="absolute right-4 top-4 rounded-md bg-[#EF4444] px-3 py-1.5 text-sm font-bold text-white">
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
                <Link
                  href={`/cars/${encodeCarId(car.id)}`}
                  className="flex items-center justify-between text-sm text-white transition hover:text-gray-300"
                >
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
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedCars;

