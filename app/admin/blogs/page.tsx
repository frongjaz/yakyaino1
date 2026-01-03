'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, apiDelete } from '@/lib/api';
import { getSession, clearSession } from '@/lib/auth-client';
import AddBlogForm from '@/components/Admin/AddBlogForm';
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  useEffect(() => {
    checkAuth();
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        alert('ลบบทความสำเร็จ');
      } else {
        alert(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('เกิดข้อผิดพลาดในการลบบทความ');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-dark dark:via-gray-dark dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-body-color dark:text-body-color-dark">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-dark dark:via-gray-dark dark:to-black">
      {/* Header */}
      <div className="bg-white dark:bg-dark shadow-sm border-b border-stroke dark:border-stroke-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-dark dark:text-white">จัดการบทความ</h1>
                <p className="text-sm text-body-color dark:text-body-color-dark">สร้างและจัดการบทความ</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary"
              >
                จัดการรถ
              </Link>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-dark dark:text-white">{session.username}</p>
                <p className="text-xs text-body-color dark:text-body-color-dark">Admin</p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toggle Form Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingBlog(null);
            }}
            className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            {showForm ? 'ซ่อนฟอร์ม' : 'เพิ่มบทความใหม่'}
          </button>
        </div>

        {/* Add Blog Form */}
        {showForm && (
          <div className="bg-white dark:bg-dark rounded-lg shadow-three dark:shadow-two p-8 border border-stroke dark:border-stroke-dark mb-8">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-stroke dark:border-stroke-dark">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <svg className="h-7 w-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-dark dark:text-white">เพิ่มบทความใหม่</h2>
                <p className="text-sm text-body-color dark:text-body-color-dark mt-1">กรอกข้อมูลบทความที่ต้องการเพิ่มลงในระบบ</p>
              </div>
            </div>
            <AddBlogForm />
          </div>
        )}

        {/* Blogs List */}
        <div className="bg-white dark:bg-dark rounded-lg shadow-three dark:shadow-two p-8 border border-stroke dark:border-stroke-dark">
          <h2 className="text-2xl font-bold text-dark dark:text-white mb-6">รายการบทความ ({blogs.length})</h2>
          
          {blogs.length === 0 ? (
            <p className="text-body-color dark:text-body-color-dark">ยังไม่มีบทความ</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">หัวข้อ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ผู้เขียน</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">สถานะ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">วันที่สร้าง</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-dark divide-y divide-gray-200 dark:divide-gray-700">
                  {blogs.map((blog) => (
                    <tr key={blog.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{blog.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">{blog.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{blog.author.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          blog.status === 'published' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {blog.status === 'published' ? 'เผยแพร่' : 'ฉบับร่าง'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {new Date(blog.createdAt).toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

