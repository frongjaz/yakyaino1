import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCorsHeaders } from '@/lib/cors';
import { checkAuth } from '@/lib/auth-api';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 200, headers: getCorsHeaders(origin) });
}

// GET - public: ดึง banners ทั้งหมดที่ active
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin') === 'true';

    let sql = 'SELECT * FROM banners';
    const params: any[] = [];

    if (!admin) {
      sql += ' WHERE is_active = ?';
      params.push(1);
    }

    sql += ' ORDER BY sort_order ASC, created_at ASC';

    const banners = await query(sql, params);

    return NextResponse.json(
      { success: true, data: Array.isArray(banners) ? banners : [] },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('[GET /api/banners]', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาด' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST - admin only: เพิ่ม banner ใหม่
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
      image_url,
      alt_text = '',
      link_url = null,
      sort_order = 0,
      is_active = 1,
    } = body;

    if (!image_url) {
      return NextResponse.json(
        { success: false, message: 'กรุณาระบุ image_url' },
        { status: 400, headers: corsHeaders }
      );
    }

    const result: any = await query(
      'INSERT INTO banners (image_url, alt_text, link_url, sort_order, is_active) VALUES (?, ?, ?, ?, ?)',
      [image_url, alt_text, link_url, sort_order, is_active]
    );

    const newBanner = await query('SELECT * FROM banners WHERE id = ?', [result.insertId]);
    const bannerArray = Array.isArray(newBanner) ? newBanner : [];

    return NextResponse.json(
      { success: true, data: bannerArray[0] ?? null },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('[POST /api/banners]', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาด' },
      { status: 500, headers: corsHeaders }
    );
  }
}
