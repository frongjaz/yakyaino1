import { NextRequest, NextResponse } from 'next/server';
import { getCorsHeaders } from '@/lib/cors';
import { Client } from 'basic-ftp';
import { checkAuth } from '@/lib/auth-api';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';

// Set max duration for Vercel (60 seconds for Pro plan, 10 seconds for Hobby)
export const maxDuration = 60;

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
    // Debug: Log authentication headers
    // Check authentication
    const auth = await checkAuth(request);
    
    if (!auth.authenticated) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'ไม่มีสิทธิ์เข้าถึง',
          debug: process.env.NODE_ENV === 'development' ? {
            hasAuthHeader: !!authHeader,
            hasCookie: !!sessionCookie,
          } : undefined
        },
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
    client.ftp.verbose = process.env.NODE_ENV === 'development'; // Enable verbose in development

    try {
      // Connect to FTP
        host: ftpHost, 
        path: ftpPath,
        fileSize: file.size,
        fileName: file.name,
      });
      
      // Connect with timeout
      await Promise.race([
        client.access({
          host: ftpHost,
          user: ftpUser,
          password: ftpPassword,
          secure: false, // Set to true for FTPS
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('FTP connection timeout')), 15000)
        ),
      ]);

      // Ensure directory exists
      await client.ensureDir(ftpPath);
      
      // Convert buffer to Readable stream
      const stream = Readable.from(buffer);
      
      // Upload file with timeout
      await Promise.race([
        client.uploadFrom(stream, remotePath),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('FTP upload timeout')), 45000)
        ),
      ]);

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
      try {
        client.close();
      } catch (closeError) {
        // Ignore close errors
      }
      
      console.error('FTP upload error:', {
        message: ftpError.message,
        code: ftpError.code,
        stack: ftpError.stack,
      });

      // Provide more specific error messages
      let errorMessage = 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์';
      if (ftpError.message) {
        if (ftpError.message.includes('ECONNREFUSED') || ftpError.message.includes('ETIMEDOUT') || ftpError.message.includes('timeout')) {
          errorMessage = 'ไม่สามารถเชื่อมต่อกับ FTP server ได้ กรุณาตรวจสอบ FTP_HOST และ network connection';
        } else if (ftpError.message.includes('530') || ftpError.message.includes('Login')) {
          errorMessage = 'FTP credentials ไม่ถูกต้อง กรุณาตรวจสอบ FTP_USER และ FTP_PASSWORD';
        } else if (ftpError.message.includes('550') || ftpError.message.includes('directory')) {
          errorMessage = 'Directory ไม่มีอยู่หรือไม่มีสิทธิ์เข้าถึง กรุณาตรวจสอบ FTP_PATH';
        } else {
          errorMessage = `FTP Error: ${ftpError.message}`;
        }
      }
      
      // Log detailed error for debugging
      console.error('FTP Error Details:', {
        message: ftpError.message,
        code: ftpError.code,
        host: ftpHost,
        path: ftpPath,
        fileSize: file.size,
      });

      return NextResponse.json(
        { 
          success: false, 
          message: errorMessage,
          error: ftpError.message,
          code: ftpError.code,
        },
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

