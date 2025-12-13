"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const SellHero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[500px] w-full md:h-[600px] lg:h-[700px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={getImagePath("/images/hero/hand-steering-wheel-sunset-highway-drive-evening-car-travel.jpg")}
            alt="Car Dealership Background"
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
            {/* Phone numbers - Top left */}
     

            {/* Shopping bag icon with SALE tag */}
            <div className="mb-6 relative inline-block">
              <div className="flex items-center justify-center">
                <Image
                  src={getImagePath("/images/logo/Sale_page_title Icon-12.svg")}
                  alt="Sell to Us Icon"
                  width={120}
                  height={120}
                  className="drop-shadow-lg"
                  priority
                />
              </div>
            </div>

            {/* Sell to Us heading */}
            <h1 className="mb-8 text-5xl font-bold text-white drop-shadow-lg md:text-6xl lg:text-7xl">
              Sell to Us
            </h1>

            {/* Sell Car button */}
            <Link
              href="#contact"
              className="rounded-lg bg-[#EF4444] px-10 py-4 text-lg font-semibold text-white transition hover:bg-[#DC2626] shadow-lg"
            >
              ขายรถ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellHero;

