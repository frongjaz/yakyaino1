import BlogContent from './BlogContent';
import Script from "next/script";
import { Metadata } from "next";
import { fetchBlogsSSR } from "@/lib/fetchBlogs";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.checkkub.com"),
  title: { absolute: "บทความขายรถ รถมือสอง | CheckKub" },
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
    title: "บทความขายรถ รถมือสอง | CheckKub",
    description:
      "บทความเกี่ยวกับขายรถ รับซื้อรถ - ติดตามข่าวสารและบทวิเคราะห์จากทีม CheckKub",
    url: "https://www.checkkub.com/blog",
    siteName: "CheckKub",
    type: "website",
    locale: "th_TH",
    images: [{ url: "https://www.checkkub.com/images/video/car2.jpg", width: 1200, height: 630, alt: "บทความ CheckKub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "บทความขายรถ รถมือสอง | CheckKub",
    description: "บทความเกี่ยวกับขายรถ รับซื้อรถ",
    images: ["https://www.checkkub.com/images/video/car2.jpg"],
  },
};

export default async function Blog() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.checkkub.com";

  let initialBlogs = [];
  try {
    initialBlogs = await fetchBlogsSSR();
  } catch (error) {
    console.error("[SSR] Failed to fetch initial blogs:", error);
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "หน้าแรก", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "บทความ", item: `${baseUrl}/blog` },
    ],
  };

  return (
    <>
      <Script
        id="blog-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <BlogContent initialBlogs={initialBlogs} />
    </>
  );
}
