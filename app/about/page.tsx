import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "เกี่ยวกับ V-Autocar | โซลูชันรับซื้อรถสำหรับองค์กร",
  description:
    "รู้จักกับทีม V-Autocar ผู้เชี่ยวชาญด้านการรับซื้อรถจำนวนมากที่พร้อมดูแลคุณตั้งแต่การประเมินจนถึงปิดการขาย.",
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="เกี่ยวกับ V-Autocar"
        description="เราเชื่อว่าการขายรถควรเป็นเรื่องง่าย โปร่งใส และได้ราคาที่เป็นธรรมสำหรับทุกฝ่าย ทีมงานของเราพร้อมเดินเคียงข้างคุณในทุกดีล."
      />
      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;
