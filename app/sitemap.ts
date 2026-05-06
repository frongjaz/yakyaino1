import { MetadataRoute } from 'next';
import { encodeCarId } from '@/lib/id-encoder';
import { query } from '@/lib/db';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.checkkub.com';

async function fetchCarIds(): Promise<string[]> {
  try {
    const rows = await query('SELECT id FROM cars LIMIT 500', []);
    const arr = Array.isArray(rows) ? rows : [];
    return arr.map((r: any) => String(r.id)).filter(Boolean);
  } catch {
    return [];
  }
}

async function fetchBlogIds(): Promise<string[]> {
  try {
    const rows = await query("SELECT id FROM blogs WHERE status = 'published' LIMIT 200", []);
    const arr = Array.isArray(rows) ? rows : [];
    return arr.map((r: any) => String(r.id)).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [carIds, blogIds] = await Promise.all([fetchCarIds(), fetchBlogIds()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/sell`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/cars`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  const carRoutes: MetadataRoute.Sitemap = carIds.map((id) => ({
    url: `${baseUrl}/cars/${encodeCarId(id)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogIds.map((id) => ({
    url: `${baseUrl}/blog-details/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...carRoutes, ...blogRoutes];
}
