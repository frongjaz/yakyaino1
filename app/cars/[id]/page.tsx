import CarDetailsClient from "./CarDetailsClient";

// สำหรับ Static Export: สร้างหน้าตั้งต้นไว้ 1 หน้า (เพื่อให้ build ผ่าน)
export function generateStaticParams() {
  return [{ id: 'detail' }];
}

export default function CarDetailPage() {
  return <CarDetailsClient />;
}
