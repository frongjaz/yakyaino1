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
    
    console.log(`[API] Received encoded ID: ${encodedId}`);
    
    // First try: Use decodeCarId function
    try {
      const decodedId = decodeCarId(encodedId);
      if (decodedId) {
        carId = decodedId;
        console.log(`[API] Decoded ID successfully: ${encodedId} -> ${carId}`);
      } else {
        console.log(`[API] decodeCarId returned null for: ${encodedId}`);
      }
    } catch (decodeError: any) {
      console.error('[API] Error decoding car ID:', decodeError);
      console.error('[API] Encoded ID:', encodedId);
      console.error('[API] Error stack:', decodeError.stack);
    }
    
    // Second try: Manual decode if decodeCarId failed
    if (!carId) {
      try {
        const SALT = 'checkkub';
        let base64 = encodedId.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        
        let decoded: string;
        if (typeof Buffer !== 'undefined') {
          // Node.js environment
          decoded = Buffer.from(base64, 'base64').toString('utf-8');
        } else if (typeof atob !== 'undefined') {
          // Browser environment
          decoded = atob(base64);
        } else {
          // Fallback: manual base64 decode
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
          let output = '';
          let i = 0;
          base64 = base64.replace(/[^A-Za-z0-9\+\/\=]/g, '');
          while (i < base64.length) {
            const enc1 = chars.indexOf(base64.charAt(i++));
            const enc2 = chars.indexOf(base64.charAt(i++));
            const enc3 = chars.indexOf(base64.charAt(i++));
            const enc4 = chars.indexOf(base64.charAt(i++));
            const chr1 = (enc1 << 2) | (enc2 >> 4);
            const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            const chr3 = ((enc3 & 3) << 6) | enc4;
            output += String.fromCharCode(chr1);
            if (enc3 !== 64) output += String.fromCharCode(chr2);
            if (enc4 !== 64) output += String.fromCharCode(chr3);
          }
          decoded = output;
        }
        
        if (decoded && decoded.startsWith(SALT)) {
          const manualDecodedId = decoded.substring(SALT.length);
          if (/^\d+$/.test(manualDecodedId)) {
            carId = manualDecodedId;
            console.log(`[API] Manual decode successful: ${encodedId} -> ${carId}`);
          } else {
            console.error('[API] Manual decoded ID is not a number:', manualDecodedId);
          }
        } else {
          console.error('[API] Manual decoded string does not start with salt:', decoded);
        }
      } catch (manualError: any) {
        console.error('[API] Manual decode failed:', manualError);
        console.error('[API] Manual decode error stack:', manualError.stack);
      }
    }
    
    // Third try: Plain numeric ID fallback
    if (!carId) {
      if (/^\d+$/.test(encodedId)) {
        // Fallback: support plain numeric IDs for backward compatibility
        carId = encodedId;
        console.log(`[API] Using plain numeric ID: ${carId}`);
      } else {
        console.error('[API] Invalid car ID format:', encodedId);
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

