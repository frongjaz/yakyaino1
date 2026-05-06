"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";

const SellBenefits = () => {
  const images = [
    {
      src: "/images/hero/S__5800069_0.jpg",
      alt: "Car washing and detailing",
    },
    {
      src: "/images/about/S__5800061.webp",
      alt: "Car dealership lot",
    },
    {
      src: "/images/hero/S__5800088_0.jpg",
      alt: "Cars in parking lot",
    },
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container px-4">
        <h2 className="mb-6 text-center text-3xl font-bold text-[#EF4444] md:text-4xl">
          ขายรถกับเราดีอย่างไร
        </h2>
        
        <p className="mx-auto mb-8 max-w-4xl text-center text-base leading-relaxed text-gray-700 md:text-lg">
          การขายรถกับเราเป็นเรื่องง่าย รวดเร็ว และโปร่งใส เพราะเราประเมินราคารถทุกคันตามสภาพจริง ไม่กดราคา และอธิบายเหตุผลอย่างตรงไปตรงมา ลูกค้าจึงมั่นใจได้ว่าจะได้รับข้อเสนอที่ยุติธรรมที่สุด เรามีทีมผู้เชี่ยวชาญตรวจสภาพรถอย่างมืออาชีพ พร้อมชำระเงินทันทีหลังตกลงราคา ไม่ต้องรอนานหรือทำขั้นตอนยุ่งยาก นอกจากนี้ เรายังดูแลเรื่องเอกสารทั้งหมด ตั้งแต่สัญญาซื้อขาย การปิดไฟแนนซ์ ไปจนถึงการโอนกรรมสิทธิ์ให้เสร็จสิ้น เพื่อให้ลูกค้าสบายใจและประหยัดเวลา ด้วยประสบการณ์ยาวนานกว่า 10 ปี เราเข้าใจทุกขั้นตอนของการซื้อ-ขายรถ และพร้อมมอบบริการที่ซื่อสัตย์ ปลอดภัย และไว้วางใจได้อย่างเต็มที่
        </p>

        {/* Three images */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <Image
                src={getImagePath(image.src)}
                alt={image.alt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SellBenefits;

