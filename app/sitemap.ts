import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.checkkub.com';

async function fetchCarIds(): Promise<string[]> {
  try {
    const res = await fetch(`${baseUrl}/api/cars?limit=200`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    const cars: { id?: string | number }[] = data?.data ?? data?.cars ?? [];
    return cars.map((c) => String(c.id)).filter(Boolean);
  } catch {
    return [];
  }
}

async function fetchBlogIds(): Promise<string[]> {
  try {
    const res = await fetch(`${baseUrl}/api/blogs?limit=200`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    const blogs: { id?: string | number }[] = data?.data ?? data?.blogs ?? [];
    return blogs.map((b) => String(b.id)).filter(Boolean);
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
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  const carRoutes: MetadataRoute.Sitemap = carIds.map((id) => ({
    url: `${baseUrl}/cars/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogIds.map((id) => ({
    url: `${baseUrl}/blog-details/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...carRoutes, ...blogRoutes];
}
