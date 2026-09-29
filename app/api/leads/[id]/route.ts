import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { checkAuth } from '@/lib/auth-api';

const VALID_STATUSES = ['new', 'following', 'closed', 'stopped'];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const auth = await checkAuth(req as any);
  if (!auth.authenticated) return NextResponse.json({ success: false, message: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 401 });

  const { id } = await Promise.resolve(params);
  const leadId = parseInt(id, 10);
  if (isNaN(leadId)) return NextResponse.json({ success: false, message: 'ID ไม่ถูกต้อง' }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const { tracking_status } = body;

  if (!tracking_status || !VALID_STATUSES.includes(tracking_status)) {
    return NextResponse.json({ success: false, message: 'tracking_status ไม่ถูกต้อง' }, { status: 422 });
  }

  await query('UPDATE tb_lead SET tracking_status = ? WHERE id = ?', [tracking_status, leadId]);

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const auth = await checkAuth(req as any);
  if (!auth.authenticated) return NextResponse.json({ success: false, message: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 401 });

  const { id } = await Promise.resolve(params);
  const leadId = parseInt(id, 10);
  if (isNaN(leadId)) return NextResponse.json({ success: false, message: 'ID ไม่ถูกต้อง' }, { status: 400 });

  await query('DELETE FROM tb_lead WHERE id = ?', [leadId]);

  return NextResponse.json({ success: true });
}
