import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';
import { getCorsHeaders } from '@/lib/cors';
import { checkAuth } from '@/lib/auth-api';

const BlogSchema = z.object({
  title: z.string().min(1).max(300),
  paragraph: z.string().min(1).max(1000),
  content: z.string().max(50000).optional().nullable(),
  image: z.string().min(1).max(500),
  author_name: z.string().min(1).max(100),
  author_image: z.string().max(500).optional().nullable(),
  author_designation: z.string().max(100).optional().nullable(),
  tags: z.array(z.string().max(50)).max(10).optional().nullable(),
  publish_date: z.string().max(50).optional().nullable(),
  date_published: z.string().datetime({ offset: true }).optional().nullable(),
  status: z.enum(['draft', 'published']).default('draft'),
});

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const headers = getCorsHeaders(origin);
  
  return new NextResponse(null, {
    status: 200,
    headers,
  });
}

// GET - ดึงรายการบทความทั้งหมด (ไม่ต้อง authentication - แสดงให้ทุกคนเห็น)
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'published';
    const admin = searchParams.get('admin') === 'true';
    
    // Build SQL query
    let sql = 'SELECT * FROM blogs';
    const params: any[] = [];
    
    // If not admin, show published blogs, or all if no published blogs exist
    if (!admin) {
      // First, try to get published blogs
      sql += ' WHERE status = ?';
      params.push('published');
    } else if (status !== 'all') {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY date_published DESC, created_at DESC';
    
    const blogs = await query(sql, params);
    const blogsArray = Array.isArray(blogs) ? blogs : [];
    
    // If no published blogs found and not admin, try to get all blogs (including draft)
    if (blogsArray.length === 0 && !admin) {
      const allBlogs = await query('SELECT * FROM blogs ORDER BY created_at DESC', []);
      const allBlogsArray = Array.isArray(allBlogs) ? allBlogs : [];
      if (allBlogsArray.length > 0) {
        blogsArray.push(...allBlogsArray);
      }
    }
    
    // Transform data to match Blog type
    const transformedBlogs = blogsArray.map((blog: any) => {
      // Parse tags from JSON string
      let tags: string[] = [];
      try {
        if (blog.tags) {
          tags = typeof blog.tags === 'string' ? JSON.parse(blog.tags) : blog.tags;
        }
      } catch (e) {
        // Ignore tag parsing errors
      }
      
      return {
        id: blog.id,
        title: blog.title,
        paragraph: blog.paragraph,
        content: blog.content,
        image: blog.image,
        author: {
          name: blog.author_name,
          image: blog.author_image || '',
          designation: blog.author_designation || '',
        },
        tags: Array.isArray(tags) ? tags : [],
        publishDate: blog.publish_date || '',
        datePublished: blog.date_published ? new Date(blog.date_published).toISOString() : undefined,
        dateModified: blog.date_modified ? new Date(blog.date_modified).toISOString() : undefined,
        status: blog.status,
        createdAt: blog.created_at,
        updatedAt: blog.updated_at,
      };
    });

    return NextResponse.json({
      success: true,
      data: transformedBlogs,
    }, {
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.error('Get blogs error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาด', error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST - เพิ่มบทความใหม่ (ต้อง authentication)
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  try {
    const auth = await checkAuth(request);
    
    if (!auth.authenticated) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'ไม่มีสิทธิ์เข้าถึง'
        },
        { status: 401, headers: corsHeaders }
      );
    }

    const parsed = BlogSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'ข้อมูลไม่ถูกต้อง', errors: parsed.error.flatten().fieldErrors },
        { status: 400, headers: corsHeaders }
      );
    }

    const {
      title, paragraph, content, image, author_name, author_image,
      author_designation, tags, publish_date, date_published, status,
    } = parsed.data;

    const tagsJson = tags && Array.isArray(tags) ? JSON.stringify(tags) : null;

    // เพิ่มข้อมูลบทความ
    const result = await query(
      `INSERT INTO blogs (
        title, paragraph, content, image, 
        author_name, author_image, author_designation, 
        tags, publish_date, date_published, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        paragraph,
        content || null,
        image,
        author_name,
        author_image || null,
        author_designation || null,
        tagsJson,
        publish_date || null,
        date_published ? new Date(date_published) : null,
        status,
      ]
    );

    const insertResult = result as any;

    return NextResponse.json({
      success: true,
      message: 'เพิ่มบทความสำเร็จ',
      data: {
        id: insertResult.insertId,
      },
    }, {
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.error('Add blog error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาด', error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

