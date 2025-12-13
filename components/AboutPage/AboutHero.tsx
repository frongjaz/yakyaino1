"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";

const AboutHero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[500px] w-full md:h-[600px] lg:h-[700px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={getImagePath("/images/hero/Aboutbanner.png")}
            alt="About Background"
            fill
            priority
            className="h-full w-full object-cover"
          />

        </div>

        {/* Content */}
        <div className="container relative z-10 h-full px-4">
          <div className="flex h-full flex-col items-center justify-center text-center">
            {/* Large white circular icon with "i" */}
            <div className="mb-2 flex items-center justify-center">
              <Image
                src={getImagePath("/images/logo/about_page_tile Icon-50.svg")}
                alt="About"
                width={200}
                height={200}
                className="h-20 w-20 md:h-28 md:w-28 lg:h-36 lg:w-36"
              />
            </div>

            {/* About heading */}
            <h1 className="mb-4 text-5xl font-bold text-white drop-shadow-lg md:text-6xl lg:text-7xl">
              About
            </h1>

            {/* Thai subtitle */}
            <p className="text-xl font-semibold text-[#EF4444] md:text-2xl lg:text-3xl">
              เกี่ยวกับเรา
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;

