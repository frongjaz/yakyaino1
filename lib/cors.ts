/**
 * CORS Helper สำหรับ API routes
 */

export function getCorsHeaders(origin?: string | null) {
  // Allowed origins
  const allowedOrigins = [
    'https://checkkub.com',
    'https://www.checkkub.com',
    'https://yakyai-api.vercel.app', // For Vercel deployments
  ];

  // Add localhost for development
  if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:3000');
    allowedOrigins.push('http://localhost:3001');
  }

  // Check if origin is allowed
  const isAllowed = origin && allowedOrigins.some(o =>
    origin === o || origin === o + '/'
  );

  // If not allowed, we return headers that will cause a CORS error in the browser
  // but we still need to provide something for OPTIONS requests
  return {
    'Access-Control-Allow-Origin': isAllowed ? (origin as string) : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin', // Crucial for caching when multiple origins are supported
  };
}

