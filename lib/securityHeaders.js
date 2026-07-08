const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.tiktok.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://checkkub.com https://www.checkkub.com https://yakyai-api.vercel.app https://cdn.sanity.io https://www.google-analytics.com https://www.googletagmanager.com https://i.ytimg.com https://*.tiktokcdn.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com https://vitals.vercel-insights.com https://va.vercel-scripts.com https://yakyai-api.vercel.app https://checkkub.com https://www.checkkub.com",
  "frame-src 'self' https://www.youtube.com https://youtube.com https://maps.google.com https://www.google.com https://www.tiktok.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
];

module.exports = { SECURITY_HEADERS, CONTENT_SECURITY_POLICY };
