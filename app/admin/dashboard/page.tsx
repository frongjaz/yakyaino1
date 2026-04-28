'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { apiGet, apiDelete } from '@/lib/api';
import { getSession, clearSession } from '@/lib/auth-client';
import AddCarForm, { CarFormData } from '@/components/Admin/AddCarForm';
import AddBlogForm, { BlogData } from '@/components/Admin/AddBlogForm';
import { getImagePath } from '@/lib/utils';

interface Session { userId: number; username: string; role: string }
interface Car {
  id: number; brand: string; model: string; year: number; price: number;
  image: string; image2?: string; image3?: string; image4?: string; image5?: string;
  status: string; created_at: string; description?: string; mileage?: number;
  color?: string; transmission?: string; fuel_type?: string; engine_size?: string; license_plate?: string;
}
interface Blog { id: number; title: string; paragraph: string; image: string; status: string; createdAt: string; author: { name: string } }

type Tab = 'cars' | 'blogs';

function formatPrice(n: number) {
  return new Intl.NumberFormat('th-TH').format(n);
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    available: { label: 'พร้อมขาย', cls: 'bg-green-100 text-green-700' },
    sold:      { label: 'ขายแล้ว',  cls: 'bg-gray-100 text-gray-600' },
    pending:   { label: 'รอดำเนินการ', cls: 'bg-yellow-100 text-yellow-700' },
    published: { label: 'เผยแพร่แล้ว', cls: 'bg-green-100 text-green-700' },
    draft:     { label: 'แบบร่าง',   cls: 'bg-gray-100 text-gray-500' },
  };
  const s = map[status] ?? { label: status, cls: 'bg-gray-100 text-gray-500' };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>{s.label}</span>;
}

