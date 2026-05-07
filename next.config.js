/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export ONLY when building for HostAtom
  output: process.env.IS_STATIC_EXPORT === 'true' ? 'export' : undefined,
  experimental: {
    optimizeCss: true,
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    unoptimized: process.env.IS_STATIC_EXPORT === 'true',
    domains: ["localhost", "checkkub.com", "yakyai-api.vercel.app"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "checkkub.com",
      },
      {
        protocol: "https",
        hostname: "yakyai-api.vercel.app",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

module.exports = nextConfig;
