import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCorsHeaders } from '@/lib/cors';
import { checkAuth } from '@/lib/auth-api';

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

