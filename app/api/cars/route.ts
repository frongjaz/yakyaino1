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


// GET - ดึงรายการรถทั้งหมด (ไม่ต้อง authentication - แสดงให้ทุกคนเห็น)
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  try {
    // Get search query from URL parameters
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';
    
    let sql = 'SELECT * FROM cars WHERE (status = ? OR status IS NULL)';
    const params: any[] = ['available'];
    
    // Add search condition if query exists
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.trim();
      const searchLower = searchTerm.toLowerCase();
      const containsTerm = `%${searchLower}%`;
      
      // Focus search on brand and model primarily
      // Only search in other fields if brand/model don't match
      sql += ` AND (
        LOWER(brand) = ? OR
        LOWER(brand) LIKE ? OR
        LOWER(model) LIKE ? OR
        LOWER(CONCAT(brand, ' ', model)) LIKE ?
      )`;
      
      // Parameters for brand/model search
      const exactBrand = searchLower;
      const brandStartsWith = `${searchLower}%`;
      
      params.push(
        exactBrand,        // 1. LOWER(brand) = ? (exact match)
        brandStartsWith,   // 2. LOWER(brand) LIKE ? (starts with)
        containsTerm,      // 3. LOWER(model) LIKE ? (contains)
        containsTerm       // 4. LOWER(CONCAT(brand, ' ', model)) LIKE ? (full name contains)
      );
      
      // Order by relevance: exact brand matches first, then brand starts with, then model
      sql += ` ORDER BY 
        CASE 
          WHEN LOWER(brand) = ? THEN 1
          WHEN LOWER(brand) LIKE ? THEN 2
          WHEN LOWER(model) LIKE ? THEN 3
          WHEN LOWER(CONCAT(brand, ' ', model)) LIKE ? THEN 4
          ELSE 5
        END,
        created_at DESC`;
      params.push(exactBrand, brandStartsWith, containsTerm, containsTerm);
    } else {
      sql += ' ORDER BY created_at DESC';
    }
    
    const cars = await query(sql, params);

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
      image2,
      image3,
      image4,
      image5,
      photo_count,
      description,
      mileage,
      color,
      transmission,
      fuel_type,
      engine_size,
      license_plate,
      status = 'available',
    } = body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!brand || !model || !year || !price || !image) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (ยี่ห้อ, รุ่น, ปี, ราคา, รูปภาพหลัก)' },
        { status: 400, headers: corsHeaders }
      );
    }

    // เพิ่มข้อมูลรถ
    const result = await query(
      `INSERT INTO cars (
        brand, model, year, price, image, image2, image3, image4, image5, photo_count, description,
        mileage, color, transmission, fuel_type, engine_size, license_plate, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        brand,
        model,
        year,
        price,
        image,
        image2 || null,
        image3 || null,
        image4 || null,
        image5 || null,
        photo_count || 0,
        description || null,
        mileage || null,
        color || null,
        transmission || null,
        fuel_type || null,
        engine_size || null,
        license_plate || null,
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

