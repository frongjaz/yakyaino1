const ALLOWED_ORIGINS = [
  'https://checkkub.com',
  'https://www.checkkub.com',
  'https://v-autocar.co.th',
  'https://www.v-autocar.co.th',
  'https://yakyai-api.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
];

export function getCorsHeaders(origin?: string | null): Record<string, string> {
  const isAllowed = !!origin && ALLOWED_ORIGINS.includes(origin);

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };

  if (isAllowed) {
    headers['Access-Control-Allow-Origin'] = origin as string;
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  return headers;
}

