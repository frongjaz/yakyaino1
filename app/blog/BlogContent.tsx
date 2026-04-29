'use client';

import { useEffect, useState } from 'react';
import SingleBlog from "@/components/Blog/SingleBlog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Script from "next/script";
import { apiGet } from "@/lib/api";
import { Blog } from "@/types/blog";

export default function BlogContent() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.checkkub.com";

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<{ success: boolean; data: Blog[]; message?: string }>('/api/blogs');
      if (data.success && data.data) {
        setBlogs(data.data);
      } else {
        setError(data.message || 'ไม่สามารถโหลดข้อมูลบทความได้');
      }
    } catch (error: any) {
      setError(error.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

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
          articleSection: blog.tags[0] || '',
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
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EF4444] mx-auto mb-4"></div>
              <p className="text-gray-600">กำลังโหลดบทความ...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-12 w-12 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">เกิดข้อผิดพลาด</h3>
              <p className="mb-4 text-gray-600">{error}</p>
              <button
                onClick={fetchBlogs}
                className="rounded-md bg-[#EF4444] px-6 py-2 text-white hover:bg-[#DC2626]"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                <svg
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">ยังไม่มีบทความ</h3>
              <p className="text-gray-600">
                บทความจะปรากฏที่นี่เมื่อมีการเพิ่มข้อมูล
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <div key={blog.id} className="w-full">
                  <SingleBlog blog={blog} />
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  );
}

