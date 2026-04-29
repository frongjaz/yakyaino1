import BlogContent from './BlogContent';
import Script from "next/script";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://v-autocar.co.th"),
  title: "บทความ | ขายรถ รับซื้อรถ - CheckKub",
  description:
    "บทความเกี่ยวกับขายรถ รับซื้อรถ - ติดตามข่าวสารและบทวิเคราะห์จากทีม CheckKub เพื่อวางแผนการขายรถให้ได้ราคาดีที่สุด. รวมบทความเกี่ยวกับราคาตลาดรถ เทคนิคเตรียมรถ และกรณีศึกษาการขายรถจำนวนมาก.",
  keywords: [
    "ขายรถ",
    "รับซื้อรถ",
    "ต้องการขายรถ",
    "บทความรถยนต์",
    "ราคาตลาดรถ",
    "เคล็ดลับขายรถ",
    "ขายรถฟลีต",
    "รับซื้อรถจำนวนมาก",
    "ข้อมูลตลาดรถมือสอง",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "บทความ | ขายรถ รับซื้อรถ - CheckKub",
    description:
      "บทความเกี่ยวกับขายรถ รับซื้อรถ - ติดตามข่าวสารและบทวิเคราะห์จากทีม CheckKub",
    url: "https://v-autocar.co.th/blog",
    siteName: "CheckKub",
    type: "website",
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: "บทความ | ขายรถ รับซื้อรถ - CheckKub",
    description: "บทความเกี่ยวกับขายรถ รับซื้อรถ",
  },
};

const Blog = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://v-autocar.co.th";

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "หน้าแรก", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "บทความ", item: `${baseUrl}/blog` },
    ],
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "ควรเตรียมรถอย่างไรก่อนขาย?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ก่อนขายรถควรล้างรถให้สะอาด ตรวจสอบสภาพทั่วไป เช็คน้ำมันเครื่อง น้ำหล่อเย็น ยาง และเตรียมเอกสารให้ครบ เช่น เล่มทะเบียนรถ ใบเสร็จซื้อขาย และประวัติการซ่อมบำรุง",
        },
      },
      {
        "@type": "Question",
        name: "ขายรถบริษัทหรือรถฟลีตต้องเตรียมอะไรบ้าง?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "การขายรถบริษัทหรือรถฟลีตต้องเตรียมสำเนาทะเบียนรถ หนังสือปลดภาระ หนังสือมอบอำนาจ และเอกสารนิติบุคคล ทีม CheckKub จะส่งเช็กลิสต์ให้ก่อนวันนัดหมาย",
        },
      },
      {
        "@type": "Question",
        name: "รถมีไฟแนนซ์ค้างขายได้ไหม?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ขายได้ CheckKub มีทีมงานช่วยดูแลเรื่องการปลดภาระไฟแนนซ์และประสานงานกับบริษัทลีสซิ่งให้ครบวงจร ทำให้ขั้นตอนการขายรถที่ยังมีไฟแนนซ์ค้างเป็นเรื่องง่าย",
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="blog-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="blog-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <BlogContent />
    </>
  );
};

export default Blog;
