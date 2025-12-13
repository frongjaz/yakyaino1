"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type RelatedCar = {
  id: string | number;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  photoCount: number;
};

const RelatedCars = () => {
  const relatedCars: RelatedCar[] = [
    {
      id: 1,
      brand: "BMW",
      model: "520D 2.0",
      year: 2012,
      price: 1000000,
      image: "/images/hero/1231384.png",
      photoCount: 6,
    },
    {
      id: 2,
      brand: "MAZDA",
      model: "CX-3 1.5 XDL",
      year: 2018,
      price: 1000000,
      image: "/images/hero/1231384.png",
      photoCount: 6,
    },
    {
      id: 3,
      brand: "HONDA",
      model: "HR-V 1.5 EL E:HEV",
      year: 2025,
      price: 1000000,
      image: "/images/hero/1231384.png",
      photoCount: 6,
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH").format(price);
  };

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">รถที่เกี่ยวข้อง</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {relatedCars.map((car) => (
            <div
              key={car.id}
              className="group relative overflow-hidden rounded-lg bg-gray-800"
            >
              {/* Car Image */}
              <div className="relative h-48 w-full">
                <Image
                  src={getImagePath(car.image)}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Photo Count Badge */}
                <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-white">
                  <svg
                    className="h-3.5 w-3.5 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="ml-0.5 text-xs font-semibold text-black">
                    {car.photoCount}
                  </span>
                </div>

                {/* Year Badge */}
                <div className="absolute right-4 top-4 rounded-md bg-[#EF4444] px-3 py-1.5 text-sm font-bold text-white">
                  {car.year}
                </div>
              </div>

              {/* Car Info */}
              <div className="bg-gray-800 p-4">
                <h3 className="mb-1 text-lg font-bold uppercase text-[#EF4444]">
                  {car.brand}
                </h3>
                <p className="mb-3 text-sm text-white">
                  {car.model} {car.year}
                </p>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex-1"></div>
                  <p className="text-xl font-bold text-[#EF4444]">
                    {formatPrice(car.price)}
                  </p>
                </div>
                <div className="mb-3 h-px bg-gray-700"></div>
                <Link
                  href={`/cars/${car.id}`}
                  className="flex items-center justify-between text-sm text-white transition hover:text-gray-300"
                >
                  <span>ดูทั้งหมด</span>
                  <svg
                    className="h-4 w-4 text-[#EF4444]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedCars;

