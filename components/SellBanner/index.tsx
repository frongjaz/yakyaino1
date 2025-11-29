import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const SellBanner = () => {
  return (
    <section className="bg-[#EF4444] py-16 md:py-20">
      <div className="container px-4">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          {/* Left side - Car image */}
          <div className="relative h-[300px] w-full md:h-[400px]">
            <Image
              src={getImagePath("/images/video/car3.jpg")}
              alt="Mercedes-Benz CLA-Class"
              fill
              className="h-full w-full object-contain"
            />
          </div>

          {/* Right side - Text content */}
          <div className="text-white">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
              ขายรถกับทางเรา
            </h2>
            <p className="mb-6 text-base leading-relaxed text-white/90 md:text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <Link
              href="/sell"
              className="inline-block rounded-md bg-white px-8 py-3 font-semibold text-[#EF4444] transition hover:bg-gray-100"
            >
              ขายรถ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellBanner;

