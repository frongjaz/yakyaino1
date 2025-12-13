"use client";
import { useState } from "react";
import Image from "next/image";
import { getImagePath } from "@/lib/utils";

const SearchFilterSection = () => {
  const [selectedTab, setSelectedTab] = useState<"all" | "new">("all");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const brands = [
    "ทั้งหมด",
    "โตโยต้า",
    "ฮอนด้า",
    "มาสด้า",
    "มิตซูบิชิ",
    "นิสสัน",
    "อีซูซุ",
    "ฟอร์ด",
    "เชฟโรเลต",
    "เอ็มจี",
  ];

  const priceRanges = [
    "ทั้งหมด",
    "0 - 500,000",
    "500,000 - 1,000,000",
    "1,000,000 - 2,000,000",
    "2,000,000 - 5,000,000",
    "5,000,000+",
  ];

  return (
    <section className="relative overflow-hidden py-8 md:py-12">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={getImagePath("/images/about/S__5800084_0.jpg")}
          alt="Car Dealership Background"
          fill
          className="h-full w-full object-cover"
          style={{ 
            objectPosition: "75% 74%",
            transform: "scale(1.2)"
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Search Interface Container with red border */}
        <div className="mx-auto max-w-4xl rounded-lg border border-[#EF4444] bg-gray-800/90 p-6 backdrop-blur-sm">
          {/* Tab Buttons */}
          <div className="mb-6 flex gap-0">
            <button
              onClick={() => setSelectedTab("all")}
              className={`px-6 py-3 font-semibold text-white transition ${
                selectedTab === "all"
                  ? "bg-[#EF4444]"
                  : "bg-gray-700 border-b-2 border-[#EF4444]"
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setSelectedTab("new")}
              className={`px-6 py-3 font-semibold text-white transition ${
                selectedTab === "new"
                  ? "bg-[#EF4444]"
                  : "bg-gray-700 border-b-2 border-[#EF4444]"
              }`}
            >
              ใหม่
            </button>
          </div>

          {/* Filter Dropdowns */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Brand Dropdown */}
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full appearance-none border border-[#EF4444] bg-gray-800/90 px-4 py-3 text-white focus:border-[#EF4444] focus:outline-none"
              >
                <option value="" className="bg-gray-800">
                  ยี่ห้อรถที่ต้องการ
                </option>
                {brands.map((brand) => (
                  <option key={brand} value={brand} className="bg-gray-800">
                    {brand}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <svg
                  className="h-5 w-5 text-white"
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

            {/* Min Price Dropdown */}
            <div className="relative">
              <select
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full appearance-none border border-[#EF4444] bg-gray-800/90 px-4 py-3 text-white focus:border-[#EF4444] focus:outline-none"
              >
                <option value="" className="bg-gray-800">
                  ราคาต่ำสุด
                </option>
                {priceRanges.map((price) => (
                  <option key={price} value={price} className="bg-gray-800">
                    {price}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <svg
                  className="h-5 w-5 text-white"
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

            {/* Max Price Dropdown */}
            <div className="relative">
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full appearance-none border border-[#EF4444] bg-gray-800/90 px-4 py-3 text-white focus:border-[#EF4444] focus:outline-none"
              >
                <option value="" className="bg-gray-800">
                  ราคาสูงสุด
                </option>
                {priceRanges.map((price) => (
                  <option key={price} value={price} className="bg-gray-800">
                    {price}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <svg
                  className="h-5 w-5 text-white"
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

          {/* Search Actions */}
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <a
              href="#"
              className="text-sm text-white hover:text-gray-300 transition"
            >
              เครื่องมือการค้นหาขั้นสูง
            </a>
            <button className="bg-[#EF4444] px-8 py-3 font-semibold text-white transition hover:bg-[#DC2626]">
              ค้นหา
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchFilterSection;

