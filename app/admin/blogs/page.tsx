'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiGet, apiDelete } from '@/lib/api';
import { getSession, clearSession } from '@/lib/auth-client';
import AddBlogForm from '@/components/Admin/AddBlogForm';
import BlogCard from '@/components/Admin/BlogCard';
import LogoutButton from '@/components/Admin/LogoutButton';
import Link from 'next/link';

interface Session {
  userId: number;
  username: string;
  role: string;
}

interface Blog {
  id: number;
  title: string;
  paragraph: string;
  image: string;
  author: {
    name: string;
    image: string;
    designation: string;
  };
  tags: string[];
  publishDate: string;
  status: string;
  createdAt: string;
}

export default function AdminBlogsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const formRef = useRef<HTMLDivElement>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    checkAuth();
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(query) ||
        blog.paragraph.toLowerCase().includes(query) ||
        blog.author.name.toLowerCase().includes(query) ||
        blog.id.toString().includes(query)
    );
    setFilteredBlogs(filtered);
  }, [searchQuery, blogs]);

  // Handle auto-edit from query parameter
  useEffect(() => {
    if (editId && blogs.length > 0 && !editingBlog) {
      const blogToEdit = blogs.find(b => b.id.toString() === editId);
      if (blogToEdit) {
        handleEdit(blogToEdit);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, blogs]);

  const checkAuth = async () => {
    const localSession = getSession();

    if (localSession) {
      try {
        const data = await apiGet<{ success: boolean; authenticated: boolean; user?: Session }>('/api/auth/check');

        if (data.success && data.authenticated && data.user) {
          setSession(data.user);
        } else {
          clearSession();
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setSession(localSession);
      }
    } else {
      router.push('/admin/login');
    }

    setLoading(false);
  };

  const fetchBlogs = async () => {
    try {
      const data = await apiGet<{ success: boolean; data: Blog[] }>('/api/blogs?admin=true&status=all');
      if (data.success && data.data) {
        setBlogs(data.data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบบทความนี้?')) {
      return;
    }

    try {
      const data = await apiDelete(`/api/blogs/${id}`);
      if (data.success) {
        setBlogs(blogs.filter(blog => blog.id !== id));
        // alert('ลบบทความสำเร็จ');
      } else {
        alert(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('เกิดข้อผิดพลาดในการลบบทความ');
    }
  };

  const handleEdit = (blog: any) => {
    setEditingBlog(blog);
    setShowForm(true);

    // Smooth scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleFormSuccess = () => {
    fetchBlogs();
    setShowForm(false);
    setEditingBlog(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-body-color dark:text-body-color-dark font-medium">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#090E34] pb-20 transition-colors">
      {/* Header Section */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-dark/80 backdrop-blur-md border-b border-stroke dark:border-stroke-dark shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-dark dark:text-white leading-tight">ระบบจัดการบทความ</h1>
                <p className="text-xs font-medium text-body-color dark:text-body-color-dark">Dashboard / Articles</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/admin/dashboard" className="text-sm font-bold text-body-color dark:text-body-color-dark hover:text-primary transition-colors">จัดการรถ</Link>
              </nav>
              <div className="h-8 w-px bg-gray-200 dark:bg-stroke-dark hidden sm:block"></div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-dark dark:text-white">{session.username}</p>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Administrator</p>
                </div>
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-dark dark:text-white tracking-tight sm:text-4xl mb-2">
              บทความทั้งหมด <span className="text-primary">({blogs.length})</span>
            </h2>
            <p className="text-lg text-body-color dark:text-body-color-dark max-w-2xl">
              สร้าง แก้ไข และเผยแพร่บทความเพื่อเว็บไซต์ของคุณ
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingBlog(null);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-primary/25 transition-all active:scale-95"
          >
            {showForm ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                ซ่อนแบบฟอร์ม
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
                เพิ่มบทความใหม่
              </>
            )}
          </button>
        </div>

        {/* Add/Edit Form Section */}
        {showForm && (
          <div ref={formRef} className="animate-in fade-in slide-in-from-top-4 duration-500 mb-12">
            <div className="bg-white dark:bg-dark rounded-3xl p-8 sm:p-10 shadow-xl shadow-gray-200/50 dark:shadow-none border border-stroke dark:border-stroke-dark">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100 dark:border-stroke-dark">
                <div>
                  <h3 className="text-2xl font-bold text-dark dark:text-white">
                    {editingBlog ? 'แก้ไขบทความ' : 'สร้างบทความใหม่'}
                  </h3>
                  <p className="text-sm text-body-color dark:text-body-color-dark mt-1">
                    {editingBlog ? `แก้ไขข้อมูลบทความ ID: ${editingBlog.id}` : 'กรอกรายละเอียดบทความเพื่อเพิ่มลงในระบบ'}
                  </p>
                </div>
                <button
                  onClick={() => { setShowForm(false); setEditingBlog(null); }}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <AddBlogForm
                initialData={editingBlog}
                onSuccess={handleFormSuccess}
                onCancel={() => { setShowForm(false); setEditingBlog(null); }}
              />
            </div>
          </div>
        )}

        {/* Search and Filters Bar */}
        <div className="bg-white dark:bg-dark p-4 rounded-2xl shadow-sm border border-stroke dark:border-stroke-dark mb-8 flex flex-col md:row items-center gap-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="ค้นหาตามหัวข้อ, เนื้อหา หรือชื่อผู้เขียน..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-transparent focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl outline-none transition-all dark:text-white text-sm font-medium"
            />
          </div>
        </div>

        {/* Blogs Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="bg-white dark:bg-dark rounded-3xl p-20 text-center border border-dashed border-gray-300 dark:border-stroke-dark">
            <div className="mx-auto w-24 h-24 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-dark dark:text-white mb-2">
              {searchQuery ? 'ไม่พบผลลัพธ์ที่คุณค้นหา' : 'ยังไม่มีบทความในระบบ'}
            </h3>
            <p className="text-body-color dark:text-body-color-dark mb-8">
              {searchQuery ? 'ลองเปลี่ยนคำค้นหา หรือล้างคำค้นหาของคุณ' : 'เริ่มต้นสร้างบทความแรกของคุณโดยกดปุ่มด้านบน'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-primary font-bold border-b-2 border-primary hover:text-primary/80"
              >
                ล้างคำค้นหา
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
