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

// GET - ดึง banner เดี่ยว
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'ID ไม่ถูกต้อง' },
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await query('SELECT * FROM banners WHERE id = ?', [id]);
    const banners = Array.isArray(result) ? result : [];

    if (banners.length === 0) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบ banner' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json({ success: true, data: banners[0] }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('[GET /api/banners/[id]]', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาด' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PUT - admin only: แก้ไข banner
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'ID ไม่ถูกต้อง' },
        { status: 400, headers: corsHeaders }
      );
    }

    const body = await request.json();
    const { image_url, alt_text, link_url, sort_order, is_active } = body;

    const fields: string[] = [];
    const values: any[] = [];

    if (image_url !== undefined) { fields.push('image_url = ?'); values.push(image_url); }
    if (alt_text !== undefined)  { fields.push('alt_text = ?');  values.push(alt_text); }
    if (link_url !== undefined)  { fields.push('link_url = ?');  values.push(link_url); }
    if (sort_order !== undefined){ fields.push('sort_order = ?');values.push(sort_order); }
    if (is_active !== undefined) { fields.push('is_active = ?'); values.push(is_active); }

    if (fields.length === 0) {
      return NextResponse.json(
        { success: false, message: 'ไม่มีข้อมูลที่ต้องการแก้ไข' },
        { status: 400, headers: corsHeaders }
      );
    }

    values.push(id);
    await query(`UPDATE banners SET ${fields.join(', ')} WHERE id = ?`, values);

    const updated = await query('SELECT * FROM banners WHERE id = ?', [id]);
    const updatedArray = Array.isArray(updated) ? updated : [];

    return NextResponse.json(
      { success: true, data: updatedArray[0] ?? null },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('[PUT /api/banners/[id]]', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาด' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE - admin only: ลบ banner
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'ID ไม่ถูกต้อง' },
        { status: 400, headers: corsHeaders }
      );
    }

    const existing = await query('SELECT id FROM banners WHERE id = ?', [id]);
    if (!Array.isArray(existing) || existing.length === 0) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบ banner' },
        { status: 404, headers: corsHeaders }
      );
    }

    await query('DELETE FROM banners WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'ลบ banner เรียบร้อย' }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('[DELETE /api/banners/[id]]', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาด' },
      { status: 500, headers: corsHeaders }
    );
  }
}
