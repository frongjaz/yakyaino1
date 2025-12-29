import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { getCorsHeaders } from '@/lib/cors';

export const dynamic = 'force-dynamic';

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const headers = getCorsHeaders(origin);
  
  return new NextResponse(null, {
    status: 200,
    headers,
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอก username และ password' },
        { status: 400 }
      );
    }

    // ค้นหา user จากฐานข้อมูล
    const users = await query(
      'SELECT * FROM users WHERE username = ? AND status = ?',
      [username, 'active']
    );

    const usersArray = Array.isArray(users) ? users : [];
    
    if (usersArray.length === 0) {
      return NextResponse.json(
        { success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    const user = usersArray[0] as any;

    // ตรวจสอบ password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // ตรวจสอบว่าเป็น admin หรือไม่
    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'คุณไม่มีสิทธิ์เข้าถึง' },
        { status: 403 }
      );
    }

    // อัพเดท last_login
    await query(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    // สร้าง response และ return session data (ใช้ localStorage แทน cookies สำหรับ cross-domain)
    const sessionData = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };

    // Return session data in response body (client will store in localStorage)
    return NextResponse.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      session: sessionData, // Include session data for client-side storage
    }, {
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

