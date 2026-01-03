import SingleBlog from "@/components/Blog/SingleBlog";
import blogData from "@/components/Blog/blogData";
import Breadcrumb from "@/components/Common/Breadcrumb";
import BlogFAQ from "@/components/Blog/BlogFAQ";
import Script from "next/script";

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
  const blogs = blogData();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://checkkub.com";

  // Generate structured data for Blog listing (CollectionPage + Article items)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "บทความและอัปเดตราคา CheckKub",
    description:
      "รวมบทวิเคราะห์ราคา เทคนิคเตรียมรถ และกรณีศึกษาการขายรถจำนวนมากเพื่อช่วยให้คุณตัดสินใจได้อย่างมั่นใจ.",
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
          author: {
            "@type": "Person",
            name: blog.author.name,
            jobTitle: blog.author.designation,
          },
          publisher: {
            "@type": "Organization",
            name: "CheckKub",
            logo: {
              "@type": "ImageObject",
              url: `${baseUrl}/images/logo/logo.svg`,
            },
          },
          articleSection: blog.tags[0],
          keywords: blog.tags.join(", "),
        },
      })),
    },
  };

  return (
    <>
      <Script
        id="blog-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Breadcrumb
        pageName="บทความและอัปเดตราคา"
        description="รวมบทวิเคราะห์ราคา เทคนิคเตรียมรถ และกรณีศึกษาการขายรถจำนวนมากเพื่อช่วยให้คุณตัดสินใจได้อย่างมั่นใจ."
      />

      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <div key={blog.id} className="w-full">
                <SingleBlog blog={blog} />
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <BlogFAQ
            faqs={[
              {
                question: "CheckKub รับซื้อรถประเภทใดบ้าง?",
                answer:
                  "CheckKub รับซื้อรถทุกประเภท รวมถึงรถยนต์ส่วนบุคคล รถฟลีต รถบริษัท รถลีสซิ่ง และสต็อกจากดีลเลอร์ เรามีประสบการณ์ในการรับซื้อรถจำนวนมากทั้งรถเก่าและรถใหม่",
              },
              {
                question: "ใช้เวลานานเท่าไรในการประเมินราคา?",
                answer:
                  "หลังจากส่งข้อมูลรถครบถ้วน ทีมงานจะประเมินและเสนอราคาภายใน 24 ชั่วโมง หากต้องการตรวจสภาพรถจริง สามารถนัดหมายได้ทันที",
              },
              {
                question: "ต้องเตรียมเอกสารอะไรบ้าง?",
                answer:
                  "เอกสารที่จำเป็น ได้แก่ สำเนาทะเบียนรถ หนังสือปลดภาระ (ถ้ามี) หนังสือมอบอำนาจ และเอกสารนิติบุคคล (สำหรับรถบริษัท) ทีมงานจะส่งเช็กลิสต์เอกสารให้ก่อนวันนัดหมาย",
              },
              {
                question: "ราคาที่เสนอเป็นราคาสุดท้ายหรือไม่?",
                answer:
                  "ราคาที่เสนอเป็นราคาเบื้องต้น ราคาสุดท้ายจะขึ้นอยู่กับสภาพรถจริงที่ตรวจสอบ เราให้ราคาตามสภาพจริง ไม่กดราคา และอธิบายเหตุผลอย่างชัดเจน",
              },
            ]}
          />

          {/* Pagination */}
          <div className="mt-12 flex items-center justify-center">
            <ul className="flex items-center space-x-2">
              <li>
                <a
                  href="#0"
                  className="flex h-10 min-w-[40px] items-center justify-center rounded-md bg-gray-100 px-4 text-sm font-medium text-gray-700 transition hover:bg-[#EF4444] hover:text-white"
                >
                  Prev
                </a>
              </li>
              <li>
                <a
                  href="#0"
                  className="flex h-10 min-w-[40px] items-center justify-center rounded-md bg-[#EF4444] px-4 text-sm font-medium text-white"
                >
                  1
                </a>
              </li>
              <li>
                <a
                  href="#0"
                  className="flex h-10 min-w-[40px] items-center justify-center rounded-md bg-gray-100 px-4 text-sm font-medium text-gray-700 transition hover:bg-[#EF4444] hover:text-white"
                >
                  2
                </a>
              </li>
              <li>
                <a
                  href="#0"
                  className="flex h-10 min-w-[40px] items-center justify-center rounded-md bg-gray-100 px-4 text-sm font-medium text-gray-700 transition hover:bg-[#EF4444] hover:text-white"
                >
                  3
                </a>
              </li>
              <li>
                <span className="flex h-10 min-w-[40px] cursor-not-allowed items-center justify-center rounded-md bg-gray-100 px-4 text-sm font-medium text-gray-400">
                  ...
                </span>
              </li>
              <li>
                <a
                  href="#0"
                  className="flex h-10 min-w-[40px] items-center justify-center rounded-md bg-gray-100 px-4 text-sm font-medium text-gray-700 transition hover:bg-[#EF4444] hover:text-white"
                >
                  12
                </a>
              </li>
              <li>
                <a
                  href="#0"
                  className="flex h-10 min-w-[40px] items-center justify-center rounded-md bg-gray-100 px-4 text-sm font-medium text-gray-700 transition hover:bg-[#EF4444] hover:text-white"
                >
                  Next
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
