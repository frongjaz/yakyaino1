import BlogContent from './BlogContent';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "บทความ CheckKub | ข้อมูลตลาดรถและเคล็ดลับการขาย",
  description:
    "ติดตามข่าวสารและบทวิเคราะห์จากทีม CheckKub เพื่อวางแผนการขายรถให้ได้ราคาดีที่สุด. รวมบทความเกี่ยวกับราคาตลาดรถ เทคนิคเตรียมรถ และกรณีศึกษาการขายรถจำนวนมาก.",
  keywords: [
    "บทความรถยนต์",
    "ราคาตลาดรถ",
    "เคล็ดลับขายรถ",
    "ขายรถฟลีต",
    "รับซื้อรถจำนวนมาก",
    "ข้อมูลตลาดรถมือสอง",
  ],
  openGraph: {
    title: "บทความ CheckKub | ข้อมูลตลาดรถและเคล็ดลับการขาย",
    description:
      "ติดตามข่าวสารและบทวิเคราะห์จากทีม CheckKub เพื่อวางแผนการขายรถให้ได้ราคาดีที่สุด.",
    type: "website",
  },
};

const Blog = () => {
  return <BlogContent />;
};

export default Blog;
