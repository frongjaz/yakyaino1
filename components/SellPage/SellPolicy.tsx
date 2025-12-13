"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";

const SellPolicy = () => {
  return (
    <section className="bg-[#2C2C2C] py-16 md:py-20">
      <div className="container px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
          {/* Left side - Text content */}
          <div>
            <h2 className="mb-6 text-3xl font-bold text-[#EF4444] md:text-4xl">
              นโยบายการขายรถ
            </h2>
            <p className="text-base leading-relaxed text-white md:text-lg">
              เรามุ่งมั่นให้บริการรับซือรถด้วยความโปร่งใส ยุติธรรม และเชือถือได้
              โดยเรารับชือรถทุกยีห้อ ทุกรุ่น ทังรถบ้าน รถบริษัท หรือรถทียังติด
              ไฟแนนซ์ พร้อมตรวจสอบสภาพรถอย่างมืออาชีพด้วยมาตรฐานทีไม่
              ทำให้รถเสียหาย และประเมินราคาตามสภาพจริงและราคาตลาด
              ปัจจุบันอย่างตรงไปตรงมา ไม่มีการกดราคาเกินสมควร เราดำเนินงาน
              ด้วยเอกสารทีถูกต้องครบถ้วน ทำสัญญาซือขายชัดเจน พร้อมชำระ VARIS
              ATIV เงินทันทีหลังตกลงราคา โดยไม่มีค่าใช้จ่ายแอบแฝง เราดูแลขั้นตอน
              การโอนกรรมสิทธิและการปิดไฟแนนซ์ให้ทังหมดเพือความสะดวกของ ลูกค้า
              และรับประกันว่ารถจะไม่ถูกนำไปใช้อย่างไม่เหมาะสมก่อนโอน เสร็จสิ้น
              พร้อมรักษาความลับ และ ข้อมูลส่วนบุคคลของลูกค้าอย่างปลอดภัยตลอดกระบวนการ
            </p>
          </div>

          {/* Right side - Car image */}
          <div className="relative h-[400px] w-full md:h-[500px] overflow-hidden">
            <Image
              src={getImagePath("/images/hero/1231384.png")}
              alt="Toyota Yaris ATIV"
              fill
              className="h-full w-full scale-110 object-contain object-center md:scale-125"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellPolicy;
