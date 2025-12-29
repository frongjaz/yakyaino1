import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  try {
    const sessionCookie = request.cookies.get('admin_session');

    if (!sessionCookie) {
      return NextResponse.json({
        success: false,
        authenticated: false,
      }, {
        headers: corsHeaders,
      });
    }

    const session = JSON.parse(sessionCookie.value);

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: session,
    }, {
      headers: corsHeaders,
    });
  } catch (error) {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    
    return NextResponse.json({
      success: false,
      authenticated: false,
    }, {
      headers: corsHeaders,
    });
  }
}

