import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const AboutUs = () => {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container px-4">
        <h2 className="mb-6 text-center text-3xl font-bold text-black md:text-4xl">
          เกี่ยวกับเรา
        </h2>
        <p className="mx-auto mb-8 max-w-3xl text-center text-base leading-relaxed text-gray-700 md:text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
          in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="relative h-[250px] w-full md:h-[300px]">
              <Image
                src={getImagePath("/images/video/car5.jpg")}
                alt={`Showroom ${index}`}
                fill
                className="h-full w-full rounded-lg object-cover"
              />
              {index === 2 && (
                <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-black/60 p-4 text-white">
                  <p className="font-bold">V-AUTOCAR</p>
                  <p className="text-sm">062-5646425</p>
                  <p className="text-sm">062-5646452</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/about"
            className="inline-block rounded-md bg-[#EF4444] px-8 py-3 font-semibold text-white transition hover:bg-[#DC2626]"
          >
            อ่านต่อ
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