export default function AdminDashboardPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('cars');

  const [cars, setCars] = useState<Car[]>([]);
  const [carsLoading, setCarsLoading] = useState(false);
  const [showAddCar, setShowAddCar] = useState(false);
  const [deletingCarId, setDeletingCarId] = useState<number | null>(null);

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [deletingBlogId, setDeletingBlogId] = useState<number | null>(null);

  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  // ── auth ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const local = getSession();
      if (!local) { window.location.href = '/admin/login'; return; }
      try {
        const d = await apiGet<{ success: boolean; authenticated: boolean; user?: Session }>('/api/auth/check');
        if (d.success && d.authenticated && d.user) {
          setSession(d.user);
        } else {
          clearSession();
          window.location.href = '/admin/login';
        }
      } catch {
        setSession(local);
      }
      setLoading(false);
    })();
  }, []);

  // ── data ──────────────────────────────────────────────────────────────────
  const fetchCars = useCallback(async () => {
    setCarsLoading(true);
    try {
      const d = await apiGet<{ success: boolean; data: Car[] }>('/api/cars?limit=100');
      if (d.success) setCars(d.data ?? []);
    } catch {}
    setCarsLoading(false);
  }, []);

  const fetchBlogs = useCallback(async () => {
    setBlogsLoading(true);
    try {
      const d = await apiGet<{ success: boolean; data: Blog[] }>('/api/blogs?admin=true&status=all');
      if (d.success) setBlogs(d.data ?? []);
    } catch {}
    setBlogsLoading(false);
  }, []);

  useEffect(() => { if (session) { fetchCars(); fetchBlogs(); } }, [session, fetchCars, fetchBlogs]);

  // ── delete car ────────────────────────────────────────────────────────────
  const deleteCar = async (id: number) => {
    if (!confirm(`ยืนยันลบรถ ID ${id} ออกจากระบบ?`)) return;
    setDeletingCarId(id);
    try {
      await apiDelete(`/api/cars/${id}`);
      setCars(prev => prev.filter(c => c.id !== id));
    } catch (e: any) {
      alert('ลบไม่สำเร็จ: ' + (e.message ?? ''));
    }
    setDeletingCarId(null);
  };

  // ── delete blog ───────────────────────────────────────────────────────────
  const deleteBlog = async (id: number) => {
    if (!confirm(`ยืนยันลบบทความ ID ${id}?`)) return;
    setDeletingBlogId(id);
    try {
      await apiDelete(`/api/blogs/${id}`);
      setBlogs(prev => prev.filter(b => b.id !== id));
    } catch (e: any) {
      alert('ลบไม่สำเร็จ: ' + (e.message ?? ''));
    }
    setDeletingBlogId(null);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-gray-500 text-sm">กำลังโหลด...</p>
      </div>
    </div>
  );

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚗</span>
            <span className="font-bold text-gray-800">Admin Panel</span>
            <span className="hidden sm:block text-gray-300 mx-1">|</span>
            <Link href="/" className="hidden sm:block text-sm text-gray-400 hover:text-primary transition-colors">
              ดูเว็บไซต์ →
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">
              👤 {session.username}
            </span>
            <button
              onClick={() => { clearSession(); fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).finally(() => { window.location.href = '/admin/login'; }); }}
              className="text-sm px-3 py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* ── Stats ────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className="text-3xl">🚗</div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{cars.length}</div>
              <div className="text-xs text-gray-500">รถยนต์ทั้งหมด</div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className="text-3xl">📝</div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{blogs.length}</div>
              <div className="text-xs text-gray-500">บทความทั้งหมด</div>
            </div>
          </div>
          <div className="hidden sm:flex bg-white rounded-xl border border-gray-200 p-4 items-center gap-3">
            <div className="text-3xl">✅</div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {cars.filter(c => c.status === 'available').length}
              </div>
              <div className="text-xs text-gray-500">รถพร้อมขาย</div>
            </div>
          </div>
        </div>

        {/* ── Tab Bar ──────────────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-4 w-fit">
          {(['cars', 'blogs'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === t ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'cars' ? '🚗 รถยนต์' : '📝 บทความ'}
            </button>
          ))}
        </div>

        {/* ── Cars Tab ─────────────────────────────────────────────────────── */}
        {tab === 'cars' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-700">รายการรถยนต์ ({cars.length})</h2>
              <button
                onClick={() => setShowAddCar(v => !v)}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
              >
                {showAddCar ? '✕ ปิดฟอร์ม' : '+ เพิ่มรถใหม่'}
              </button>
            </div>

            {showAddCar && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-700 mb-4">เพิ่มรถใหม่</h3>
                <AddCarForm onSuccess={() => { setShowAddCar(false); fetchCars(); }} />
              </div>
            )}

            {editingCar && (
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <h3 className="font-semibold text-gray-700 mb-4">แก้ไขรถ: {editingCar.brand} {editingCar.model}</h3>
                <AddCarForm
                  initialData={editingCar as CarFormData}
                  onSuccess={() => { setEditingCar(null); fetchCars(); }}
                  onCancel={() => setEditingCar(null)}
                />
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {carsLoading ? (
                <div className="p-8 text-center text-gray-400 text-sm">กำลังโหลด...</div>
              ) : cars.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">ยังไม่มีข้อมูลรถ</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">รูป</th>
                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">ยี่ห้อ / รุ่น</th>
                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">ปี</th>
                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">ราคา</th>
                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">สถานะ</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {cars.map(car => (
                        <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="relative w-16 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image src={getImagePath(car.image)} alt={car.brand} fill className="object-cover" unoptimized onError={e => { (e.target as HTMLImageElement).src = '/images/404.svg'; }} />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-800">{car.brand} {car.model}</div>
                            <div className="text-xs text-gray-400">ID: {car.id}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{car.year}</td>
                          <td className="px-4 py-3 text-gray-600">{formatPrice(car.price)} ฿</td>
                          <td className="px-4 py-3"><StatusBadge status={car.status} /></td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => { setShowAddCar(false); setEditingCar(editingCar?.id === car.id ? null : car); }}
                                className={`text-xs px-3 py-1.5 rounded transition-colors ${editingCar?.id === car.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                              >
                                {editingCar?.id === car.id ? 'ปิด' : 'แก้ไข'}
                              </button>
                              <button
                                onClick={() => deleteCar(car.id)}
                                disabled={deletingCarId === car.id}
                                className="text-xs px-3 py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors"
                              >
                                {deletingCarId === car.id ? '...' : 'ลบ'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Blogs Tab ────────────────────────────────────────────────────── */}
        {tab === 'blogs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-700">รายการบทความ ({blogs.length})</h2>
              <button
                onClick={() => setShowAddBlog(v => !v)}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
              >
                {showAddBlog ? '✕ ปิดฟอร์ม' : '+ เพิ่มบทความ'}
              </button>
            </div>

            {showAddBlog && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-700 mb-4">เพิ่มบทความใหม่</h3>
                <AddBlogForm onSuccess={() => { setShowAddBlog(false); fetchBlogs(); }} />
              </div>
            )}

            {editingBlog && (
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <h3 className="font-semibold text-gray-700 mb-4">แก้ไขบทความ: {editingBlog.title}</h3>
                <AddBlogForm
                  initialData={{ ...editingBlog, author_name: editingBlog.author?.name } as BlogData}
                  onSuccess={() => { setEditingBlog(null); fetchBlogs(); }}
                  onCancel={() => setEditingBlog(null)}
                />
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {blogsLoading ? (
                <div className="p-8 text-center text-gray-400 text-sm">กำลังโหลด...</div>
              ) : blogs.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">ยังไม่มีบทความ</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">รูป</th>
                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">หัวข้อ</th>
                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">ผู้เขียน</th>
                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">สถานะ</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {blogs.map(blog => (
                        <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="relative w-16 h-12 rounded overflow-hidden bg-gray-100">
                              <Image src={getImagePath(blog.image)} alt={blog.title} fill className="object-cover" unoptimized onError={e => { (e.target as HTMLImageElement).src = '/images/404.svg'; }} />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-800 line-clamp-1">{blog.title}</div>
                            <div className="text-xs text-gray-400">ID: {blog.id}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{blog.author?.name}</td>
                          <td className="px-4 py-3"><StatusBadge status={blog.status} /></td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => { setShowAddBlog(false); setEditingBlog(editingBlog?.id === blog.id ? null : blog); }}
                                className={`text-xs px-3 py-1.5 rounded transition-colors ${editingBlog?.id === blog.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                              >
                                {editingBlog?.id === blog.id ? 'ปิด' : 'แก้ไข'}
                              </button>
                              <button
                                onClick={() => deleteBlog(blog.id)}
                                disabled={deletingBlogId === blog.id}
                                className="text-xs px-3 py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors"
                              >
                                {deletingBlogId === blog.id ? '...' : 'ลบ'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
