const { SECURITY_HEADERS } = require("./lib/securityHeaders");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export ONLY when building for HostAtom
  output: process.env.IS_STATIC_EXPORT === 'true' ? 'export' : undefined,
  poweredByHeader: false,
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
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

// headers() is incompatible with static export (output: 'export')
if (process.env.IS_STATIC_EXPORT !== 'true') {
  nextConfig.headers = async () => [
    {
      source: "/:path*",
      headers: SECURITY_HEADERS,
    },
  ];

  // NOTE: rewrites for /images/ and /uploads/ are intentionally removed.
  // They caused an infinite loop on HostAtom: image proxy → fetch checkkub.com
  // → nginx → Next.js rewrite → image proxy → repeat (957+ requests per image).
  // server.js already serves /images/ and /uploads/ directly from disk.
}

module.exports = nextConfig;
