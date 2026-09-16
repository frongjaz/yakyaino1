import { NextResponse } from 'next/server';


export async function POST(req: Request) {
  const token = process.env.LINE_CHANNEL_TOKEN;
  const groupId = process.env.LINE_GROUP_ID;

  if (!token || !groupId) {
    return NextResponse.json({ ok: false, reason: 'LINE env not set' }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: 'invalid json' }, { status: 400 });
  }

  const { id, brand, model, year, mileage, province, phone, asking_price } = body as Record<string, unknown>;

  const msg =
    `🚗 Lead ใหม่ #${id}\n` +
    `ยี่ห้อ: ${brand} ${model} (${year})\n` +
    (mileage ? `ไมล์: ${Number(mileage).toLocaleString('th-TH')} km\n` : '') +
    `จังหวัด: ${province}\n` +
    `โทร: ${phone}` +
    (asking_price ? `\nราคาที่ต้องการ: ${Number(asking_price).toLocaleString('th-TH')} บาท` : '');

  const res = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to: groupId,
      messages: [{ type: 'text', text: msg }],
    }),
  });

  const data = await res.json();
  return NextResponse.json({ ok: res.ok, line: data });
}
