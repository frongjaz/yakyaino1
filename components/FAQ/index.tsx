"use client";
import { useState } from "react";

const faqs = [
  {
    q: "ขายรถมือสองได้ที่ไหน?",
    a: "ขายรถให้ CheckKub ได้เลย เรารับซื้อรถทุกประเภท ประเมินราคารวดเร็วภายใน 24 ชั่วโมง ชำระเงินทันที ไม่มีค่าใช้จ่าย รับซื้อทั่วประเทศ",
  },
  {
    q: "ต้องการขายรถต้องทำอย่างไร?",
    a: "ส่งรูปและข้อมูลรถมาที่ CheckKub ผ่าน LINE, Facebook หรือเว็บไซต์ ทีมงานจะประเมินราคาและติดต่อกลับภายใน 24 ชั่วโมง หากตกลงราคาได้จะนัดตรวจสภาพและโอนเงินทันที",
  },
  {
    q: "รับซื้อรถทุกยี่ห้อไหม?",
    a: "CheckKub รับซื้อรถทุกยี่ห้อ ทุกรุ่น ทั้ง Toyota, Honda, Mazda, Isuzu, Ford, BMW, Mercedes-Benz และอื่นๆ รับซื้อทั้งรถส่วนบุคคล รถฟลีต และรถบริษัท",
  },
  {
    q: "รับซื้อรถฟลีตคืออะไร?",
    a: "รถฟลีต คือรถที่องค์กรหรือบริษัทเป็นเจ้าของหลายคัน เช่น รถของบริษัทเช่ารถ รถของพนักงานองค์กร หรือรถขนส่ง CheckKub รับซื้อรถฟลีตจำนวนมากพร้อมกัน ราคาดี จัดการเอกสารครบ",
  },
  {
    q: "ซื้อรถมือสองที่ไหนดี?",
    a: "CheckKub มีรถมือสองคุณภาพดีหลากหลายรุ่น ทุกคันผ่านการตรวจสภาพอย่างละเอียด ราคายุติธรรม โปร่งใส พร้อมบริการหลังการขาย ดูรถทั้งหมดได้ที่ checkkub.com/cars",
  },
  {
    q: "ซื้อรถมือสองต้องระวังอะไรบ้าง?",
    a: "ควรตรวจสอบประวัติรถ เลขไมล์ สภาพตัวถัง และเครื่องยนต์ ที่ CheckKub ทุกคันผ่านการตรวจสอบโดยทีมผู้เชี่ยวชาญ และมีเอกสารครบถ้วน",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container px-4">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            คำถามที่พบบ่อย
          </h2>
          <p className="mt-2 text-sm text-gray-500">เรื่องขายรถ รับซื้อรถ ที่ลูกค้าถามบ่อย</p>
        </div>

        <div className="mx-auto max-w-3xl divide-y divide-gray-200 rounded-2xl border border-gray-200">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-gray-50"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="text-base font-semibold text-gray-900">{faq.q}</span>
                <svg
                  className={`h-5 w-5 flex-shrink-0 text-[#EF4444] transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm leading-relaxed text-gray-600">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
