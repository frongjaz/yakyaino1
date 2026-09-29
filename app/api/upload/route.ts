import { NextRequest, NextResponse } from 'next/server';
import { getCorsHeaders } from '@/lib/cors';
import { checkAuth } from '@/lib/auth-api';
import { Client } from 'basic-ftp';
import { Readable } from 'stream';

export const maxDuration = 60;

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 200, headers: getCorsHeaders(origin) });
}

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

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'กรุณาเลือกไฟล์' },
        { status: 400, headers: corsHeaders }
      );
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น' },
        { status: 400, headers: corsHeaders }
      );
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'ขนาดไฟล์ไม่ควรเกิน 10MB' },
        { status: 400, headers: corsHeaders }
      );
    }

    const ftpHost = process.env.FTP_HOST;
    const ftpUser = process.env.FTP_USER;
    const ftpPassword = process.env.FTP_PASSWORD;

    if (!ftpHost || !ftpUser || !ftpPassword) {
      return NextResponse.json(
        { success: false, message: 'FTP configuration ไม่ครบถ้วน' },
        { status: 500, headers: corsHeaders }
      );
    }

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `car_${timestamp}_${randomStr}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const client = new Client();

    try {
      await Promise.race([
        client.access({ host: ftpHost, user: ftpUser, password: ftpPassword, secure: false }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('FTP connection timeout')), 15000)),
      ]);

      // FTP home for cazfrongz@checkkub.com is already /images/cars/ on HostAtom
      // Upload directly to FTP root = the target directory
      const stream = Readable.from(buffer);
      await Promise.race([
        client.uploadFrom(stream, fileName),
        new Promise((_, reject) => setTimeout(() => reject(new Error('FTP upload timeout')), 45000)),
      ]);
      client.close();

      // Relative URL — Vercel rewrite proxies this through the HostAtom Node.js
      const publicUrl = `/images/cars/${fileName}`;

      return NextResponse.json({
        success: true,
        message: 'อัพโหลดไฟล์สำเร็จ',
        url: publicUrl,
        fileName,
      }, { headers: corsHeaders });

    } catch (ftpError: any) {
      try { client.close(); } catch {}
      console.error('FTP upload error:', ftpError.message);

      let message = 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์';
      if (ftpError.message?.includes('timeout')) message = 'FTP connection timeout';
      else if (ftpError.message?.includes('530') || ftpError.message?.includes('Login')) message = 'FTP credentials ไม่ถูกต้อง';
      else if (ftpError.message?.includes('421')) message = 'FTP home directory ไม่พร้อม — กรุณาสร้าง folder images/cars บน HostAtom';

      return NextResponse.json(
        { success: false, message, error: ftpError.message },
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาด', error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
