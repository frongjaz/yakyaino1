import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // ดึงค่า Origin จาก request header
    const origin = request.headers.get('origin');

    // รายการโดเมนที่อนุญาต
    const allowedOrigins = [
        'https://checkkub.com',
        'https://www.checkkub.com',
        'https://yakyai-api.vercel.app',
        'http://localhost:3000',
        'http://localhost:3001',
    ];

    // ตรวจสอบว่า Origin อยู่ในรายการที่อนุญาตหรือไม่
    const isAllowedOrigin = origin && allowedOrigins.includes(origin);

    // กรณีเป็น OPTIONS request (Preflight)
    if (request.method === 'OPTIONS') {
        const response = new NextResponse(null, { status: 200 });

        if (isAllowedOrigin) {
            response.headers.set('Access-Control-Allow-Origin', origin);
        } else {
            // สำหรับ OPTIONS ถ้าไม่ระบุ Origin เฉพาะเจาะจง ให้เอาอันแรกเป็นหลักเพื่อให้ผ่านการเช็คเบื้องต้น
            response.headers.set('Access-Control-Allow-Origin', allowedOrigins[0]);
        }

        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        response.headers.set('Access-Control-Max-Age', '86400');

        return response;
    }

    // สำหรับ request ปกติ (GET, POST, ฯลฯ)
    const response = NextResponse.next();

    if (isAllowedOrigin) {
        response.headers.set('Access-Control-Allow-Origin', origin);
    } else if (!origin) {
        // ถ้าไม่มี origin (เช่น เรียกผ่าน server/postman) ให้ใช้ตัวหลัก
        response.headers.set('Access-Control-Allow-Origin', allowedOrigins[0]);
    }

    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    return response;
}

// กำหนดให้ middleware ทำงานเฉพาะกับ API เท่านั้น
export const config = {
    matcher: '/api/:path*',
};
