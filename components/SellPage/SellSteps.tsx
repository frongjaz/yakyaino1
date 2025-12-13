"use client";

import Image from "next/image";
import { getImagePath } from "@/lib/utils";

type Step = {
  number: number;
  title: string;
  subtitle: string;
  icon: JSX.Element;
  position: "left" | "right";
};

const steps: Step[] = [
  {
    number: 1,
    title: "ส่งข้อมูลรถให้เราประเมิน",
    subtitle: "Online Appraisal",
    position: "left",
    icon: (
      <Image
        src={getImagePath("/images/logo/Sale_page_RIcon-19.svg")}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 md:h-12 md:w-12"
      />
    ),
  },
  {
    number: 2,
    title: "นัดตรวจสภาพรถ",
    subtitle: "Inspection Appointment",
    position: "left",
    icon: (
      <Image
        src={getImagePath("/images/logo/Sale_page_RIcon-20.svg")}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 md:h-12 md:w-12"
      />
    ),
  },
  {
    number: 3,
    title: "ตรวจเช็กเอกสาร",
    subtitle: "Document Review",
    position: "left",
    icon: (
      <Image
        src={getImagePath("/images/logo/Sale_page_RIcon-21.svg")}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 md:h-12 md:w-12"
      />
    ),
  },
  {
    number: 4,
    title: "เสนอราคาสุทธิทันที",
    subtitle: "Final Offer",
    position: "left",
    icon: (
      <Image
        src={getImagePath("/images/logo/Sale_page_RIcon-22.svg")}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 md:h-12 md:w-12"
      />
    ),
  },
  {
    number: 5,
    title: "ทำสัญญาซื้อขาย",
    subtitle: "Contract Signing",
    position: "right",
    icon: (
      <Image
        src={getImagePath("/images/logo/Sale_page_RIcon-23.svg")}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 md:h-12 md:w-12"
      />
    ),
  },
  {
    number: 6,
    title: "รับเงินทันที",
    subtitle: "Instant Payment",
    position: "right",
    icon: (
      <Image
        src={getImagePath("/images/logo/Sale_page_RIcon-24.svg")}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 md:h-12 md:w-12"
      />
    ),
  },
  {
    number: 7,
    title: "ปิดไฟแนนซ์ (ถ้ามี)",
    subtitle: "Loan Settlement",
    position: "right",
    icon: (
      <Image
        src={getImagePath("/images/logo/Sale_page_RIcon-25.svg")}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 md:h-12 md:w-12"
      />
    ),
  },
  {
    number: 8,
    title: "เราดำเนินการโอนให้ทั้งหมด",
    subtitle: "Ownership Transfer",
    position: "right",
    icon: (
      <Image
        src={getImagePath("/images/logo/Sale_page_RIcon-26.svg")}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 md:h-12 md:w-12"
      />
    ),
  },
];

export default function SellSteps() {
  const left = steps.filter((s) => s.position === "left");
  const right = steps.filter((s) => s.position === "right").reverse();

  const rows = left.map((l, i) => ({
    left: l,
    right: right[i],
  }));

  return (
    <section className="bg-[#2C2C2C] py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-16 text-center text-4xl font-bold text-white">
          ขั้นตอนการขายรถ
        </h2>

        <div className="relative mx-auto max-w-6xl">
          {/* center line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-[#EF4444] md:block" />

          <div className="flex flex-col gap-24">
            {rows.map((row) => (
              <div
                key={row.left.number}
                className="grid items-center md:grid-cols-[1fr_40px_1fr]"
              >
                <StepItem step={row.left} align="right" />
                <TimelineDot />
                <StepItem step={row.right} align="left" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= Components ================= */

function StepItem({
  step,
  align,
}: {
  step: Step;
  align: "left" | "right";
}) {
  const isRight = align === "right";

  return (
    <div
      className={`flex items-start gap-4 ${
        isRight ? "flex-row-reverse text-right" : "text-left"
      }`}
    >
      {/* number + icon */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EF4444] text-xs font-bold text-white">
          {step.number}
        </div>
        <div className="flex items-center justify-center text-[#EF4444]">{step.icon}</div>
      </div>

      {/* text */}
      <div className="max-w-xs">
        <h3 className="text-lg font-bold text-white">
          {step.title}
        </h3>
        <p className="text-sm text-[#EF4444]">
          {step.subtitle}
        </p>
      </div>
    </div>
  );
}

function TimelineDot() {
  return (
    <div className="hidden md:flex justify-center">
      <div className="h-2 w-2 rounded-full bg-[#EF4444]" />
    </div>
  );
}
