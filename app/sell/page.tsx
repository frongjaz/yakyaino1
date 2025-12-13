import SellHero from "@/components/SellPage/SellHero";
import SellBenefits from "@/components/SellPage/SellBenefits";
import SellPolicy from "@/components/SellPage/SellPolicy";
import AcceptCars from "@/components/SellPage/AcceptCars";
import SellSteps from "@/components/SellPage/SellSteps";
import ScrollUp from "@/components/Common/ScrollUp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ขายรถ | V-Autocar",
  description: "ขายรถกับเรา รวดเร็ว โปร่งใส ราคายุติธรรม รับซื้อรถทุกประเภท ชำระเงินทันที",
};

export default function SellPage() {
  return (
    <>
      <ScrollUp />
      <SellHero />
      <SellBenefits />
      <SellPolicy />
      <AcceptCars />
      <SellSteps />
    </>
  );
}

