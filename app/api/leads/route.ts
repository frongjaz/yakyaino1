import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { checkAuth } from '@/lib/auth-api';


export async function GET(req: Request) {
  const auth = await checkAuth(req as any);
  if (!auth.authenticated) return NextResponse.json({ success: false, message: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 401 });

  const rows = await query(
    'SELECT id, brand, model, year, mileage, province, phone, photo_url, asking_price, created_at FROM tb_lead ORDER BY id DESC LIMIT 200'
  );

  return NextResponse.json({ success: true, data: rows });
}
