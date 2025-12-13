"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const carBrands = [
    "โตโยต้า",
    "ฮอนด้า",
    "มาสด้า",
    "มิตซูบิชิ",
    "นิสสัน",
    "อีซูซุ",
    "ฟอร์ด",
    "ซูซูกิ",
    "เชฟโรเลต",
    "เอ็มจี",
  ];

  return (
    <>
      <footer className="relative overflow-hidden pt-16 md:pt-20 lg:pt-24">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={getImagePath("/images/hero/hand-steering-wheel-sunset-highway-drive-evening-car-travel.jpg")}
            alt="Car Interior Background"
            fill
            className="h-full w-full object-cover"
          />
          {/* Fade gradient from top */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40"></div>
        </div>

        {/* Red top border */}
        <div className="absolute top-0 left-0 right-0 z-10 h-[2px] bg-[#EF4444]"></div>

        {/* Background blur effect */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>

        <div className="container relative z-10 px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Left section - Logo and Description */}
            <div className="md:col-span-1">
              <Link href="/" className="mb-6 inline-block">
                <Image
                  src={getImagePath("/images/logo/V auto car logo-02.png")}
                  alt="V-AUTOCAR Logo"
                  width={120}
                  height={48}
                  className="h-auto max-w-[120px] w-auto"
                />
              </Link>
              <p className="mb-6 text-sm leading-relaxed text-white">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <p className="text-sm text-[#EF4444]">
                Copyright © 2025. All rights reserved.
              </p>
            </div>

            {/* Car Brands Section */}
            <div className="md:col-span-1">
              <h3 className="mb-6 text-lg font-bold text-[#EF4444]">ยีห้อรถ</h3>
              <div className="grid grid-cols-2 gap-2">
                {carBrands.map((brand, index) => (
                  <Link
                    key={index}
                    href="#"
                    className="border-b border-white/20 pb-2 text-sm text-white transition hover:text-[#EF4444]"
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            </div>

            {/* Services Section */}
            <div className="md:col-span-1">
              <h3 className="mb-6 text-lg font-bold text-[#EF4444]">
                บริการของเรา
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="block border-b border-white/20 pb-2 text-sm text-white transition hover:text-[#EF4444]"
                  >
                    ขายรถ
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="block border-b border-white/20 pb-2 text-sm text-white transition hover:text-[#EF4444]"
                  >
                    รถทั้งหมด
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Section */}
            <div className="md:col-span-1">
              <h3 className="mb-6 text-lg font-bold text-[#EF4444]">
                ช่องทางการติดต่อ
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8BC43F]">
                    <Image
                      src={getImagePath("/images/logo/line 01 Icon-06.svg")}
                      alt="LINE"
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                  </div>
                  <span className="text-sm text-white">@nattaauto</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1877F2]">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <span className="text-sm text-white">thaanaat.k</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                  </div>
                  <span className="text-sm text-white">@nattaauto</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF0000]">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                  <span className="text-sm text-white">@nattaauto</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <svg
                      className="h-4 w-4 text-white"
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
                  </div>
                  <span className="text-sm text-white">062-564-6455</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
