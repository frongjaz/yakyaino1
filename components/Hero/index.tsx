"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "ขายรถให้เรา...",
      subtitle: "จบไวภายใน 15นาที",
      carImage: "/images/video/car5.jpg",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <>
      <section
        id="home"
        className="relative z-10 overflow-hidden bg-[#8B3A3A] pb-16 pt-[120px] md:pb-20 md:pt-[140px] lg:pt-[160px]"
      >
        {/* Roman numeral clock background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-[15%] top-[20%] text-[180px] font-bold text-white/15 md:text-[250px] lg:text-[300px]">
            XII
          </div>
          <div className="absolute right-[15%] top-[20%] text-[180px] font-bold text-white/15 md:text-[250px] lg:text-[300px]">
            I
          </div>
        </div>

        {/* Radial gradient overlay */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.6) 100%)'
        }}></div>

        <div className="container relative z-10 px-4">
          <div className="flex flex-col items-center lg:flex-row lg:justify-between lg:gap-12">
          {/* Left side - Text content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl font-bold leading-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl xl:text-7xl">
              {slides[currentSlide].title}
            </h1>
            <h2 className="mt-2 text-3xl font-bold leading-tight text-white drop-shadow-lg md:text-4xl lg:text-5xl xl:text-6xl">
              {slides[currentSlide].subtitle}
            </h2>
          </div>

            {/* Right side - Car image (split car effect) */}
            <div className="relative mt-8 flex-1 lg:mt-0">
              <div className="relative h-[300px] w-full md:h-[400px] lg:h-[500px]">
                <Image
                  src={getImagePath("/images/video/car5.jpg")}
                  alt="รถยนต์"
                  fill
                  priority
                  className="h-full w-full object-contain"
                />
                {/* Split effect overlay - can be enhanced with actual split car images */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition hover:bg-white/30 lg:left-8"
            aria-label="Previous slide"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition hover:bg-white/30 lg:right-8"
            aria-label="Next slide"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </section>
    </>
  );
};

export default Hero;
