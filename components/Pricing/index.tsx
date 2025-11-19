"use client";
import { useState } from "react";
import SectionTitle from "../Common/SectionTitle";
import OfferList from "./OfferList";
import PricingBox from "./PricingBox";

const Pricing = () => {
  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <section id="pricing" className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="โปรแกรมรับซื้อที่ยืดหยุ่นสำหรับทุกขนาดธุรกิจ"
          paragraph="เลือกแพ็กเกจที่เหมาะกับจำนวนรถและความเร่งด่วนของคุณ เราจัดทีมเฉพาะกิจเพื่อตรวจสภาพ นำรถออก และโอนเงินให้เสร็จตามเวลาที่กำหนด."
          center
          width="665px"
        />

        <div className="w-full">
          <div
            className="wow fadeInUp mb-8 flex justify-center md:mb-12 lg:mb-16"
            data-wow-delay=".1s"
          >
            <span
              onClick={() => setIsMonthly(true)}
              className={`${
                isMonthly
                  ? "pointer-events-none text-primary"
                  : "text-dark dark:text-white"
              } mr-4 cursor-pointer text-base font-semibold`}
            >
              ผู้ขายทั่วไป
            </span>
            <div
              onClick={() => setIsMonthly(!isMonthly)}
              className="flex cursor-pointer items-center"
            >
              <div className="relative">
                <div className="h-5 w-14 rounded-full bg-[#1D2144] shadow-inner"></div>
                <div
                  className={`${
                    isMonthly ? "" : "translate-x-full"
                  } shadow-switch-1 absolute left-0 top-[-4px] flex h-7 w-7 items-center justify-center rounded-full bg-primary transition`}
                >
                  <span className="active h-4 w-4 rounded-full bg-white"></span>
                </div>
              </div>
            </div>
            <span
              onClick={() => setIsMonthly(false)}
              className={`${
                isMonthly
                  ? "text-dark dark:text-white"
                  : "pointer-events-none text-primary"
              } ml-4 cursor-pointer text-base font-semibold`}
            >
              องค์กร/ฟลีต
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          <PricingBox
            packageName={isMonthly ? "Quick Sell" : "Regional Fleet"}
            price={isMonthly ? "1-5" : "6-20"}
            duration="คัน"
            subtitle={
              isMonthly
                ? "ขายรถไม่กี่คันแบบเร่งด่วน จัดทีมตรวจถึงบ้านและโอนเงินทันทีหลังปิดดีล."
                : "ดูแลฟลีตในหลายจังหวัดพร้อมจัดสรรทีมภาคสนามเพื่อรับรถตามแผน."
            }
          >
            <OfferList text="ประเมินออนไลน์ + โทรกลับภายใน 24 ชม." status="active" />
            <OfferList text="ตรวจสภาพและโอนวันเดียวจบ" status="active" />
            <OfferList text="รับรถได้ทุกวันจันทร์-เสาร์" status="active" />
            <OfferList text="จ่ายเงินโอนทันทีหลังตรวจ" status="active" />
            <OfferList
              text="ผู้ประสานงานประจำตัว"
              status={isMonthly ? "inactive" : "active"}
            />
            <OfferList
              text="จัดการงานเอกสารแบบรวบรวมเดียว"
              status={isMonthly ? "inactive" : "active"}
            />
          </PricingBox>
          <PricingBox
            packageName={isMonthly ? "Dealer Partner" : "National Fleet"}
            price={isMonthly ? "6-15" : "20+"}
            duration="คัน"
            subtitle={
              isMonthly
                ? "เหมาะสำหรับผู้ประกอบการเต็นท์และศูนย์บริการที่มีรถหมุนเวียนประจำ."
                : "โซลูชันครบวงจรสำหรับองค์กรขนาดใหญ่ที่ต้องการแผนการรับรถทั่วประเทศ."
            }
          >
            <OfferList text="ทีมประเมินภาคสนามเฉพาะกิจ" status="active" />
            <OfferList text="วางแผนรับรถเป็นรอบตามสต็อก" status="active" />
            <OfferList text="ระบบรายงานสถานะแบบเรียลไทม์" status="active" />
            <OfferList text="จ่ายเงินแบบแบ่งงวดตามวันรับรถ" status="active" />
            <OfferList text="สัญญา Partnership รายปี" status="active" />
            <OfferList
              text="จัดหาช่องทางจำหน่ายต่อให้"
              status={isMonthly ? "inactive" : "active"}
            />
          </PricingBox>
          <PricingBox
            packageName={isMonthly ? "Consignment Support" : "Enterprise Program"}
            price={isMonthly ? "ตามตกลง" : "ตามตกลง"}
            duration=""
            subtitle={
              isMonthly
                ? "คุณยังไม่เร่งขาย เราช่วยจัดการการตลาดและหาผู้ซื้อให้ พร้อมรับประกันราคาขั้นต่ำ."
                : "แพ็กเกจออกแบบพิเศษสำหรับองค์กรขนาดใหญ่ที่ต้องการวางแผนขายทั้งปี."
            }
          >
            <OfferList text="ที่ปรึกษาวางแผนกลยุทธ์การจำหน่าย" status="active" />
            <OfferList text="ทำความสะอาดและเตรียมรถก่อนส่งมอบ" status="active" />
            <OfferList text="เครือข่ายผู้ซื้อในประเทศและต่างประเทศ" status="active" />
            <OfferList text="รายงานราคาตลาดรายไตรมาส" status="active" />
            <OfferList text="เจ้าหน้าที่ onsite ในวันรับรถ" status="active" />
            <OfferList text="โครงสร้างค่าตอบแทนยืดหยุ่น" status="active" />
          </PricingBox>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-[-1]">
        <svg
          width="239"
          height="601"
          viewBox="0 0 239 601"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            opacity="0.3"
            x="-184.451"
            y="600.973"
            width="196"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -184.451 600.973)"
            fill="url(#paint0_linear_93:235)"
          />
          <rect
            opacity="0.3"
            x="-188.201"
            y="385.272"
            width="59.7544"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -188.201 385.272)"
            fill="url(#paint1_linear_93:235)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_93:235"
              x1="-90.1184"
              y1="420.414"
              x2="-90.1184"
              y2="1131.65"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_93:235"
              x1="-159.441"
              y1="204.714"
              x2="-159.441"
              y2="915.952"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default Pricing;
