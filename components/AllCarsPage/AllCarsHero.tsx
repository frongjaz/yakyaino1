"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";

const AllCarsHero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[400px] w-full md:h-[500px] lg:h-[600px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={getImagePath("/images/hero/Gemini.png")}
            alt="All Cars Background"
            fill
            priority
            className="h-full w-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        {/* Content */}
        <div className="container relative z-10 h-full px-4">
          <div className="flex h-full flex-col items-center justify-center text-center">
            {/* Car Icon */}
            <div className="mb-6">
              <Image
                src={getImagePath("/images/logo/car_page_title Icon-27.svg")}
                alt="Car Icon"
                width={120}
                height={120}
                className="h-24 w-24 md:h-32 md:w-32"
                priority
              />
            </div>

            {/* All Car heading */}
            <h1 className="mb-2 text-5xl font-bold text-white drop-shadow-lg md:text-6xl lg:text-7xl">
              All Car
            </h1>

            {/* Thai subtitle */}
            <p className="text-xl font-semibold text-white md:text-2xl lg:text-3xl">
              รถทั้งหมด
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllCarsHero;

