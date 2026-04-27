import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_ORIGINS = [
    'https://checkkub.com',
    'https://www.checkkub.com',
    'https://v-autocar.co.th',
    'https://www.v-autocar.co.th',
    'https://yakyai-api.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
];

function getCorsOrigin(origin: string | null): string | null {
    if (!origin) return null;
    return ALLOWED_ORIGINS.includes(origin) ? origin : null;
}

export function middleware(request: NextRequest) {
    const origin = request.headers.get('origin');
    const allowedOrigin = getCorsOrigin(origin);

    // Preflight OPTIONS
    if (request.method === 'OPTIONS') {
        const response = new NextResponse(null, { status: 204 });
        if (allowedOrigin) {
            response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
            response.headers.set('Access-Control-Allow-Credentials', 'true');
        }
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        response.headers.set('Access-Control-Max-Age', '86400');
        response.headers.set('Vary', 'Origin');
        return response;
    }

    const response = NextResponse.next();

    if (allowedOrigin) {
        response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }
    response.headers.set('Vary', 'Origin');

    return response;
}

export const config = {
    matcher: '/api/:path*',
};
