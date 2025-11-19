import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ติดต่อ V-Autocar | ส่งรายละเอียดรถเพื่อรับข้อเสนอ",
  description:
    "กรอกข้อมูลรถหรือโทรหาเราเพื่อรับข้อเสนอรับซื้อรถจำนวนมากจากทีม V-Autocar ได้ทันที.",
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="ติดต่อทีม V-Autocar"
        description="บอกความต้องการของคุณ ไม่ว่าคุณจะขายรถเพียงคันเดียวหรือทั้งฟลีต เราพร้อมช่วยประเมินและปิดดีลอย่างมั่นใจ."
      />

      <Contact />
    </>
  );
};

export default ContactPage;
