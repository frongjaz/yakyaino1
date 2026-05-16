import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { getCorsHeaders } from '@/lib/cors';
import { signSession } from '@/lib/crypto-utils';

export const dynamic = 'force-dynamic';

// Simple in-memory rate limiter: 5 attempts per IP per minute
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 200, headers: getCorsHeaders(origin) });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, message: 'พยายามเข้าสู่ระบบหลายครั้งเกินไป กรุณารอ 1 นาทีแล้วลองใหม่' },
      { status: 429, headers: corsHeaders }
    );
  }

  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอก username และ password' },
        { status: 400, headers: corsHeaders }
      );
    }

    const users = await query(
      'SELECT * FROM users WHERE username = ? AND status = ?',
      [username, 'active']
    );

    const usersArray = Array.isArray(users) ? users : [];

    if (usersArray.length === 0) {
      return NextResponse.json(
        { success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401, headers: corsHeaders }
      );
    }

    const user = usersArray[0] as any;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401, headers: corsHeaders }
      );
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'คุณไม่มีสิทธิ์เข้าถึง' },
        { status: 403, headers: corsHeaders }
      );
    }

    await query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    const signedSession = signSession({
      userId: user.id,
      username: user.username,
      role: user.role,
      loginTime: Date.now(),
    });

    const response = NextResponse.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      user: { id: user.id, username: user.username, role: user.role },
    }, { headers: corsHeaders });

    response.cookies.set('admin_session', signedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
      { status: 500, headers: corsHeaders }
    );
  }
}
