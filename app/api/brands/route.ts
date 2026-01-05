import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCorsHeaders } from '@/lib/cors';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const headers = getCorsHeaders(origin);
  
  return new NextResponse(null, {
    status: 200,
    headers,
  });
}

// GET - ดึงยี่ห้อรถทั้งหมด (unique brands) จาก database
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  try {
    // Get unique brands from cars table where status is available
    const sql = `
      SELECT DISTINCT brand 
      FROM cars 
      WHERE (status = ? OR status IS NULL) 
        AND brand IS NOT NULL 
        AND brand != ''
      ORDER BY brand ASC
    `;
    
    const brands = await query(sql, ['available']);
    const brandsArray = Array.isArray(brands) ? brands : [];
    
    // Extract brand names from result
    const brandNames = brandsArray.map((row: any) => row.brand).filter(Boolean);

    return NextResponse.json({
      success: true,
      data: brandNames,
    }, {
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.error('Get brands error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาด', error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

