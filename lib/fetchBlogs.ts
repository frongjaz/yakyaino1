import { query } from '@/lib/db';
import { Blog } from '@/types/blog';

export async function fetchBlogsSSR(): Promise<Blog[]> {
  try {
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
  } catch (error) {
    console.error('[SSR] Failed to fetch blogs:', error);
    return [];
  }
}
