"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getImagePath } from "@/lib/utils";

// Type definition for car data (ready for database integration)
type Car = {
  id?: string | number;
  name: string;
  image: string;
};

interface CarCarouselProps {
  cars?: Car[];
}

const CarCarousel = ({ cars: propCars }: CarCarouselProps = { cars: undefined }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Default cars data (will be replaced by database data in the future)
  const defaultCars: Car[] = [
    { name: "Koenigsegg Jesko Absolut", image: "/images/logo/5.png" },
    { name: "Yangwang U9 Xtreme", image: "/images/logo/2.png" },
    { name: "SSC Tuatara", image: "/images/logo/1.png" },
    { name: "Bugatti Tourbillon", image: "/images/logo/3.png" },
    { name: "Hennessey Venom F5", image: "/images/logo/6.png" },
  ];

  // Use prop cars if provided, otherwise use default cars
  const cars = propCars || defaultCars;

  // On mobile: show 1 car, on desktop: show 5 cars
  const visibleCars = isMobile ? 1 : 5;
  const maxIndex = Math.max(0, cars.length - visibleCars);
  const canGoNext = currentIndex < maxIndex;
  const canGoPrev = currentIndex > 0;

  // Calculate item width percentage
  // On mobile: each item takes 100% width, on desktop: 100% / total items
  const itemWidth = isMobile ? 100 : 100 / cars.length;

  const nextSlide = () => {
    if (canGoNext) {
      setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    }
  };

  const prevSlide = () => {
    if (canGoPrev) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container px-4">
        <div className="relative flex items-center gap-4">
          {/* Left Navigation Button */}
          <button
            onClick={prevSlide}
            disabled={!canGoPrev}
            className={`flex-shrink-0 rounded-full bg-white border-2 border-black p-3 transition shadow-lg ${
              canGoPrev
                ? "cursor-pointer hover:bg-gray-50 active:scale-95"
                : "cursor-not-allowed opacity-50"
            }`}
            aria-label="Previous car"
            type="button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Carousel Container */}
          <div className="flex-1 relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * itemWidth}%)`,
              }}
            >
              {cars.map((car, index) => (
                <div
                  key={car.id || index}
                  className="flex-shrink-0 px-4"
                  style={{ width: `${itemWidth}%` }}
                >
                  <div className={`relative w-full overflow-hidden rounded-lg ${
                    isMobile ? "aspect-[3/2] min-h-[250px]" : "aspect-square"
                  }`}>
                    <Image
                      src={getImagePath(car.image)}
                      alt={car.name}
                      fill
                      className="object-contain rounded-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <p className="mt-4 text-center text-sm font-medium text-black md:text-base">
                    {car.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Navigation Button */}
          <button
            onClick={nextSlide}
            disabled={!canGoNext}
            className={`flex-shrink-0 rounded-full bg-white border-2 border-black p-3 transition shadow-lg ${
              canGoNext
                ? "cursor-pointer hover:bg-gray-50 active:scale-95"
                : "cursor-not-allowed opacity-50"
            }`}
            aria-label="Next car"
            type="button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
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

