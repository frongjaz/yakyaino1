'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import { toast } from 'sonner';
import { apiGet, apiDelete, apiDeleteTunnel } from '@/lib/api';
import { clearSession } from '@/lib/auth-client';
import AddCarForm, { CarFormData } from '@/components/Admin/AddCarForm';
import AddBlogForm, { BlogData } from '@/components/Admin/AddBlogForm';
import AddBannerForm, { BannerFormData } from '@/components/Admin/AddBannerForm';
import { getImagePath } from '@/lib/utils';

const fetcher = (url: string) => apiGet(url);

interface Session { userId: number; username: string; role: string }
interface Car {
  id: number; brand: string; model: string; year: number; price: number;
  image: string; image2?: string; image3?: string; image4?: string; image5?: string;
  status: string; created_at: string; description?: string; mileage?: number;
  color?: string; transmission?: string; fuel_type?: string; engine_size?: string; license_plate?: string;
}
interface Blog { id: number; title: string; paragraph: string; image: string; status: string; createdAt: string; author: { name: string } }
interface Banner { id: number; image_url: string; alt_text: string; sort_order: number; is_active: number; created_at: string }

type Tab = 'cars' | 'blogs' | 'banners';

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

  const [showAddCar, setShowAddCar] = useState(false);
  const [deletingCarId, setDeletingCarId] = useState<number | null>(null);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const [showAddBlog, setShowAddBlog] = useState(false);
  const [deletingBlogId, setDeletingBlogId] = useState<number | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  const [showAddBanner, setShowAddBanner] = useState(false);
  const [deletingBannerId, setDeletingBannerId] = useState<number | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // ── SWR data ──────────────────────────────────────────────────────────────
  const { data: carsData, isLoading: carsLoading, mutate: mutateCars } =
    useSWR(session ? '/api/cars?limit=100' : null, fetcher);
  const cars: Car[] = carsData?.data ?? [];

  const { data: blogsData, isLoading: blogsLoading, mutate: mutateBlogs } =
    useSWR(session ? '/api/blogs?admin=true&status=all' : null, fetcher);
  const blogs: Blog[] = blogsData?.data ?? [];

  const { data: bannersData, isLoading: bannersLoading, mutate: mutateBanners } =
    useSWR(session ? '/api/banners?admin=true' : null, fetcher);
  const banners: Banner[] = bannersData?.data ?? [];

  // ── auth ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const d = await apiGet<{ success: boolean; authenticated: boolean; user?: Session }>('/api/auth/check');
        if (d.success && d.authenticated && d.user) {
          setSession(d.user);
        } else {
          clearSession();
          window.location.href = '/admin/login';
        }
      } catch {
        window.location.href = '/admin/login';
      }
      setLoading(false);
    })();
  }, []);


  // ── delete car ────────────────────────────────────────────────────────────
  const deleteCar = async (id: number) => {
    if (!confirm(`ยืนยันลบรถ ID ${id} ออกจากระบบ?`)) return;
    setDeletingCarId(id);
    try {
      await apiDelete(`/api/cars/${id}`);
      toast.success('ลบรถสำเร็จ');
      mutateCars();
    } catch (e: any) {
      toast.error('ลบไม่สำเร็จ: ' + (e.message ?? 'เกิดข้อผิดพลาด'));
    }
    setDeletingCarId(null);
  };

  // ── delete banner ─────────────────────────────────────────────────────────
  const deleteBanner = async (id: number) => {
    if (!confirm(`ยืนยันลบ banner ID ${id}?`)) return;
    setDeletingBannerId(id);
    try {
      await apiDeleteTunnel(`/api/banners?id=${id}`);
      toast.success('ลบ banner สำเร็จ');
      mutateBanners();
    } catch (e: any) {
      toast.error('ลบไม่สำเร็จ: ' + (e.message ?? 'เกิดข้อผิดพลาด'));
    }
    setDeletingBannerId(null);
  };

  // ── delete blog ───────────────────────────────────────────────────────────
  const deleteBlog = async (id: number) => {
    if (!confirm(`ยืนยันลบบทความ ID ${id}?`)) return;
    setDeletingBlogId(id);
    try {
      await apiDelete(`/api/blogs/${id}`);
      toast.success('ลบบทความสำเร็จ');
      mutateBlogs();
    } catch (e: any) {
      toast.error('ลบไม่สำเร็จ: ' + (e.message ?? 'เกิดข้อผิดพลาด'));
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
            <div className="text-3xl">🖼️</div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{banners.filter(b => b.is_active).length}</div>
              <div className="text-xs text-gray-500">Banner ที่ใช้งาน</div>
            </div>
          </div>
        </div>

        {/* ── Tab Bar ──────────────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-4 w-fit">
          {(['cars', 'blogs', 'banners'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === t ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'cars' ? '🚗 รถยนต์' : t === 'blogs' ? '📝 บทความ' : '🖼️ Banner'}
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
                <AddCarForm onSuccess={() => { setShowAddCar(false); mutateCars(); }} />
              </div>
            )}

            {editingCar && (
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <h3 className="font-semibold text-gray-700 mb-4">แก้ไขรถ: {editingCar.brand} {editingCar.model}</h3>
                <AddCarForm
                  initialData={editingCar as CarFormData}
                  onSuccess={() => { setEditingCar(null); mutateCars(); }}
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
                <AddBlogForm onSuccess={() => { setShowAddBlog(false); mutateBlogs(); }} />
              </div>
            )}

            {editingBlog && (
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <h3 className="font-semibold text-gray-700 mb-4">แก้ไขบทความ: {editingBlog.title}</h3>
                <AddBlogForm
                  initialData={{ ...editingBlog, author_name: editingBlog.author?.name } as unknown as BlogData}
                  onSuccess={() => { setEditingBlog(null); mutateBlogs(); }}
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

        {/* ── Banners Tab ──────────────────────────────────────────────────── */}
        {tab === 'banners' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-700">Banner หน้าแรก ({banners.length})</h2>
              <button
                onClick={() => { setEditingBanner(null); setShowAddBanner(v => !v); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
              >
                {showAddBanner ? '✕ ปิดฟอร์ม' : '+ เพิ่ม Banner'}
              </button>
            </div>

            {showAddBanner && !editingBanner && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-700 mb-4">เพิ่ม Banner ใหม่</h3>
                <AddBannerForm onSuccess={() => { setShowAddBanner(false); mutateBanners(); }} />
              </div>
            )}

            {editingBanner && (
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <h3 className="font-semibold text-gray-700 mb-4">แก้ไข Banner ID: {editingBanner.id}</h3>
                <AddBannerForm
                  initialData={editingBanner as BannerFormData}
                  onSuccess={() => { setEditingBanner(null); mutateBanners(); }}
                  onCancel={() => setEditingBanner(null)}
                />
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {bannersLoading ? (
                <div className="p-8 text-center text-gray-400 text-sm">กำลังโหลด...</div>
              ) : banners.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">ยังไม่มี Banner</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {banners.map(banner => (
                    <div key={banner.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors">
                      <div className="relative w-24 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={getImagePath(banner.image_url)}
                          alt={banner.alt_text || 'banner'}
                          fill
                          className="object-cover"
                          unoptimized
                          onError={e => { (e.target as HTMLImageElement).src = '/images/404.svg'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">{banner.alt_text || '(ไม่มี alt text)'}</div>
                        <div className="text-xs text-gray-400 truncate">
                          ลำดับ: {banner.sort_order}
                        </div>
                      </div>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${banner.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {banner.is_active ? 'เปิด' : 'ปิด'}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => { setShowAddBanner(false); setEditingBanner(editingBanner?.id === banner.id ? null : banner); }}
                          className={`text-xs px-3 py-1.5 rounded transition-colors ${editingBanner?.id === banner.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                        >
                          {editingBanner?.id === banner.id ? 'ปิด' : 'แก้ไข'}
                        </button>
                        <button
                          onClick={() => deleteBanner(banner.id)}
                          disabled={deletingBannerId === banner.id}
                          className="text-xs px-3 py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors"
                        >
                          {deletingBannerId === banner.id ? '...' : 'ลบ'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
