/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Comment out for Node.js hosting (uncomment for static export)
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  // distDir: 'dist', // Comment out for Vercel (Vercel uses .next by default)
  // Use distDir only for static export builds (DirectAdmin)
  ...(process.env.NEXT_PUBLIC_BASE_PATH ? { distDir: 'dist' } : {}),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    unoptimized: true,
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
