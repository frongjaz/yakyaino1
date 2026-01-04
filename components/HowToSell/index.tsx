"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

const HowToSell = () => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [advancedSearch, setAdvancedSearch] = useState("");

  const carBrands = [
    "โตโยต้า",
    "ฮอนด้า",
    "มาสด้า",
    "นิสสัน",
    "อีซูซุ",
    "ฟอร์ด",
    "เชฟโรเลต",
    "เอ็มจี",
  ];

  return (
    <>
      {/* Hero Section with Search Form */}
      <section className="relative overflow-hidden">
        <div className="relative h-[550px] w-full overflow-x-hidden md:h-[650px] lg:h-[750px]">
          {/* Background Image with fade effect */}
          <div className="absolute inset-0">
            <Image
              src={getImagePath("/images/hero/sky-suspension-high-road-freeway.jpg")}
              alt="Highway Background"
              fill
              priority
              className="h-full w-full object-cover scale-105 transition-transform duration-700 hover:scale-100"
            />
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/80 via-transparent to-transparent"></div>
          </div>
          {/* Enhanced backdrop blur overlay */}
          <div className="absolute inset-0 backdrop-blur-[3px] bg-gradient-to-b from-[#EF4444]/10 via-transparent to-[#2C2C2C]/40"></div>
          
          <div className="container relative z-10 h-full px-4 sm:px-6 lg:px-8">
            <div className="flex h-full items-center py-6 sm:py-8">
              <div className="grid w-full max-w-full grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
                {/* Left side - Car image (flipped to face right) */}
                <div className="relative h-[280px] w-full overflow-hidden sm:h-[350px] md:h-[450px] lg:h-[680px] xl:h-[720px]">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#EF4444]/5 to-transparent"></div>
                  <Image
                    src={getImagePath("/images/hero/123.png")}
                    alt="Ferrari Car"
                    fill
                    className="scale-x-[-1] object-contain object-center transition-transform duration-500 hover:scale-x-[-1.05] lg:object-left"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#EF4444]/0 via-[#EF4444]/10 to-[#EF4444]/0 opacity-50 blur-3xl"></div>
                </div>

                {/* Right side - Search Form */}
                <div className="flex justify-center lg:justify-end">
                  <div className="w-full max-w-full transform rounded-2xl border-2 border-[#EF4444]/80 bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 p-5 shadow-2xl shadow-[#EF4444]/20 backdrop-blur-md transition-all duration-300 hover:border-[#EF4444] hover:shadow-[#EF4444]/30 sm:max-w-md sm:p-7 md:p-9 lg:scale-105">
                    <div className="mb-5 flex items-center gap-3 sm:mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#EF4444] to-[#DC2626] shadow-lg">
                        <svg
                          className="h-6 w-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">
                        <span className="bg-gradient-to-r from-[#EF4444] to-[#FF6B6B] bg-clip-text text-transparent">
                          ผู้นำมาตรฐานรถมือสอง
                        </span>
                      </h3>
                    </div>
                    <form className="space-y-4 sm:space-y-5">
                      <div>
                        <label className="mb-2.5 block text-sm font-semibold text-white/90">
                          ยี่ห้อรถที่ต้องการ
                        </label>
                        <div className="relative">
                          <select
                            value={selectedBrand}
                            onChange={(e) => setSelectedBrand(e.target.value)}
                            className="w-full appearance-none rounded-xl border-2 border-[#EF4444]/50 bg-gray-700/80 px-4 py-3 pr-10 text-white backdrop-blur-sm transition-all duration-300 placeholder:text-gray-400 hover:border-[#EF4444] focus:border-[#EF4444] focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EF4444]/30"
                          >
                            <option value="" className="bg-gray-800">เลือกยี่ห้อ</option>
                            {carBrands.map((brand) => (
                              <option key={brand} value={brand} className="bg-gray-800">
                                {brand}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                            <svg
                              className="h-5 w-5 text-[#EF4444] transition-transform duration-200"
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
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="mb-2.5 block text-sm font-semibold text-white/90">
                            ราคาต่ำสุด
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                              <span className="text-sm">฿</span>
                            </div>
                            <input
                              type="number"
                              value={minPrice}
                              onChange={(e) => setMinPrice(e.target.value)}
                              placeholder="0"
                              className="w-full appearance-none rounded-xl border-2 border-[#EF4444]/50 bg-gray-700/80 px-4 py-3 pl-8 pr-4 text-white backdrop-blur-sm transition-all duration-300 placeholder:text-gray-400 hover:border-[#EF4444] focus:border-[#EF4444] focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EF4444]/30"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-2.5 block text-sm font-semibold text-white/90">
                            ราคาสูงสุด
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                              <span className="text-sm">฿</span>
                            </div>
                            <input
                              type="number"
                              value={maxPrice}
                              onChange={(e) => setMaxPrice(e.target.value)}
                              placeholder="0"
                              className="w-full appearance-none rounded-xl border-2 border-[#EF4444]/50 bg-gray-700/80 px-4 py-3 pl-8 pr-4 text-white backdrop-blur-sm transition-all duration-300 placeholder:text-gray-400 hover:border-[#EF4444] focus:border-[#EF4444] focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EF4444]/30"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <button
                          type="button"
                          className="text-xs text-white/80 underline-offset-2 transition-all hover:text-[#EF4444] hover:underline sm:text-sm"
                        >
                          เครื่องมือการค้นหาขั้นสูง
                        </button>
                        <button
                          type="submit"
                          className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#EF4444] to-[#DC2626] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#EF4444]/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#EF4444]/40 sm:w-auto"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            <svg
                              className="h-5 w-5 transition-transform group-hover:scale-110"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                            ค้นหา
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-[#DC2626] to-[#EF4444] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-gradient-to-b from-[#2C2C2C] via-[#1a1a1a] to-[#2C2C2C] py-16 md:py-20 lg:py-24">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            {/* Left side - Text content */}
            <div className="space-y-6">
              <div className="inline-block">
                <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl xl:text-6xl">
                  <span className="bg-gradient-to-r from-white via-white to-[#EF4444] bg-clip-text text-transparent">
                    ซื้อขายกับเราดีอย่างไร
                  </span>
                </h2>
                <div className="h-1 w-20 rounded-full bg-gradient-to-r from-[#EF4444] to-[#DC2626]"></div>
              </div>
              <div className="space-y-4 text-base leading-relaxed text-white/90 md:text-lg md:leading-8">
                <p className="text-left">
                  การขายรถกับเราเป็นเรื่องง่าย รวดเร็ว และโปร่งใส เพราะเราประเมิน
                  ราคารถทุกคันตามสภาพจริง ไม่กดราคา และอธิบายเหตุผลอย่างตรงไป
                  ตรงมา ลูกค้าจึงมั่นใจได้ว่าจะได้รับข้อเสนอที่ยุติธรรมที่สุด
                </p>
                <p className="text-left">
                  เรามีทีมผู้เชี่ยวชาญตรวจสภาพรถอย่างมืออาชีพ พร้อมชำระเงินทันทีหลังตกลง
                  ราคา ไม่ต้องรอนานหรือทำขั้นตอนยุ่งยาก นอกจากนี้ เรายังดูแลเรื่อง
                  เอกสารทั้งหมด ตั้งแต่สัญญาซื้อขาย การปิดไฟแนนซ์ ไปจนถึงการโอน
                  กรรมสิทธิ์ให้เสร็จสิ้น เพื่อให้ลูกค้าสบายใจและประหยัดเวลา
                </p>
                <p className="text-left">
                  ด้วยประสบการณ์ยาวนานกว่า ?? ปี เราเข้าใจทุกขั้นตอนของการซื้อ
                  -ขายรถ และพร้อมมอบบริการที่ซื่อสัตย์ ปลอดภัย และไว้วางใจได้อย่าง
                  เต็มที่
                </p>
              </div>
            </div>

            {/* Right side - Person image */}
            <div className="relative h-[350px] w-full overflow-hidden rounded-2xl md:h-[450px] lg:h-[600px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#EF4444]/10 via-transparent to-[#EF4444]/5"></div>
              <Image
                src={getImagePath("/images/hero/21312.png")}
                alt="Professional"
                fill
                className="h-full w-full object-contain transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Enhanced fade gradient from bottom */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#2C2C2C] via-[#2C2C2C]/80 to-transparent"></div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#EF4444]/5 to-transparent opacity-50 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HowToSell;

