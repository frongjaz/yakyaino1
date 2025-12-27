import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('admin_session');

    if (!sessionCookie) {
      return NextResponse.json({
        success: false,
        authenticated: false,
      });
    }

    const session = JSON.parse(sessionCookie.value);

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: session,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      authenticated: false,
    });
  }
}

