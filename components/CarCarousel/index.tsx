"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getImagePath } from "@/lib/utils";
import { apiGet } from "@/lib/api";
import { encodeCarId } from "@/lib/id-encoder";

// Type definition for car data
type Car = {
  id?: string | number;
  name: string;
  image: string;
};

type CarData = {
  id: string | number;
  brand: string;
  model: string;
  image: string;
  status?: string;
};

interface CarCarouselProps {
  cars?: Car[];
}

const CarCarousel = ({ cars: propCars }: CarCarouselProps = { cars: undefined }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [cars, setCars] = useState<Car[]>(propCars || []);
  const [loading, setLoading] = useState(!propCars);

  // Fetch cars from API if not provided as props
  useEffect(() => {
    if (propCars) {
      setCars(propCars);
      setLoading(false);
      return;
    }

    const fetchCars = async () => {
      try {
        setLoading(true);
        const data = await apiGet<{ 
          success: boolean; 
          data: CarData[];
        }>('/api/cars?limit=20');
        
        if (data.success && data.data) {
          // Filter only available cars and map to Car type
          const availableCars = data.data
            .filter((car: CarData) => 
              car.status === 'available' || !car.status
            )
            .map((car: CarData): Car => ({
              id: car.id,
              name: `${car.brand} ${car.model}`,
              image: car.image || '/images/placeholder.jpg',
            }));
          
          setCars(availableCars.length > 0 ? availableCars : []);
        }
      } catch (error) {
        console.error('Error fetching cars:', error);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [propCars]);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // On mobile: show 1 car, on desktop: show 4 cars
  const visibleCars = isMobile ? 1 : 4;
  const maxIndex = Math.max(0, cars.length - visibleCars);
  const canGoNext = cars.length > visibleCars;
  const canGoPrev = cars.length > visibleCars;

  // Calculate item width percentage
  // On mobile: each item takes 100% width, on desktop: 100% / visible items
  const itemWidth = isMobile ? 100 : 100 / visibleCars;

  const nextSlide = () => {
    if (cars.length <= visibleCars) return;
    setCurrentIndex((prev) => {
      if (prev >= maxIndex) {
        return 0; // Loop back to start
      }
      return prev + 1;
    });
  };

  const prevSlide = () => {
    if (cars.length <= visibleCars) return;
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return maxIndex; // Loop back to end
      }
      return prev - 1;
    });
  };

  // Don't render if no cars
  if (loading || cars.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container px-4">
        <div className="relative flex items-center gap-4">
          {/* Left Navigation Button */}
          <button
            onClick={prevSlide}
            disabled={cars.length <= visibleCars}
            className={`flex-shrink-0 rounded-full bg-white border-2 border-gray-300 p-3 transition-all duration-200 shadow-md hover:shadow-lg ${
              cars.length > visibleCars
                ? "cursor-pointer hover:bg-gray-50 hover:border-gray-400 active:scale-95 hover:scale-105"
                : "cursor-not-allowed opacity-40"
            }`}
            aria-label="Previous car"
            type="button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-700"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Carousel Container */}
          <div className="flex-1 relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * itemWidth}%)`,
              }}
            >
              {cars.map((car, index) => (
                <Link
                  key={car.id || index}
                  href={`/cars/${encodeCarId(car.id || index)}`}
                  className="flex-shrink-0 px-4 group cursor-pointer"
                  style={{ width: `${itemWidth}%` }}
                >
                  <div className={`relative w-full overflow-hidden rounded-xl bg-gray-50 shadow-sm transition-all duration-300 group-hover:shadow-lg ${
                    isMobile ? "aspect-[3/2] min-h-[350px]" : "aspect-square"
                  }`}>
                    <Image
                      src={getImagePath(car.image)}
                      alt={car.name}
                      fill
                      className="object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <p className="mt-4 text-center text-sm font-medium text-gray-800 transition-colors duration-200 group-hover:text-gray-900 md:text-base">
                    {car.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Navigation Button */}
          <button
            onClick={nextSlide}
            disabled={cars.length <= visibleCars}
            className={`flex-shrink-0 rounded-full bg-white border-2 border-gray-300 p-3 transition-all duration-200 shadow-md hover:shadow-lg ${
              cars.length > visibleCars
                ? "cursor-pointer hover:bg-gray-50 hover:border-gray-400 active:scale-95 hover:scale-105"
                : "cursor-not-allowed opacity-40"
            }`}
            aria-label="Next car"
            type="button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-700"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CarCarousel;

