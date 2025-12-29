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
      return NextResponse.json({
        success: false,
        authenticated: false,
      }, {
        headers: corsHeaders,
      });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: session,
    }, {
      headers: corsHeaders,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      authenticated: false,
    }, {
      headers: corsHeaders,
    });
  }
}

