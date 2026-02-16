import BlogDetailsClient from "./BlogDetailsClient";

// สำหรับ Static Export: สร้างหน้าตั้งต้นไว้ 1 หน้า (เพื่อให้ build ผ่าน)
// ระบบจะใช้ .htaccess ในการส่งหน้าบล็อกอื่นๆ มาที่หน้านี้แทน
export function generateStaticParams() {
  return [{ id: 'detail' }];
}

export default function BlogDetailsPage() {
  return <BlogDetailsClient />;
}
