import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const AboutUs = () => {
  const images = [
    {
      src: "/images/about/S__5800084_0.jpg",
      alt: "Car Dealership Showroom 1",
    },
    {
      src: "/images/about/S__5800061.jpg",
      alt: "Car Dealership Showroom 2",
    },
    {
      src: "/images/about/S__5800062.jpg",
      alt: "Car Dealership Showroom 3",
    },
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container px-4">
        <h2 className="mb-6 text-center text-3xl font-bold text-[#EF4444] md:text-4xl">
          เกี่ยวกับเรา
        </h2>
        <p className="mx-auto mb-8 max-w-3xl text-center text-base leading-relaxed text-gray-700 md:text-lg">
          
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <Image
                src={getImagePath(image.src)}
                alt={image.alt}
                fill
                className={`h-full w-full rounded-lg object-cover ${
                  index === 0 ? "object-bottom" : "object-center"
                }`}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/about"
            className="inline-block rounded-full border-2 border-[#EF4444] bg-white px-8 py-3 font-semibold text-[#EF4444] transition hover:bg-[#EF4444] hover:text-white"
          >
            อ่านต่อ
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

