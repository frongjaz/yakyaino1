import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCorsHeaders } from '@/lib/cors';
import { decodeCarId } from '@/lib/id-encoder';

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

// GET - ดึงข้อมูลรถตาม ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  try {
    const encodedId = params.id;
    
    // Try to decode if it's an encoded ID, otherwise use as-is
    let carId: string;
    const decodedId = decodeCarId(encodedId);
    
    if (decodedId) {
      carId = decodedId;
    } else if (/^\d+$/.test(encodedId)) {
      // Fallback: support plain numeric IDs for backward compatibility
      carId = encodedId;
    } else {
      return NextResponse.json(
        { success: false, message: 'ID ไม่ถูกต้อง' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!carId || isNaN(Number(carId))) {
      return NextResponse.json(
        { success: false, message: 'ID ไม่ถูกต้อง' },
        { status: 400, headers: corsHeaders }
      );
    }

    const cars = await query(
      'SELECT * FROM cars WHERE id = ?',
      [carId]
    );

    const carsArray = Array.isArray(cars) ? cars : [];
    
    if (carsArray.length === 0) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลรถ' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json({
      success: true,
      data: carsArray[0],
    }, {
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.error('Get car error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาด', error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

