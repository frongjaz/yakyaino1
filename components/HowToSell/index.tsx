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
        <div className="relative h-[500px] w-full md:h-[600px] lg:h-[700px]">
          {/* Background Image with fade effect */}
          <div className="absolute inset-0">
            <Image
              src={getImagePath("/images/hero/sky-suspension-high-road-freeway.jpg")}
              alt="Highway Background"
              fill
              priority
              className="h-full w-full object-cover"
            />
            {/* Fade gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
          </div>
          {/* Backdrop blur overlay */}
          <div className="absolute inset-0 backdrop-blur-[2px] bg-black/30"></div>
          {/* Fade from bottom - above backdrop blur */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#2C2C2C] to-transparent"></div>
          
          <div className="container relative z-10 h-full px-4">
            <div className="flex h-full items-center">
              <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
                {/* Left side - Car image (flipped to face right) */}
                <div className="relative h-[400px] w-full md:h-[500px] lg:h-[650px] xl:h-[700px]">
                  <Image
                    src={getImagePath("/images/hero/123.png")}
                    alt="Ferrari Car"
                    fill
                    className="h-full w-full scale-x-[-1] object-contain object-left"
                  />
                </div>

                {/* Right side - Search Form */}
                <div className="flex justify-center lg:justify-end">
                  <div className="w-full max-w-md rounded-lg border-2 border-[#EF4444] bg-gray-800/90 p-6 backdrop-blur-sm md:p-8">
                    <h3 className="mb-6 text-xl font-bold text-[#EF4444] md:text-2xl">
                      ผู้นำมาตรฐานรถมือสอง
                    </h3>
                    <form className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-white">
                          ยี่ห้อรถที่ต้องการ
                        </label>
                        <div className="relative">
                          <select
                            value={selectedBrand}
                            onChange={(e) => setSelectedBrand(e.target.value)}
                            className="w-full appearance-none rounded-md border-2 border-[#EF4444] bg-gray-700 px-4 py-2 pr-10 text-white focus:border-[#EF4444] focus:outline-none focus:ring-2 focus:ring-[#EF4444]/20"
                          >
                            <option value="">เลือกยี่ห้อ</option>
                            {carBrands.map((brand) => (
                              <option key={brand} value={brand} className="bg-gray-700">
                                {brand}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
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
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-white">
                            ราคาต่ำสุด
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={minPrice}
                              onChange={(e) => setMinPrice(e.target.value)}
                              placeholder="0"
                              className="w-full appearance-none rounded-md border-2 border-[#EF4444] bg-gray-700 px-4 py-2 pr-10 text-white focus:border-[#EF4444] focus:outline-none focus:ring-2 focus:ring-[#EF4444]/20"
                            />
                            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
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
                        <div>
                          <label className="mb-2 block text-sm font-medium text-white">
                            ราคาสูงสุด
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={maxPrice}
                              onChange={(e) => setMaxPrice(e.target.value)}
                              placeholder="0"
                              className="w-full appearance-none rounded-md border-2 border-[#EF4444] bg-gray-700 px-4 py-2 pr-10 text-white focus:border-[#EF4444] focus:outline-none focus:ring-2 focus:ring-[#EF4444]/20"
                            />
                            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
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
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <button
                          type="button"
                          className="text-sm text-white hover:text-[#EF4444] transition-colors"
                        >
                          เครื่องมือการค้นหาขั้นสูง
                        </button>
                        <button
                          type="submit"
                          className="rounded-md bg-[#EF4444] px-6 py-2 font-semibold text-white transition hover:bg-[#DC2626]"
                        >
                          ค้นหา
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
      <section className="bg-[#2C2C2C] ">
        <div className="container px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
            {/* Left side - Text content */}
            <div>
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                ซื้อขายกับเราดีอย่างไร
              </h2>
              <div className="text-base md:text-lg leading-7 md:leading-8 text-white">
                <p className="text-left">
                  การขายรถกับเราเป็นเรื่องง่าย รวดเร็ว และโปร่งใส เพราะเราประเมิน
                  ราคารถทุกคันตามสภาพจริง ไม่กดราคา และอธิบายเหตุผลอย่างตรงไป
                  ตรงมา ลูกค้าจึงมั่นใจได้ว่าจะได้รับข้อเสนอที่ยุติธรรมที่สุด เรามีทีมผู้
                  เชียวชาญตรวจสภาพรถอย่างมืออาชีพ พร้อมชำระเงินทันทีหลังตกลง
                  ราคา ไม่ต้องรอนานหรือทำขั้นตอนยุ่งยาก นอกจากนี้ เรายังดูแลเรื่อง
                  เอกสารทั้งหมด ตั้งแต่สัญญาซื้อขาย การปิดไฟแนนซ์ ไปจนถึงการโอน
                  กรรมสิทธิ์ให้เสร็จสิ้น เพื่อให้ลูกค้าสบายใจและประหยัดเวลา ด้วย
                  ประสบการณ์ยาวนานกว่า ?? ปี เราเข้าใจทุกขั้นตอนของการซื้อ
                  -ขายรถ และพร้อมมอบบริการที่ซื่อสัตย์ ปลอดภัย และไว้วางใจได้อย่าง
                  เต็มที่
                </p>
              </div>
            </div>

            {/* Right side - Person image */}
            <div className="relative h-[400px] w-full md:h-[500px] lg:h-[600px]">
              <Image
                src={getImagePath("/images/hero/21312.png")}
                alt="Professional"
                fill
                className="h-full w-full object-contain"
              />
              {/* Fade gradient from bottom */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#2C2C2C] to-transparent"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HowToSell;

