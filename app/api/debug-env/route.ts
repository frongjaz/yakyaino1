import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // ตรวจสอบ environment variables (ไม่แสดง password)
  const envCheck = {
    hasDbHost: !!process.env.DB_HOST,
    hasDbUser: !!process.env.DB_USER,
    hasDbPassword: !!process.env.DB_PASSWORD ? '***' : false,
    hasDbName: !!process.env.DB_NAME,
    hasDbPort: !!process.env.DB_PORT,
    hasDbSocket: !!process.env.DB_SOCKET_PATH,
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    // แสดงค่าที่ไม่ sensitive
    dbHost: process.env.DB_HOST || 'ไม่พบ',
    dbUser: process.env.DB_USER || 'ไม่พบ',
    dbName: process.env.DB_NAME || 'ไม่พบ',
    dbPort: process.env.DB_PORT || '3306',
    dbSocket: process.env.DB_SOCKET_PATH || 'ไม่ใช้',
  };

  return NextResponse.json({
    success: true,
    message: 'Environment Variables Check',
    env: envCheck,
    timestamp: new Date().toISOString(),
  });
}

