import BlogContent from './BlogContent';
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
  return <BlogContent />;
};

export default Blog;
