import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const SellBanner = () => {
  return (
    <section className="w-full bg-[#DC2626] py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2">
          {/* Left side - Car image */}
          <div className="relative h-[200px] w-full md:h-[250px]">
            <Image
              src={getImagePath("/images/hero/5467894.png")}
              alt="Mercedes-Benz CLA-Class"
              fill
              className="h-full w-full object-contain"
            />
          </div>

          {/* Right side - Text content */}
          <div className="text-center text-white lg:text-left">
            <h2 className="mb-2 text-2xl font-bold md:text-3xl lg:text-4xl">
              ขายรถกับทางเรา
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
            <div className="flex items-center justify-center gap-4 lg:justify-start">
              <Link
                href="/sell"
                className="inline-block rounded-full border-2 border-white bg-[#DC2626] px-8 py-3 font-semibold text-white transition hover:bg-[#B91C1C]"
              >
                ขายรถ
              </Link>
              <Link
                href="https://line.me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8BC43F] transition hover:bg-[#7AB32F]"
                aria-label="LINE"
              >
                <Image
                  src={getImagePath("/images/logo/line 01 Icon-06.svg")}
                  alt="LINE"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellBanner;

