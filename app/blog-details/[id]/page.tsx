import { Metadata } from 'next';
import BlogDetailsClient from "./BlogDetailsClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.checkkub.com';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || baseUrl;

// สำหรับ Static Export: สร้างหน้าตั้งต้นไว้ 1 หน้า (เพื่อให้ build ผ่าน)
// ระบบจะใช้ .htaccess ในการส่งหน้าบล็อกอื่นๆ มาที่หน้านี้แทน
export function generateStaticParams() {
  return [{ id: 'detail' }];
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params;

  if (!id || id === 'detail') {
    return {
      title: 'บทความรถยนต์ | CheckKub',
      description: 'บทความความรู้เกี่ยวกับรถยนต์มือสอง เทคนิคการซื้อขาย ราคาตลาด และข้อมูลที่เป็นประโยชน์จาก CheckKub',
      keywords: ['บทความรถยนต์', 'ความรู้รถมือสอง', 'เทคนิคซื้อรถ', 'CheckKub บล็อก'],
      robots: { index: false, follow: false },
    };
  }

  try {
    const res = await fetch(`${apiUrl}/api/blogs/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return {};
    const data = await res.json();
    const blog = data?.data;
    if (!blog) return {};

    const title = `${blog.title} | CheckKub`;
    const description = (blog.paragraph || blog.title).slice(0, 160);
    const imageUrl = blog.image?.startsWith('http') ? blog.image : `${baseUrl}${blog.image || '/images/placeholder.jpg'}`;
    const blogUrl = `${baseUrl}/blog-details/${id}`;

    return {
      metadataBase: new URL(baseUrl),
      title: { absolute: title },
      description,
      keywords: blog.tags?.length ? blog.tags : ['บทความรถยนต์', 'CheckKub'],
      alternates: { canonical: blogUrl },
      openGraph: {
        title,
        description,
        url: blogUrl,
        siteName: 'CheckKub',
        images: [{ url: imageUrl, width: 1200, height: 630, alt: blog.title }],
        locale: 'th_TH',
        type: 'article',
        publishedTime: blog.datePublished || blog.publishDate,
        modifiedTime: blog.dateModified || blog.datePublished,
        authors: blog.author?.name ? [blog.author.name] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch {
    return {};
  }
}

export default function BlogDetailsPage() {
  return <BlogDetailsClient />;
}
