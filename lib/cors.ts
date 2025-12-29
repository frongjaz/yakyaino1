/**
 * CORS Helper สำหรับ API routes
 */

export function getCorsHeaders(origin?: string | null) {
  // Allowed origins
  const allowedOrigins = [
    'https://checkkub.com',
    'http://checkkub.com',
    'https://www.checkkub.com',
    'http://www.checkkub.com',
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  // Check if origin is allowed
  const isAllowed = origin && allowedOrigins.includes(origin);

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
}

