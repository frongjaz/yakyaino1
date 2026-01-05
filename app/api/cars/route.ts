import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCorsHeaders } from '@/lib/cors';
import { checkAuth } from '@/lib/auth-api';

export const dynamic = 'force-dynamic';
export const maxDuration = 30; // 30 seconds timeout for Vercel

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
    // Get filter parameters from URL
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';
    const brand = searchParams.get('brand') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12'); // 12 cars per page
    const offset = (page - 1) * limit;
    
    // Build WHERE conditions
    let whereSql = 'WHERE (status = ? OR status IS NULL)';
    const whereParams: any[] = ['available'];
    
    // Add brand filter
    if (brand && brand !== 'ทั้งหมด') {
      whereSql += ' AND LOWER(brand) = ?';
      whereParams.push(brand.toLowerCase());
    }
    
    // Add price filters
    if (minPrice) {
      const min = parseInt(minPrice);
      if (!isNaN(min)) {
        whereSql += ' AND price >= ?';
        whereParams.push(min);
      }
    }
    
    if (maxPrice) {
      const max = parseInt(maxPrice);
      if (!isNaN(max)) {
        whereSql += ' AND price <= ?';
        whereParams.push(max);
      }
    }
    
    // Add search condition if query exists (only if no brand filter)
    if (searchQuery.trim() && !brand) {
      const searchTerm = searchQuery.trim();
      const searchLower = searchTerm.toLowerCase();
      const containsTerm = `%${searchLower}%`;
      
      // Focus search on brand and model primarily
      whereSql += ` AND (
        LOWER(brand) = ? OR
        LOWER(brand) LIKE ? OR
        LOWER(model) LIKE ? OR
        LOWER(CONCAT(brand, ' ', model)) LIKE ?
      )`;
      
      // Parameters for brand/model search
      const exactBrand = searchLower;
      const brandStartsWith = `${searchLower}%`;
      
      whereParams.push(
        exactBrand,        // LOWER(brand) = ? (exact match)
        brandStartsWith,   // LOWER(brand) LIKE ? (starts with)
        containsTerm,      // LOWER(model) LIKE ? (contains)
        containsTerm       // LOWER(CONCAT(brand, ' ', model)) LIKE ? (full name contains)
      );
    }
    
    // Get total count for pagination (without ORDER BY and LIMIT)
    const countSql = `SELECT COUNT(*) as total FROM cars ${whereSql}`;
    const countResult = await query(countSql, whereParams);
    const total = Array.isArray(countResult) && countResult.length > 0 
      ? (countResult[0] as any).total 
      : 0;
    
    // Build SELECT query with ORDER BY and pagination
    let sql = `SELECT * FROM cars ${whereSql}`;
    const params = [...whereParams];
    
    // Add ORDER BY
    if (searchQuery.trim() && !brand) {
      const searchTerm = searchQuery.trim();
      const searchLower = searchTerm.toLowerCase();
      const containsTerm = `%${searchLower}%`;
      const exactBrand = searchLower;
      const brandStartsWith = `${searchLower}%`;
      
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
    
    // Add pagination
    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const cars = await query(sql, params);

    const carsArray = Array.isArray(cars) ? cars : [];
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: carsArray,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
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

