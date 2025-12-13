"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";

const AboutUsContent = () => {
  const images = [
    {
      src: "/images/about/S__5800084_0.jpg",
      alt: "Car Dealership Showroom 1",
    },
    {
      src: "/images/about/S__5800062.jpg",
      alt: "Car Dealership Showroom 2",
    },
    {
      src: "/images/about/S__5800061.jpg",
      alt: "Car Dealership Showroom 3",
    },
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-center text-3xl font-bold text-[#EF4444] md:text-4xl">
          เกี่ยวกับเรา
        </h2>
        <p className="mx-auto mb-8 max-w-3xl text-center text-base leading-relaxed text-gray-700 md:text-lg">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {images.map((image, index) => (
            <div key={index} className="relative h-[250px] w-full md:h-[300px]">
              <Image
                src={getImagePath(image.src)}
                alt={image.alt}
                fill
                className={`h-full w-full rounded-lg object-cover ${
                  index === 0 ? "object-bottom" : ""
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUsContent;

