import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
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

// ตรวจสอบ authentication
async function checkAuth(request: NextRequest): Promise<{ authenticated: boolean; user?: any }> {
  try {
    // Try to get session from cookie first (for same-domain)
    const sessionCookie = request.cookies.get('admin_session');
    
    // Also try to get from Authorization header (for cross-domain)
    const authHeader = request.headers.get('authorization');
    let session: any = null;
    
    if (sessionCookie) {
      // Same-domain: use cookie
      session = JSON.parse(sessionCookie.value);
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      // Cross-domain: use Authorization header
      try {
        const token = authHeader.replace('Bearer ', '');
        session = JSON.parse(decodeURIComponent(token));
      } catch {
        // Invalid token
      }
    }
    
    if (!session || session.role !== 'admin') {
      return { authenticated: false };
    }

    return { authenticated: true, user: session };
  } catch {
    return { authenticated: false };
  }
}

// GET - ดึงรายการรถทั้งหมด
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  try {
    const auth = await checkAuth(request);
    
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, message: 'ไม่มีสิทธิ์เข้าถึง' },
        { status: 401, headers: corsHeaders }
      );
    }

    const cars = await query(
      'SELECT * FROM cars ORDER BY created_at DESC'
    );

    const carsArray = Array.isArray(cars) ? cars : [];

    return NextResponse.json({
      success: true,
      data: carsArray,
    }, {
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.error('Get cars error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาด', error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST - เพิ่มรถใหม่
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  try {
    const auth = await checkAuth(request);
    
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, message: 'ไม่มีสิทธิ์เข้าถึง' },
        { status: 401, headers: corsHeaders }
      );
    }

    const body = await request.json();
    const {
      brand,
      model,
      year,
      price,
      image,
      photo_count,
      description,
      mileage,
      color,
      transmission,
      fuel_type,
      engine_size,
      status = 'available',
    } = body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!brand || !model || !year || !price || !image) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' },
        { status: 400, headers: corsHeaders }
      );
    }

    // เพิ่มข้อมูลรถ
    const result = await query(
      `INSERT INTO cars (
        brand, model, year, price, image, photo_count, description,
        mileage, color, transmission, fuel_type, engine_size, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        brand,
        model,
        year,
        price,
        image,
        photo_count || 0,
        description || null,
        mileage || null,
        color || null,
        transmission || null,
        fuel_type || null,
        engine_size || null,
        status,
      ]
    );

    const insertResult = result as any;

    return NextResponse.json({
      success: true,
      message: 'เพิ่มข้อมูลรถสำเร็จ',
      data: {
        id: insertResult.insertId,
      },
    }, {
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.error('Add car error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาด', error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

