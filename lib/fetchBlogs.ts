import { query } from '@/lib/db';
import { Blog } from '@/types/blog';

function transformRows(rows: any[]): Blog[] {
  return rows.map((blog: any) => {
    let tags: string[] = [];
    try {
      if (blog.tags) {
        tags = typeof blog.tags === 'string' ? JSON.parse(blog.tags) : blog.tags;
      }
    } catch (_) {}

    return {
      id: blog.id,
      title: blog.title,
      paragraph: blog.paragraph,
      content: blog.content,
      image: blog.image,
      author: {
        name: blog.author_name,
        image: blog.author_image || '',
        designation: blog.author_designation || '',
      },
      tags: Array.isArray(tags) ? tags : [],
      publishDate: blog.publish_date || '',
      datePublished: blog.date_published
        ? new Date(blog.date_published).toISOString()
        : undefined,
      dateModified: blog.date_modified
        ? new Date(blog.date_modified).toISOString()
        : undefined,
    };
  });
}

async function fetchFromDB(): Promise<Blog[]> {
  let rows: any[] = [];
  const published = await query(
    'SELECT * FROM blogs WHERE status = ? ORDER BY date_published DESC, created_at DESC',
    ['published']
  );
  rows = Array.isArray(published) ? published : [];

  if (rows.length === 0) {
    const all = await query('SELECT * FROM blogs ORDER BY created_at DESC', []);
    rows = Array.isArray(all) ? all : [];
  }

  return transformRows(rows);
}

async function fetchFromAPI(): Promise<Blog[]> {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '');
  if (!apiUrl) return [];

  const res = await fetch(`${apiUrl}/api/blogs`, { cache: 'no-store' });
  if (!res.ok) return [];

  const data = await res.json();
  const items: any[] = data?.data || [];

  return items.map((blog: any) => {
    let tags: string[] = [];
    try {
      if (blog.tags && typeof blog.tags === 'string') tags = JSON.parse(blog.tags);
      else if (Array.isArray(blog.tags)) tags = blog.tags;
    } catch (_) {}

    return {
      id: blog.id,
      title: blog.title,
      paragraph: blog.paragraph,
      content: blog.content,
      image: blog.image,
      author: {
        name: blog.author?.name || blog.author_name || '',
        image: blog.author?.image || blog.author_image || '',
        designation: blog.author?.designation || blog.author_designation || '',
      },
      tags,
      publishDate: blog.publishDate || blog.publish_date || '',
      datePublished: blog.datePublished,
      dateModified: blog.dateModified,
    };
  });
}

export async function fetchBlogsSSR(): Promise<Blog[]> {
  // Try direct DB first (fastest, works when DB env vars are set)
  try {
    const blogs = await fetchFromDB();
    if (blogs.length > 0) return blogs;
  } catch (err) {
    console.error('[SSR] DB blog query failed, trying API fallback:', err);
  }

  // Fallback: fetch from PHP API (works when NEXT_PUBLIC_API_URL is set)
  try {
    const blogs = await fetchFromAPI();
    if (blogs.length > 0) return blogs;
  } catch (err) {
    console.error('[SSR] API blog fallback also failed:', err);
  }

  return [];
}
