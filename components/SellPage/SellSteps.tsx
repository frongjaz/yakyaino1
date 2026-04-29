"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getImagePath } from "@/lib/utils";

type Step = {
  number: number;
  title: string;
  subtitle: string;
  description: string;
  icon: JSX.Element;
};

const steps: Step[] = [
  {
    number: 1,
    title: "ส่งข้อมูลรถให้เราประเมิน",
    subtitle: "Online Appraisal",
    description: "ส่งรูปถ่ายและข้อมูลรถผ่าน LINE, Facebook หรือเว็บไซต์ ไม่มีค่าใช้จ่าย",
    icon: (
      <Image src={getImagePath("/images/logo/Sale_page_RIcon-19.svg")} alt="" width={40} height={40} className="h-10 w-10" />
    ),
  },
  {
    number: 2,
    title: "นัดตรวจสภาพรถ",
    subtitle: "Inspection Appointment",
    description: "ทีมงานนัดหมายตรวจสภาพรถ ณ สถานที่ที่คุณสะดวก ทั่วประเทศ",
    icon: (
      <Image src={getImagePath("/images/logo/Sale_page_RIcon-20.svg")} alt="" width={40} height={40} className="h-10 w-10" />
    ),
  },
  {
    number: 3,
    title: "ตรวจเช็กเอกสาร",
    subtitle: "Document Review",
    description: "ทีมงานตรวจสอบเอกสารให้ครบถ้วน พร้อมส่งเช็กลิสต์ล่วงหน้า",
    icon: (
      <Image src={getImagePath("/images/logo/Sale_page_RIcon-21.svg")} alt="" width={40} height={40} className="h-10 w-10" />
    ),
  },
  {
    number: 4,
    title: "เสนอราคาสุทธิทันที",
    subtitle: "Final Offer",
    description: "ผู้เชี่ยวชาญเสนอราคาตามสภาพจริง โปร่งใส ไม่กดราคา",
    icon: (
      <Image src={getImagePath("/images/logo/Sale_page_RIcon-22.svg")} alt="" width={40} height={40} className="h-10 w-10" />
    ),
  },
  {
    number: 5,
    title: "ทำสัญญาซื้อขาย",
    subtitle: "Contract Signing",
    description: "เซ็นสัญญาอย่างเป็นทางการ ถูกต้องตามกฎหมาย มีทีมงานดูแลทุกขั้นตอน",
    icon: (
      <Image src={getImagePath("/images/logo/Sale_page_RIcon-23.svg")} alt="" width={40} height={40} className="h-10 w-10" />
    ),
  },
  {
    number: 6,
    title: "รับเงินทันที",
    subtitle: "Instant Payment",
    description: "โอนเงินเข้าบัญชีทันทีหลังตกลงราคา ภายใน 1-3 วันทำการ",
    icon: (
      <Image src={getImagePath("/images/logo/Sale_page_RIcon-24.svg")} alt="" width={40} height={40} className="h-10 w-10" />
    ),
  },
  {
    number: 7,
    title: "ปิดไฟแนนซ์ (ถ้ามี)",
    subtitle: "Loan Settlement",
    description: "ทีมงานดูแลประสานงานปิดไฟแนนซ์กับบริษัทลีสซิ่งให้ครบ ไม่ต้องกังวล",
    icon: (
      <Image src={getImagePath("/images/logo/Sale_page_RIcon-25.svg")} alt="" width={40} height={40} className="h-10 w-10" />
    ),
  },
  {
    number: 8,
    title: "เราดำเนินการโอนให้ทั้งหมด",
    subtitle: "Ownership Transfer",
    description: "ดูแลการโอนกรรมสิทธิ์ครบวงจร คุณไม่ต้องไปกรมการขนส่งเอง",
    icon: (
      <Image src={getImagePath("/images/logo/Sale_page_RIcon-26.svg")} alt="" width={40} height={40} className="h-10 w-10" />
    ),
  },
];

/* ─── hook: fires when element enters viewport ─── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ─── animated line that grows as section enters view ─── */
function AnimatedLine() {
  const { ref, visible } = useInView(0.05);
  return (
    <div
      ref={ref}
      className="absolute left-1/2 top-0 w-0.5 -translate-x-1/2 origin-top bg-gradient-to-b from-[#EF4444] via-[#EF4444] to-[#EF4444]/20 transition-all duration-[1800ms] ease-out"
      style={{ height: "100%", transform: "scaleY(1)", transformOrigin: "top", opacity: visible ? 1 : 0, clipPath: visible ? "inset(0 0 0 0)" : "inset(0 0 100% 0)", transitionProperty: "clip-path, opacity" }}
    />
  );
}

