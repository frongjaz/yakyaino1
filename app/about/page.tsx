import AboutHero from "@/components/AboutPage/AboutHero";
import AboutUsContent from "@/components/AboutPage/AboutUsContent";
import HistorySection from "@/components/AboutPage/HistorySection";
import TikTokVideos from "@/components/AboutPage/TikTokVideos";
import CustomerReviews from "@/components/AboutPage/CustomerReviews";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "เกี่ยวกับ CheckKub | โซลูชันรับซื้อรถสำหรับองค์กร",
  description:
    "รู้จักกับทีม CheckKub ผู้เชี่ยวชาญด้านการรับซื้อรถจำนวนมากที่พร้อมดูแลคุณตั้งแต่การประเมินจนถึงปิดการขาย.",
};

const AboutPage = () => {
  return (
    <>
      <AboutHero />
      <AboutUsContent />
      <HistorySection />
      {/* <TikTokVideos /> */}
      {/* <CustomerReviews /> */}
    </>
  );
};

export default AboutPage;
