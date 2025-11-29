"use client";
import { useState } from "react";
import Image from "next/image";
import { getImagePath } from "@/lib/utils";

const CarCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cars = [
    { name: "Koenigsegg Jesko Absolut", image: "/images/video/car.jpg" },
    { name: "Yangwang U9 Xtreme", image: "/images/video/car2.jpg" },
    { name: "SSC Tuatara", image: "/images/video/car3.jpg" },
    { name: "Bugatti Tourbillon", image: "/images/video/car4.jpg" },
    { name: "Hennessey Venom F5", image: "/images/video/car5.jpg" },
  ];

  const visibleCars = 5;
  const maxIndex = Math.max(0, cars.length - visibleCars);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container relative px-4">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCars)}%)`,
            }}
          >
            {cars.map((car, index) => (
              <div
                key={index}
                className="min-w-[20%] flex-shrink-0 px-4"
              >
                <div className="relative h-[200px] w-full md:h-[250px]">
                  <Image
                    src={getImagePath(car.image)}
                    alt={car.name}
                    fill
                    className="h-full w-full object-cover rounded-lg"
                  />
                </div>
                <p className="mt-4 text-center text-sm font-medium text-black md:text-base">
                  {car.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        {currentIndex > 0 && (
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 text-gray-700 shadow-lg transition hover:bg-gray-100"
            aria-label="Previous car"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        {currentIndex < maxIndex && (
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 text-gray-700 shadow-lg transition hover:bg-gray-100"
            aria-label="Next car"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
};

export default CarCarousel;