/* ─── single step row ─── */
function StepRow({ step, index }: { step: Step; index: number }) {
  const { ref, visible } = useInView(0.25);
  const isLeft = index % 2 === 0;
  const delay = `${index * 80}ms`;

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-2"
      style={{ transitionDelay: delay }}
    >
      {/* left slot */}
      <div className="flex justify-end pr-12 py-8">
        {isLeft && (
          <div
            className="w-full max-w-xs transition-all duration-500 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-40px)",
              transitionDelay: delay,
            }}
          >
            <StepCard step={step} />
          </div>
        )}
      </div>

      {/* center dot */}
      <div className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div
          className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#EF4444] bg-[#2C2C2C] text-sm font-bold text-white transition-all duration-500 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1)" : "scale(0)",
            transitionDelay: delay,
            boxShadow: visible ? "0 0 0 6px rgba(239,68,68,0.15), 0 0 20px rgba(239,68,68,0.35)" : "none",
          }}
        >
          {step.number}
          {/* pulse ring */}
          {visible && (
            <span className="absolute inset-0 rounded-full border-2 border-[#EF4444] animate-ping opacity-30" />
          )}
        </div>
      </div>

      {/* right slot */}
      <div className="flex justify-start pl-12 py-8">
        {!isLeft && (
          <div
            className="w-full max-w-xs transition-all duration-500 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(40px)",
              transitionDelay: delay,
            }}
          >
            <StepCard step={step} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── mobile step item ─── */
function MobileStepItem({ step, index }: { step: Step; index: number }) {
  const { ref, visible } = useInView(0.2);
  const delay = `${index * 80}ms`;

  return (
    <div
      ref={ref}
      className="relative flex items-start gap-5 py-6 pl-1 transition-all duration-500 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: delay,
      }}
    >
      {/* dot */}
      <div
        className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#EF4444] bg-[#2C2C2C] text-sm font-bold text-white transition-all duration-500 ease-out"
        style={{
          boxShadow: visible ? "0 0 14px rgba(239,68,68,0.4)" : "none",
          transitionDelay: delay,
        }}
      >
        {step.number}
        {visible && (
          <span className="absolute inset-0 rounded-full border-2 border-[#EF4444] animate-ping opacity-25" />
        )}
      </div>

      {/* card */}
      <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
        <div className="mb-2 flex items-center gap-3">
          <div className="text-[#EF4444]">{step.icon}</div>
          <div>
            <h3 className="text-base font-bold leading-tight text-white">{step.title}</h3>
            <p className="text-xs text-[#EF4444]">{step.subtitle}</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-gray-400">{step.description}</p>
      </div>
    </div>
  );
}

/* ─── card ─── */
function StepCard({ step }: { step: Step }) {
  return (
    <div className="group w-full rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:border-[#EF4444]/50 hover:bg-white/10 hover:shadow-[0_0_24px_rgba(239,68,68,0.18)]">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#EF4444]/10 text-[#EF4444] transition-colors duration-300 group-hover:bg-[#EF4444]/20">
          {step.icon}
        </div>
        <div>
          <h3 className="text-base font-bold leading-tight text-white">{step.title}</h3>
          <p className="text-xs text-[#EF4444]">{step.subtitle}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-gray-400">{step.description}</p>
    </div>
  );
}

/* ─── main export ─── */
export default function SellSteps() {
  return (
    <section className="bg-[#2C2C2C] py-20">
      <div className="container mx-auto px-4">
        {/* heading */}
        <FadeIn>
          <h2 className="mb-3 text-center text-4xl font-bold text-white">ขั้นตอนการขายรถ</h2>
          <p className="mb-16 text-center text-[#EF4444]">ง่าย รวดเร็ว โปร่งใส ใน 8 ขั้นตอน</p>
        </FadeIn>

        {/* ── Desktop ── */}
        <div className="relative mx-auto hidden max-w-5xl md:block">
          <AnimatedLine />
          <div className="flex flex-col gap-0">
            {steps.map((step, idx) => (
              <StepRow key={step.number} step={step} index={idx} />
            ))}
          </div>
        </div>

        {/* ── Mobile ── */}
        <div className="relative mx-auto max-w-sm md:hidden">
          <div className="absolute left-5 top-0 h-full w-0.5 bg-gradient-to-b from-[#EF4444] to-[#EF4444]/20" />
          <div className="flex flex-col gap-0">
            {steps.map((step, idx) => (
              <MobileStepItem key={step.number} step={step} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── simple fade-in wrapper ─── */
function FadeIn({ children }: { children: React.ReactNode }) {
  const { ref, visible } = useInView(0.1);
  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)" }}
    >
      {children}
    </div>
  );
}
