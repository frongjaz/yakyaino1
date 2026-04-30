"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";

interface CarPricingProps {
  price: number;
  monthlyPayment?: number;
}

const CarPricing = ({ price, monthlyPayment }: CarPricingProps) => {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("th-TH").format(amount);
  };

  return (
    <div className="mt-6 flex items-center justify-between">
      <div>
        <div className="mb-2">
          <button className="rounded-lg bg-[#EF4444] px-6 py-3 text-lg font-bold text-white">
            PRICE {formatPrice(price)}-
          </button>
        </div>
        {monthlyPayment && (
          <p className="text-sm text-gray-600">
            ค่างวด : {formatPrice(monthlyPayment)}-
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <Image src={getImagePath("/images/logo/car_page_printredIcon-28.svg")} alt="Share" width={50} height={50} />
        <Image src={getImagePath("/images/logo/car_page_shareredIcon-29.svg")} alt="Share" width={50} height={50} />
      </div>
    </div>
  );
};

export default CarPricing;

