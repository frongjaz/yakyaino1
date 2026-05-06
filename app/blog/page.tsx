import SingleBlog from "@/components/Blog/SingleBlog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { fetchBlogsSSR } from "@/lib/fetchBlogs";
import { Metadata } from "next";

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
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "บทความขายรถ รถมือสอง | CheckKub",
    description: "บทความเกี่ยวกับขายรถ รับซื้อรถ - ติดตามข่าวสารและบทวิเคราะห์จากทีม CheckKub",
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

  const blogs = await fetchBlogsSSR();

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "หน้าแรก", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "บทความ", item: `${baseUrl}/blog` },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "บทความและอัปเดตราคา CheckKub",
    description: "รวมบทวิเคราะห์ราคา เทคนิคเตรียมรถ และกรณีศึกษาการขายรถจำนวนมาก",
    url: `${baseUrl}/blog`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: blogs.length,
      itemListElement: blogs.map((blog, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Article",
          headline: blog.title,
          description: blog.paragraph,
          image: blog.image,
          datePublished: blog.datePublished || blog.publishDate,
          dateModified: blog.dateModified || blog.datePublished || blog.publishDate,
          author: { "@type": "Person", name: blog.author.name },
          publisher: {
            "@type": "Organization",
            name: "CheckKub",
            logo: { "@type": "ImageObject", url: `${baseUrl}/images/logo/logo.svg` },
          },
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <Breadcrumb
        pageName="บทความและอัปเดตราคา"
        description="รวมบทวิเคราะห์ราคา เทคนิคเตรียมรถ และกรณีศึกษาการขายรถจำนวนมากเพื่อช่วยให้คุณตัดสินใจได้อย่างมั่นใจ."
      />

      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <div key={blog.id} className="w-full">
                  <SingleBlog blog={blog} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-gray-500">ยังไม่มีบทความในขณะนี้ กรุณากลับมาใหม่ภายหลัง</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
