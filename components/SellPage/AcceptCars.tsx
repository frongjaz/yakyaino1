"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";

const AcceptCars = () => {
  const carTypes = [
    {
      icon: (
        <Image
          src={getImagePath("/images/logo/sale_page Icon-13.svg")}
          alt="รถเก๋ง"
          width={120}
          height={120}
          className="h-24 w-24 md:h-28 md:w-28"
        />
      ),
      label: "รถเก๋ง",
    },
    {
      icon: (
        <Image
          src={getImagePath("/images/logo/sale_page Icon-14.svg")}
          alt="รถ SUV"
          width={120}
          height={120}
          className="h-24 w-24 md:h-28 md:w-28"
        />
      ),
      label: "รถ Suv",
    },
    {
      icon: (
        <Image
          src={getImagePath("/images/logo/sale_page Icon-15.svg")}
          alt="รถกระบะ"
          width={120}
          height={120}
          className="h-24 w-24 md:h-28 md:w-28"
        />
      ),
      label: "รถกระบะ",
    },
    {
      icon: (
        <Image
          src={getImagePath("/images/logo/sale_page Icon-16.svg")}
          alt="รถมอเตอร์ไซค์"
          width={120}
          height={120}
          className="h-24 w-24 md:h-28 md:w-28"
        />
      ),
      label: "รถมอเตอร์ไซค์",
    },
    {
      icon: (
        <Image
          src={getImagePath("/images/logo/sale_page Icon-17.svg")}
          alt="รถตู้"
          width={120}
          height={120}
          className="h-24 w-24 md:h-28 md:w-28"
        />
      ),
      label: "รถตู้",
    },
    {
      icon: (
        <Image
          src={getImagePath("/images/logo/sale_page Icon-18.svg")}
          alt="รถหรู"
          width={120}
          height={120}
          className="h-24 w-24 md:h-28 md:w-28"
        />
      ),
      label: "รถหรู",
    },
  ];

  return (
    <section className="bg-[#DC2626] py-16 md:py-20">
      <div className="container px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">
          รับรถอะไรบ้าง
        </h2>
        
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {carTypes.map((car, index) => (
            <div key={index} className="flex flex-col items-center text-center gap-4">
                {car.icon}
              
              <p className="text-sm font-medium text-white md:text-base">
                {car.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AcceptCars;

