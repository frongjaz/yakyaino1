import { getImagePath } from "@/lib/utils";
import { Blog } from "@/types/blog";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://checkkub.com";

const getBlogData = (): Blog[] => [
  {
    id: 1,
    title: "อัปเดตราคาตลาดรถ SUV 2025 ก่อนปล่อยขาย",
    paragraph:
      "สำรวจเรตราคาล่าสุดของรถ SUV ยอดนิยม วิเคราะห์ปัจจัยที่ทำให้ราคาปรับขึ้น-ลง และวิธีเตรียมรถเพื่อให้ได้ข้อเสนอที่ดีที่สุด.",
    image: getImagePath("/images/blog/blog-01.jpg"),
    author: {
      name: "ทีมข้อมูลตลาด CheckKub",
      image: getImagePath("/images/blog/author-01.png"),
      designation: "Market Analyst",
    },
    tags: ["market", "SUV", "ราคาตลาด"],
    publishDate: "มี.ค. 2025",
    datePublished: "2025-03-01T00:00:00+07:00",
    dateModified: "2025-03-01T00:00:00+07:00",
    url: `${baseUrl}/blog-details/1`,
  },
  {
    id: 2,
    title: "Checklist เตรียมรถฟลีตก่อนขายล็อตใหญ่",
    paragraph:
      "คู่มือทีละขั้นสำหรับผู้ดูแลฟลีต ตั้งแต่รวบรวมเอกสาร ตรวจสภาพ ไปจนถึงวางแผนการนัดหมายให้การขายรถจำนวนมากเป็นเรื่องง่าย.",
    image: getImagePath("/images/blog/blog-02.jpg"),
    author: {
      name: "ทศพล สุขเกษม",
      image: getImagePath("/images/blog/author-02.png"),
      designation: "Fleet Consultant",
    },
    tags: ["fleet", "ฟลีต", "ขายรถจำนวนมาก"],
    publishDate: "ก.พ. 2025",
    datePublished: "2025-02-01T00:00:00+07:00",
    dateModified: "2025-02-01T00:00:00+07:00",
    url: `${baseUrl}/blog-details/2`,
  },
  {
    id: 3,
    title: "เทคนิคต่อรองราคาสำหรับผู้ประกอบการเต็นท์รถ",
    paragraph:
      "แชร์ประสบการณ์ตรงจากพาร์ทเนอร์ CheckKub ว่าควรดูองค์ประกอบใดบ้างก่อนตกลงขาย เพื่อให้ได้ตัวเลขที่ทั้งสองฝ่ายพึงพอใจ.",
    image: getImagePath("/images/blog/blog-03.jpg"),
    author: {
      name: "รุ่งโรจน์ ทองอินทร์",
      image: getImagePath("/images/blog/author-03.png"),
      designation: "Dealer Partner",
    },
    tags: ["dealer", "เต็นท์รถ", "ต่อรองราคา"],
    publishDate: "ม.ค. 2025",
    datePublished: "2025-01-01T00:00:00+07:00",
    dateModified: "2025-01-01T00:00:00+07:00",
    url: `${baseUrl}/blog-details/3`,
  },
];
export default getBlogData;
