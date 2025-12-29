import { NextRequest, NextResponse } from 'next/server';
import { getCorsHeaders } from '@/lib/cors';
import { Client } from 'basic-ftp';
import { checkAuth } from '@/lib/auth-api';

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

// POST - Upload image to FTP
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  try {
    // Check authentication
    const auth = await checkAuth(request);
    
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, message: 'ไม่มีสิทธิ์เข้าถึง' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'กรุณาเลือกไฟล์' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'ขนาดไฟล์ไม่ควรเกิน 10MB' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Get FTP configuration
    const ftpHost = process.env.FTP_HOST;
    const ftpUser = process.env.FTP_USER;
    const ftpPassword = process.env.FTP_PASSWORD;
    const ftpPath = process.env.FTP_PATH || '/domains/checkkub.com/public_html/images/cars/';

    if (!ftpHost || !ftpUser || !ftpPassword) {
      return NextResponse.json(
        { success: false, message: 'FTP configuration ไม่ครบถ้วน' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `car_${timestamp}_${randomString}.${fileExtension}`;
    const remotePath = `${ftpPath}${fileName}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to FTP
    const client = new Client();
    client.ftp.verbose = false; // Set to true for debugging

    try {
      await client.access({
        host: ftpHost,
        user: ftpUser,
        password: ftpPassword,
        secure: false, // Set to true for FTPS
      });

      // Ensure directory exists
      await client.ensureDir(ftpPath);

      // Upload file
      await client.uploadFrom(buffer, remotePath);

      // Close connection
      client.close();

      // Generate public URL
      // Remove /domains/checkkub.com/public_html from path to get relative path
      const relativePath = ftpPath.replace(/^\/domains\/[^\/]+\/public_html/, '');
      const publicUrl = `${relativePath}${fileName}`.replace(/\/+/g, '/'); // Remove double slashes
      const fullUrl = process.env.NEXT_PUBLIC_BASE_URL 
        ? `${process.env.NEXT_PUBLIC_BASE_URL}${publicUrl}`
        : publicUrl;

      return NextResponse.json({
        success: true,
        message: 'อัพโหลดไฟล์สำเร็จ',
        url: fullUrl,
        fileName: fileName,
      }, {
        headers: corsHeaders,
      });
    } catch (ftpError: any) {
      client.close();
      console.error('FTP upload error:', ftpError);
      return NextResponse.json(
        { success: false, message: 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์', error: ftpError.message },
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาด', error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

