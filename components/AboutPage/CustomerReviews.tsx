"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";

const CustomerReviews = () => {
  const reviews = [
    {
      image: "/images/about/S__5800084_0.webp",
      alt: "Customer Review 1",
    },
    {
      image: "/images/about/S__5800062.webp",
      alt: "Customer Review 2",
    },
    {
      image: "/images/about/S__5800061.webp",
      alt: "Customer Review 3",
    },
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-[#EF4444] md:text-4xl">
          รีวิวจากลูกค้า
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {reviews.map((review, index) => (
            <div key={index} className="relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                <Image
                  src={getImagePath(review.image)}
                  alt={review.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Red bow decoration overlay (optional) */}
                <div className="absolute top-4 right-4">
                  <div className="h-16 w-16 rounded-full bg-[#EF4444]/20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="mt-12 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#EF4444] bg-white">
            <svg
              className="h-6 w-6 text-[#EF4444]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;

