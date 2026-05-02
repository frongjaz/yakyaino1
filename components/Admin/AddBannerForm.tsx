'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { apiPost, apiPut, getApiUrl } from '@/lib/api';
import { getImagePath } from '@/lib/utils';

export interface BannerFormData {
  id?: number;
  image_url: string;
  alt_text: string;
  link_url?: string | null;
  sort_order: number;
  is_active: number;
}

interface Props {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: BannerFormData;
}

export default function AddBannerForm({ onSuccess, onCancel, initialData }: Props = {}) {
  const isEdit = !!initialData?.id;
  const fileRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);

  const [formData, setFormData] = useState({
    image_url: initialData?.image_url || '',
    alt_text: initialData?.alt_text || '',
    link_url: initialData?.link_url || '',
    sort_order: (initialData?.sort_order ?? 0).toString(),
    is_active: initialData?.is_active ?? 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'is_active' ? parseInt(value) : value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setMessage({ type: 'error', text: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น' }); return; }
    if (file.size > 10 * 1024 * 1024) { setMessage({ type: 'error', text: 'ขนาดไฟล์ไม่ควรเกิน 10MB' }); return; }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setMessage(null);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const token = localStorage.getItem('admin_session');
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${encodeURIComponent(token)}`;
    const res = await fetch(getApiUrl('/api/upload'), { method: 'POST', body: fd, credentials: 'include', headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
      throw new Error(err.message || 'อัพโหลดไม่สำเร็จ');
    }
    const data = await res.json();
    return data.url || data.path || '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!formData.image_url && !file) {
      setMessage({ type: 'error', text: 'กรุณาเลือกรูปภาพ' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      let imageUrl = formData.image_url;
      if (file) {
        setUploading(true);
        imageUrl = await uploadImage(file);
        setUploading(false);
      }

      const payload = {
        image_url: imageUrl,
        alt_text: formData.alt_text,
        link_url: formData.link_url || null,
        sort_order: parseInt(formData.sort_order) || 0,
        is_active: formData.is_active,
      };

      if (isEdit && initialData?.id) {
        await apiPut(`/api/banners/${initialData.id}`, payload);
        setMessage({ type: 'success', text: 'แก้ไข banner เรียบร้อย' });
      } else {
        await apiPost('/api/banners', payload);
        setMessage({ type: 'success', text: 'เพิ่ม banner เรียบร้อย' });
      }

      setTimeout(() => onSuccess?.(), 800);
    } catch (err: any) {
      setUploading(false);
      setMessage({ type: 'error', text: err.message || 'เกิดข้อผิดพลาด' });
    }
    setLoading(false);
  };

  const clearImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">รูปภาพ Banner</label>
        <div
          onClick={() => fileRef.current?.click()}
          className="relative cursor-pointer rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/50 transition-colors overflow-hidden bg-gray-50"
          style={{ minHeight: '180px' }}
        >
          {imagePreview ? (
            <Image
              src={imagePreview.startsWith('data:') ? imagePreview : getImagePath(imagePreview)}
              alt="preview"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">คลิกเพื่อเลือกรูปภาพ</span>
              <span className="text-xs">PNG, JPG, WebP · สูงสุด 10MB</span>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
        {imagePreview && (
          <button type="button" onClick={clearImage} className="mt-1.5 text-xs text-red-500 hover:text-red-700 transition-colors">
            ✕ ลบรูป
          </button>
        )}
      </div>

      {/* Alt text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          ข้อความ Alt <span className="text-gray-400 font-normal">(สำหรับ SEO)</span>
        </label>
        <input
          type="text"
          name="alt_text"
          value={formData.alt_text}
          onChange={handleChange}
          placeholder="เช่น: โปรโมชันพิเศษ ลดราคารถมือสอง"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
        />
      </div>

      {/* Link URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          ลิงก์เมื่อคลิก <span className="text-gray-400 font-normal">(ไม่บังคับ)</span>
        </label>
        <input
          type="text"
          name="link_url"
          value={formData.link_url}
          onChange={handleChange}
          placeholder="เช่น: /cars หรือ https://..."
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">ลำดับการแสดง</label>
          <input
            type="number"
            name="sort_order"
            value={formData.sort_order}
            onChange={handleChange}
            min="0"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">สถานะ</label>
          <select
            name="is_active"
            value={formData.is_active}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value={1}>เปิดใช้งาน</option>
            <option value={0}>ปิดใช้งาน</option>
          </select>
        </div>
      </div>

      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {uploading ? 'กำลังอัพโหลดรูป...' : loading ? 'กำลังบันทึก...' : isEdit ? 'บันทึกการแก้ไข' : 'เพิ่ม Banner'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}
