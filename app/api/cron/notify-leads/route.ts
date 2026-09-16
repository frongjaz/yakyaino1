import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

async function ensureColumn() {
  try {
    await query(
      "ALTER TABLE tb_lead ADD COLUMN line_notified TINYINT(1) NOT NULL DEFAULT 0"
    );
  } catch {
    // column already exists — ignore
  }
}

async function sendLine(token: string, groupId: string, lead: Record<string, unknown>) {
  const mileage = lead.mileage ? `ไมล์: ${Number(lead.mileage).toLocaleString('th-TH')} km\n` : '';
  const price = lead.asking_price
    ? `\nราคาที่ต้องการ: ${Number(lead.asking_price).toLocaleString('th-TH')} บาท`
    : '';
  const msg =
    `🚗 Lead ใหม่ #${lead.id}\n` +
    `ยี่ห้อ: ${lead.brand} ${lead.model} (${lead.year})\n` +
    mileage +
    `จังหวัด: ${lead.province}\n` +
    `โทร: ${lead.phone}` +
    price;

  const res = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ to: groupId, messages: [{ type: 'text', text: msg }] }),
  });
  return res.ok;
}

export async function GET(req: Request) {
  // Protect with Vercel cron secret or allow only Vercel cron calls
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const token = process.env.LINE_CHANNEL_TOKEN;
  const groupId = process.env.LINE_GROUP_ID;
  if (!token || !groupId) {
    return NextResponse.json({ ok: false, reason: 'LINE env not set' });
  }

  await ensureColumn();

  const leads = await query(
    'SELECT * FROM tb_lead WHERE line_notified = 0 ORDER BY id ASC LIMIT 20'
  ) as Record<string, unknown>[];

  const results: { id: unknown; ok: boolean }[] = [];
  for (const lead of leads) {
    const ok = await sendLine(token, groupId, lead);
    if (ok) {
      await query('UPDATE tb_lead SET line_notified = 1 WHERE id = ?', [lead.id]);
    }
    results.push({ id: lead.id, ok });
  }

  return NextResponse.json({ ok: true, notified: results });
}
