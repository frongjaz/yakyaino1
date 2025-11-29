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
    <section className="bg-[#2C2C2C] py-16 md:py-20 lg:py-24">
      <div className="container px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left side - Text content */}
          <div className="lg:col-span-1">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              ซื้อขายกับเราดีอย่างไร
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-gray-300">
              <p>
                การขายรถกับเรามีข้อดีหลายประการ เริ่มจากการขายที่ง่ายและรวดเร็ว
                ไม่ต้องเสียเวลานาน กระบวนการโปร่งใสทุกขั้นตอน
                ราคาที่เป็นธรรมตามสภาพรถจริง
              </p>
              <p>
                เรามีทีมผู้เชี่ยวชาญในการตรวจสอบสภาพรถ
                ชำระเงินทันทีหลังตรวจสอบเสร็จ
                และช่วยดูแลเอกสารทุกขั้นตอนให้คุณ
              </p>
            </div>
          </div>

          {/* Middle - Car image */}
          <div className="relative lg:col-span-1">
            <div className="relative h-[300px] w-full md:h-[400px] lg:h-[500px]">
              <Image
                src={getImagePath("/images/video/car2.jpg")}
                alt="Ferrari 296 GTB"
                fill
                className="h-full w-full object-contain"
              />
            </div>
            {/* Person image below car */}
            <div className="relative mt-4 h-[150px] w-full md:h-[200px]">
              <div className="h-full w-full rounded-lg bg-gray-700"></div>
            </div>
          </div>

          {/* Right side - Search form */}
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-6">
              <h3 className="mb-6 text-xl font-bold text-black">
                ผู้นำมาตรฐานรถมือสอง
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    ยี่ห้อรถที่ต้องการ
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-black focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">เลือกยี่ห้อ</option>
                    {carBrands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    ราคาต่ำสุด
                  </label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-black focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    ราคาสูงสุด
                  </label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-black focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    เครื่องมือการค้นหาขั้นสูง
                  </label>
                  <input
                    type="text"
                    value={advancedSearch}
                    onChange={(e) => setAdvancedSearch(e.target.value)}
                    placeholder="ค้นหา..."
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-black focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-md bg-[#EF4444] px-6 py-3 font-semibold text-white transition hover:bg-[#DC2626]"
                >
                  ค้นหา
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToSell;

