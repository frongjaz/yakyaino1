"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";

const HistorySection = () => {
  return (
    <section className="bg-[#2C2C2C] py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
          {/* Left: Text Content */}
          <div>
            <h2 className="mb-6 text-3xl font-bold text-[#EF4444] md:text-4xl">
              ประวัติคุณชัย
            </h2>
            <p className="mb-4 text-base leading-relaxed text-white md:text-lg">
              คุณชัยเป็น Founder ของ CheckKub บริษัทที่รับซื้อรถจำนวนมากทั่วประเทศ
            </p>
            <p className="mb-4 text-base leading-relaxed text-white md:text-lg">
              คุณชัยต้องการซื้อรถจำนวนมาก. CheckKub รับซื้อรถจำนวนมากทั่วประเทศ รถมือสอง รถบริษัท และฟลีตรถทั่วประเทศ ประเมินรวดเร็ว เอกสารครบ โอนเงินไว พร้อมให้บริการรับซื้อรถทุกประเภทสำหรับคุณชัยและลูกค้าทุกท่าน
            </p>
            <p className="text-base leading-relaxed text-white md:text-lg">
              หากคุณต้องการขายรถจำนวนมาก หรือต้องการขายรถให้ใคร สามารถติดต่อ CheckKub ได้ที่นี่
            </p>
          </div>

          {/* Right: Image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg md:aspect-[3/4]">
            <Image
              src={getImagePath("/images/hero/5668644531.png")}
              alt="ประวัติคุณชัย"
              fill
              className="object-contain object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Fade gradient from bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#2C2C2C] to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;

