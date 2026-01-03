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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://checkkub.com";

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await apiGet<{ success: boolean; data: Blog[] }>('/api/blogs');
      if (data.success && data.data) {
        setBlogs(data.data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
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
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">ยังไม่มีบทความ</p>
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

          {/* Pagination */}
          {blogs.length > 0 && (
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
          )}
        </div>
      </section>
    </>
  );
}

