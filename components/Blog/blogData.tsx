import { getImagePath } from "@/lib/utils";
import { Blog } from "@/types/blog";

const getBlogData = (): Blog[] => [
  {
    id: 1,
    title: "อัปเดตราคาตลาดรถ SUV 2025 ก่อนปล่อยขาย",
    paragraph:
      "สำรวจเรตราคาล่าสุดของรถ SUV ยอดนิยม วิเคราะห์ปัจจัยที่ทำให้ราคาปรับขึ้น-ลง และวิธีเตรียมรถเพื่อให้ได้ข้อเสนอที่ดีที่สุด.",
    image: getImagePath("/images/blog/blog-01.jpg"),
    author: {
      name: "ทีมข้อมูลตลาด V-Autocar",
      image: getImagePath("/images/blog/author-01.png"),
      designation: "Market Analyst",
    },
    tags: ["market"],
    publishDate: "มี.ค. 2025",
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
    tags: ["fleet"],
    publishDate: "ก.พ. 2025",
  },
  {
    id: 3,
    title: "เทคนิคต่อรองราคาสำหรับผู้ประกอบการเต็นท์รถ",
    paragraph:
      "แชร์ประสบการณ์ตรงจากพาร์ทเนอร์ V-Autocar ว่าควรดูองค์ประกอบใดบ้างก่อนตกลงขาย เพื่อให้ได้ตัวเลขที่ทั้งสองฝ่ายพึงพอใจ.",
    image: getImagePath("/images/blog/blog-03.jpg"),
    author: {
      name: "รุ่งโรจน์ ทองอินทร์",
      image: getImagePath("/images/blog/author-03.png"),
      designation: "Dealer Partner",
    },
    tags: ["dealer"],
    publishDate: "ม.ค. 2025",
  },
];
export default getBlogData;
