"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";

const HistorySection = () => {
  return (
    <section className="bg-[#2C2C2C] py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
          {/* Left: Text Content */}
          <div>
            <h2 className="mb-6 text-3xl font-bold text-[#EF4444] md:text-4xl">
              ประวัติคุณชัย
            </h2>
            <p className="mb-4 text-base leading-relaxed text-white md:text-lg">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever
              since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book.
            </p>
            <p className="text-base leading-relaxed text-white md:text-lg">
              It has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages.
            </p>
          </div>

          {/* Right: Image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg md:aspect-[3/4]">
            <Image
              src={getImagePath("/images/hero/5668644531.png")}
              alt="ประวัติคุณชัย"
              fill
              className="object-contain object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Fade gradient from bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#2C2C2C] to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;

