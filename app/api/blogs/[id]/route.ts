import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCorsHeaders } from '@/lib/cors';
import { checkAuth } from '@/lib/auth-api';

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

// GET - ดึงข้อมูลบทความตาม ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const blogId = resolvedParams.id;
    
    if (!blogId || isNaN(Number(blogId))) {
      return NextResponse.json(
        { success: false, message: 'ID ไม่ถูกต้อง' },
        { status: 400, headers: corsHeaders }
      );
    }

    const blogs = await query(
      'SELECT * FROM blogs WHERE id = ?',
      [blogId]
    );

    const blogsArray = Array.isArray(blogs) ? blogs : [];
    
    if (blogsArray.length === 0) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลบทความ' },
        { status: 404, headers: corsHeaders }
      );
    }

    const blog = blogsArray[0];
    
    // Parse tags from JSON string
    let tags: string[] = [];
    try {
      if (blog.tags) {
        tags = typeof blog.tags === 'string' ? JSON.parse(blog.tags) : blog.tags;
      }
    } catch (e) {
      // Ignore tag parsing errors
    }

    const transformedBlog = {
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

    return NextResponse.json({
      success: true,
      data: transformedBlog,
    }, {
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.error('Get blog error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาด', error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PUT - อัปเดตบทความ (ต้อง authentication)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
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

    const resolvedParams = params instanceof Promise ? await params : params;
    const blogId = resolvedParams.id;
    
    if (!blogId || isNaN(Number(blogId))) {
      return NextResponse.json(
        { success: false, message: 'ID ไม่ถูกต้อง' },
        { status: 400, headers: corsHeaders }
      );
    }

    const body = await request.json();
    const {
      title,
      paragraph,
      content,
      image,
      author_name,
      author_image,
      author_designation,
      tags,
      publish_date,
      date_published,
      status,
    } = body;

    // Convert tags array to JSON string
    const tagsJson = tags && Array.isArray(tags) ? JSON.stringify(tags) : null;

    // Update blog
    await query(
      `UPDATE blogs SET
        title = ?, paragraph = ?, content = ?, image = ?,
        author_name = ?, author_image = ?, author_designation = ?,
        tags = ?, publish_date = ?, date_published = ?, date_modified = NOW(), status = ?
      WHERE id = ?`,
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
        status || 'draft',
        blogId,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'อัปเดตบทความสำเร็จ',
    }, {
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.error('Update blog error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาด', error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE - ลบบทความ (ต้อง authentication)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
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

    const resolvedParams = params instanceof Promise ? await params : params;
    const blogId = resolvedParams.id;
    
    if (!blogId || isNaN(Number(blogId))) {
      return NextResponse.json(
        { success: false, message: 'ID ไม่ถูกต้อง' },
        { status: 400, headers: corsHeaders }
      );
    }

    await query('DELETE FROM blogs WHERE id = ?', [blogId]);

    return NextResponse.json({
      success: true,
      message: 'ลบบทความสำเร็จ',
    }, {
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.error('Delete blog error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาด', error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

