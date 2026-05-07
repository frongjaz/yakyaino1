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
    images: [{ url: "https://www.checkkub.com/images/video/car5.jpg", width: 1200, height: 630, alt: "บทความ CheckKub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "บทความขายรถ รถมือสอง | CheckKub",
    description: "บทความเกี่ยวกับขายรถ รับซื้อรถ",
    images: ["https://www.checkkub.com/images/video/car5.jpg"],
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

      {blogs.length > 0 ? (
        <section className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <div key={blog.id} className="w-full">
                  <SingleBlog blog={blog} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-4 text-center py-16">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">ยังไม่มีบทความ</h3>
            <p className="text-gray-600">บทความจะปรากฏที่นี่เมื่อมีการเพิ่มข้อมูล</p>
          </div>
        </section>
      )}
    </>
  );
}
