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

  // Proxy uploaded images from HostAtom storage to Vercel
  // Proxy /images/ and /uploads/ through an API route that sets the correct
  // Host header so HostAtom's nginx routes to the right vhost and Node.js
  // serves the file from its local filesystem.
  nextConfig.rewrites = async () => [
    {
      source: "/images/:path*",
      destination: "/api/img/images/:path*",
    },
    {
      source: "/uploads/:path*",
      destination: "/api/img/uploads/:path*",
    },
  ];
}

module.exports = nextConfig;
