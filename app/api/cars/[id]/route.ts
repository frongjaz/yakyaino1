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
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  try {
    // Handle both Promise and direct params (Next.js 13+ vs 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const encodedId = resolvedParams.id;
    
    if (!encodedId) {
      console.error('Missing car ID parameter');
      return NextResponse.json(
        { success: false, message: 'ID ไม่ถูกต้อง' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Try to decode if it's an encoded ID, otherwise use as-is
    let carId: string | null = null;
    
    try {
      const decodedId = decodeCarId(encodedId);
      if (decodedId) {
        carId = decodedId;
        console.log(`Decoded ID: ${encodedId} -> ${carId}`);
      }
    } catch (decodeError: any) {
      console.error('Error decoding car ID:', decodeError);
      console.error('Encoded ID:', encodedId);
    }
    
    // If decode failed, try plain numeric ID
    if (!carId) {
      if (/^\d+$/.test(encodedId)) {
        // Fallback: support plain numeric IDs for backward compatibility
        carId = encodedId;
        console.log(`Using plain numeric ID: ${carId}`);
      } else {
        console.error('Invalid car ID format:', encodedId);
        return NextResponse.json(
          { success: false, message: 'ID ไม่ถูกต้อง', debug: { encodedId, decodedId: null } },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    if (!carId || isNaN(Number(carId))) {
      console.error('Invalid car ID after processing:', carId);
      return NextResponse.json(
        { success: false, message: 'ID ไม่ถูกต้อง', debug: { encodedId, carId } },
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

