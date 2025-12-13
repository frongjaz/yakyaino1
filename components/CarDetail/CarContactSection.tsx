"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const CarContactSection = () => {
  return (
    
    <div className="rounded-lg bg-[#2C2C2C] p-6">
      
      <h3 className="mb-4 text-xl font-bold text-white">ติดต่อสอบถาม</h3>
      
      <div className="space-y-3">
        {/* LINE Button */}
        <Link
          href="https://line.me"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#8BC43F] px-6 py-3 font-semibold text-white transition hover:bg-[#7AB32F]"
        >
          <Image
            src={getImagePath("/images/logo/line 01 Icon-06.svg")}
            alt="LINE"
            width={24}
            height={24}
            className="h-6 w-6"
          />
          <span>@nattaauto</span>
        </Link>
        
        {/* Phone Button */}
        <Link
          href="tel:0625646455"
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#EF4444] px-6 py-3 font-semibold text-white transition hover:bg-[#DC2626]"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span>062-564-6455</span>
        </Link>
      </div>
    </div>
  );
};

export default CarContactSection;

