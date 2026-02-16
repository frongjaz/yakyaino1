/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Comment out for Node.js hosting (uncomment for static export)
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
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
