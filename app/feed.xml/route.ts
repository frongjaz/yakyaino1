import { NextResponse } from 'next/server';
import { fetchBlogsSSR } from '@/lib/fetchBlogs';

export const revalidate = 3600;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.checkkub.com';

  const blogs = await fetchBlogsSSR();

  const items = blogs.slice(0, 50).map((blog) => {
    const imageUrl = blog.image?.startsWith('http') ? blog.image : `${baseUrl}${blog.image || ''}`;
    const pubDate = new Date(blog.datePublished || blog.publishDate || Date.now()).toUTCString();
    const link = `${baseUrl}/blog-details/${blog.id}`;
    return `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <description><![CDATA[${blog.paragraph || ''}]]></description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      ${blog.author?.name ? `<author>${blog.author.name}</author>` : ''}
      ${blog.tags?.map((t) => `<category>${t}</category>`).join('') || ''}
      ${imageUrl ? `<enclosure url="${imageUrl}" length="0" type="image/jpeg"/>` : ''}
    </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CheckKub บทความรถยนต์</title>
    <description>บทความความรู้เกี่ยวกับรถยนต์มือสอง เทคนิคการซื้อขาย ราคาตลาด และข้อมูลที่เป็นประโยชน์</description>
    <link>${baseUrl}/blog</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>th</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
