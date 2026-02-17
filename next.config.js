/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export ONLY when building for HostAtom
  output: process.env.IS_STATIC_EXPORT === 'true' ? 'export' : undefined,
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
