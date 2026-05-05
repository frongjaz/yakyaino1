"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";

const HowToSell = () => {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3000000);
  const PRICE_MIN = 0;
  const PRICE_MAX = 3000000;

  const formatPrice = (v: number) =>
    v >= 1000000
      ? `${(v / 1000000).toFixed(v % 1000000 === 0 ? 0 : 1)}ล้าน`
      : v >= 1000
      ? `${(v / 1000).toFixed(0)}K`
      : v.toString();
  const [advancedSearch, setAdvancedSearch] = useState("");
  const [carBrands, setCarBrands] = useState<string[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoadingBrands(true);
        const data = await apiGet<{ success: boolean; data: string[] }>('/api/brands');
        if (data.success && data.data && Array.isArray(data.data)) {
          // Filter out empty brands and ensure unique values
          const uniqueBrands = data.data.filter(brand => brand && brand.trim() !== '');
          setCarBrands(uniqueBrands);
        } else {
          // Fallback to empty array if API fails
          setCarBrands([]);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        // Fallback to empty array if API fails
        setCarBrands([]);
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <>
      {/* Hero Section with Search Form */}
      <section className="relative overflow-hidden">
        <div className="relative min-h-[600px] w-full py-12 md:py-16 lg:py-20">
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
          
          <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-6 sm:py-8">
              <div className="grid w-full max-w-full grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
                {/* Left side - Car image (flipped to face right) */}
                <div className="relative h-[280px] w-full overflow-hidden sm:h-[350px] md:h-[400px] lg:h-[500px]">
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
                  <div className="w-full max-w-full rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 p-6 sm:max-w-md sm:p-8">
                    {/* Header */}
                    <div className="mb-6">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="h-px flex-1 bg-[#EF4444]/40"></span>
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#EF4444]">CheckKub</span>
                        <span className="h-px flex-1 bg-[#EF4444]/40"></span>
                      </div>
                      <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                        ค้นหารถที่ใช่
                        <span className="text-[#EF4444]">.</span>
                      </h3>
                      <p className="mt-1 text-sm text-white/50">รถมือสองคุณภาพดี ราคาโปร่งใส</p>
                    </div>

                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const params = new URLSearchParams();
                        if (selectedBrand) params.set("brand", selectedBrand);
                        if (minPrice > PRICE_MIN) params.set("minPrice", minPrice.toString());
                        if (maxPrice < PRICE_MAX) params.set("maxPrice", maxPrice.toString());
                        const queryString = params.toString();
                        router.push(`/cars${queryString ? `?${queryString}` : ""}`);
                      }}
                    >
                      {/* Brand select */}
                      <div>
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
                          ยี่ห้อรถ
                        </label>
                        <div className="relative">
                          <select
                            value={selectedBrand}
                            onChange={(e) => setSelectedBrand(e.target.value)}
                            disabled={loadingBrands}
                            className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white transition-colors hover:border-white/20 focus:border-[#EF4444]/60 focus:bg-white/8 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <option value="" className="bg-gray-900">
                              {loadingBrands ? "กำลังโหลด..." : "ทุกยี่ห้อ"}
                            </option>
                            {carBrands.map((brand) => (
                              <option key={brand} value={brand} className="bg-gray-900">
                                {brand}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Price range */}
                      <div>
                        <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-white/40">
                          งบประมาณ
                        </label>

                        {/* Price badges */}
                        <div className="mb-4 flex items-center gap-2">
                          <div className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-center">
                            <p className="text-[10px] text-white/30 mb-0.5">ต่ำสุด</p>
                            <p className="text-sm font-bold text-white">
                              ฿{minPrice.toLocaleString('th-TH')}
                            </p>
                          </div>
                          <div className="text-white/20 text-sm">—</div>
                          <div className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-center">
                            <p className="text-[10px] text-white/30 mb-0.5">สูงสุด</p>
                            <p className="text-sm font-bold text-[#EF4444]">
                              {maxPrice >= PRICE_MAX ? `฿${maxPrice.toLocaleString('th-TH')}+` : `฿${maxPrice.toLocaleString('th-TH')}`}
                            </p>
                          </div>
                        </div>

                        {/* Dual range slider */}
                        <div className="relative h-8 flex items-center px-1">
                          {/* Track bg */}
                          <div className="absolute inset-x-1 h-[3px] rounded-full bg-white/10"></div>
                          {/* Active track */}
                          <div
                            className="absolute h-[3px] rounded-full bg-gradient-to-r from-[#EF4444]/80 to-[#EF4444]"
                            style={{
                              left: `calc(${(minPrice / PRICE_MAX) * 100}% + 4px)`,
                              right: `calc(${100 - (maxPrice / PRICE_MAX) * 100}% + 4px)`,
                            }}
                          />
                          {/* Min input */}
                          <input
                            type="range"
                            min={PRICE_MIN}
                            max={PRICE_MAX}
                            step={50000}
                            value={minPrice}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              if (v < maxPrice - 50000) setMinPrice(v);
                            }}
                            className="range-thumb absolute inset-x-0 w-full appearance-none bg-transparent"
                            style={{ zIndex: minPrice > PRICE_MAX * 0.9 ? 5 : 3 }}
                          />
                          {/* Max input */}
                          <input
                            type="range"
                            min={PRICE_MIN}
                            max={PRICE_MAX}
                            step={50000}
                            value={maxPrice}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              if (v > minPrice + 50000) setMaxPrice(v);
                            }}
                            className="range-thumb absolute inset-x-0 w-full appearance-none bg-transparent"
                            style={{ zIndex: 4 }}
                          />
                        </div>

                        <div className="mt-1 flex justify-between text-[10px] text-white/20 px-1">
                          <span>฿0</span>
                          <span>฿1.5M</span>
                          <span>฿3M+</span>
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#EF4444] py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#DC2626] active:scale-95"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        ค้นหารถ
                      </button>

                      <p className="text-center text-xs text-white/25">
                        หรือ{" "}
                        <button
                          type="button"
                          onClick={() => router.push("/cars")}
                          className="text-white/40 underline underline-offset-2 hover:text-white/60 transition-colors"
                        >
                          ดูรถทั้งหมด
                        </button>
                      </p>
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

