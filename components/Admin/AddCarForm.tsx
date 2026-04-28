'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { apiPost, apiPut, getApiUrl } from '@/lib/api';

export interface CarFormData {
  id?: number;
  brand: string; model: string; year: number | string; price: number | string;
  image: string; image2?: string; image3?: string; image4?: string; image5?: string;
  description?: string; mileage?: number | string; color?: string;
  transmission?: string; fuel_type?: string; engine_size?: string;
  license_plate?: string; status: string;
}

interface Props { onSuccess?: () => void; onCancel?: () => void; initialData?: CarFormData }

export default function AddCarForm({ onSuccess, onCancel, initialData }: Props = {}) {
  const isEdit = !!initialData?.id;
  const router = useRouter();
  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([
    initialData?.image || null,
    initialData?.image2 || null,
    initialData?.image3 || null,
    initialData?.image4 || null,
    initialData?.image5 || null,
  ]);
  const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>([null, null, null, null, null]);

  const [formData, setFormData] = useState({
    brand: initialData?.brand || '',
    model: initialData?.model || '',
    year: initialData?.year?.toString() || '',
    price: initialData?.price?.toString() || '',
    image: initialData?.image || '',
    image2: initialData?.image2 || '',
    image3: initialData?.image3 || '',
    image4: initialData?.image4 || '',
    image5: initialData?.image5 || '',
    photo_count: '0',
    description: initialData?.description || '',
    mileage: initialData?.mileage?.toString() || '',
    color: initialData?.color || '',
    transmission: initialData?.transmission || '',
    fuel_type: initialData?.fuel_type || '',
    engine_size: initialData?.engine_size || '',
    license_plate: initialData?.license_plate || '',
    status: initialData?.status || 'available',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setMessage({ type: 'error', text: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น' }); return; }
    if (file.size > 10 * 1024 * 1024) { setMessage({ type: 'error', text: 'ขนาดไฟล์ไม่ควรเกิน 10MB' }); return; }
    const newFiles = [...selectedFiles]; newFiles[index] = file; setSelectedFiles(newFiles);
    setMessage(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...imagePreviews]; newPreviews[index] = reader.result as string; setImagePreviews(newPreviews);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = [...selectedFiles]; newFiles[index] = null; setSelectedFiles(newFiles);
    const newPreviews = [...imagePreviews]; newPreviews[index] = null; setImagePreviews(newPreviews);
    const fd = { ...formData };
    const keys = ['image', 'image2', 'image3', 'image4', 'image5'] as const;
    fd[keys[index]] = '';
    setFormData(fd);
    if (fileInputRefs[index].current) fileInputRefs[index].current!.value = '';
  };

  const uploadImageToFTP = async (file: File): Promise<string> => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    const sessionToken = localStorage.getItem('admin_session');
    const headers: HeadersInit = {};
    if (sessionToken) headers['Authorization'] = `Bearer ${encodeURIComponent(sessionToken)}`;
    const response = await fetch(getApiUrl('/api/upload'), { method: 'POST', body: uploadFormData, credentials: 'include', headers });
    if (!response.ok) {
      const errorText = await response.text();
      let errorData; try { errorData = JSON.parse(errorText); } catch { errorData = { message: `HTTP ${response.status}` }; }
      throw new Error(errorData.message || 'เกิดข้อผิดพลาดในการอัพโหลด');
    }
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ');
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMessage(null);
    try {
      const hasAnyImage = selectedFiles.some(f => f !== null) || imagePreviews.some(p => p !== null);
      if (!isEdit && !hasAnyImage) {
        setMessage({ type: 'error', text: 'กรุณาเลือกรูปภาพอย่างน้อย 1 รูป' }); setLoading(false); return;
      }

      // Upload only newly-selected files; keep existing URLs for unchanged slots
      const imageFields = ['image', 'image2', 'image3', 'image4', 'image5'];
      let updatedFormData = { ...formData };

      if (selectedFiles.some(f => f !== null)) {
        setUploading(true);
        const uploadPromises = selectedFiles.map((f, i) => f ? uploadImageToFTP(f).then(url => ({ index: i, url })) : null).filter(Boolean) as Promise<{ index: number; url: string }>[];
        try {
          const results = await Promise.all(uploadPromises);
          results.forEach(({ index, url }) => { updatedFormData[imageFields[index] as keyof typeof updatedFormData] = url; });
          setFormData(updatedFormData);
        } catch (uploadError: any) {
          setMessage({ type: 'error', text: uploadError.message || 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ' });
          setUploading(false); setLoading(false); return;
        } finally { setUploading(false); }
      }

      const payload = {
        ...updatedFormData,
        year: parseInt(updatedFormData.year),
        price: parseFloat(updatedFormData.price),
        photo_count: imagePreviews.filter(p => p !== null).length,
        mileage: updatedFormData.mileage ? parseInt(updatedFormData.mileage) : null,
      };

      const data = isEdit
        ? await apiPut(`/api/cars/${initialData!.id}`, payload)
        : await apiPost('/api/cars', payload);

      if (data.success) {
        setMessage({ type: 'success', text: isEdit ? 'อัพเดทรถสำเร็จ!' : 'เพิ่มข้อมูลรถสำเร็จ!' });
        if (!isEdit) {
          setFormData({ brand: '', model: '', year: '', price: '', image: '', image2: '', image3: '', image4: '', image5: '', photo_count: '0', description: '', mileage: '', color: '', transmission: '', fuel_type: '', engine_size: '', license_plate: '', status: 'available' });
          setImagePreviews([null, null, null, null, null]);
          setSelectedFiles([null, null, null, null, null]);
          fileInputRefs.forEach(ref => { if (ref.current) ref.current.value = ''; });
        }
        if (onSuccess) onSuccess(); else router.refresh();
      } else {
        setMessage({ type: 'error', text: data.message || 'เกิดข้อผิดพลาด' });
      }
    } catch {
      setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' });
    } finally { setLoading(false); }
  };

  const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";
  const labelCls = "mb-1.5 block text-sm font-medium text-gray-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`rounded-lg border px-4 py-3 text-sm font-medium flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            {message.type === 'success'
              ? <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              : <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            }
          </svg>
          {message.text}
        </div>
      )}

      {/* ── รูปภาพ ─────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
        <p className="text-sm font-semibold text-gray-700">📷 รูปภาพรถยนต์</p>

        {/* รูปหลัก */}
        {[0].map((index) => (
          <div key={index}>
            <p className="text-xs font-medium text-gray-500 mb-1.5">
              รูปหลัก <span className="text-red-500">*</span>
              {uploading && selectedFiles[index] && <span className="ml-2 text-primary animate-pulse">กำลังอัพโหลด...</span>}
            </p>
            <input ref={fileInputRefs[index]} type="file" accept="image/*" onChange={handleImageSelect(index)} disabled={uploading || loading} className="hidden" id={`img-${index}`} />
            <label htmlFor={`img-${index}`} className={`block cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-white hover:border-primary transition-colors ${uploading || loading ? 'opacity-50 pointer-events-none' : ''}`}>
              {imagePreviews[index] ? (
                <div className="relative h-44 w-full rounded-xl overflow-hidden">
                  <Image src={imagePreviews[index]!} alt="preview" fill className="object-contain" unoptimized />
                  <button type="button" onClick={(e) => { e.preventDefault(); handleRemoveImage(index); }} className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 shadow">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 py-8 text-gray-400">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  <span className="text-xs">คลิกเพื่ออัพโหลด</span>
                </div>
              )}
            </label>
          </div>
        ))}

        {/* รูปเพิ่มเติม 4 รูป */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((index) => (
            <div key={index}>
              <p className="text-xs text-gray-400 mb-1 text-center">รูป {index + 1}</p>
              <input ref={fileInputRefs[index]} type="file" accept="image/*" onChange={handleImageSelect(index)} disabled={uploading || loading} className="hidden" id={`img-${index}`} />
              <label htmlFor={`img-${index}`} className={`block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-white hover:border-primary transition-colors aspect-square ${uploading || loading ? 'opacity-50 pointer-events-none' : ''}`}>
                {imagePreviews[index] ? (
                  <div className="relative h-full w-full rounded-lg overflow-hidden">
                    <Image src={imagePreviews[index]!} alt="preview" fill className="object-cover" unoptimized />
                    <button type="button" onClick={(e) => { e.preventDefault(); handleRemoveImage(index); }} className="absolute top-1 right-1 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600 shadow">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-3 text-gray-300">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                  </div>
                )}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* ── ข้อมูลพื้นฐาน ──────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <p className="text-sm font-semibold text-gray-700">🚗 ข้อมูลพื้นฐาน</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>ยี่ห้อ <span className="text-red-500">*</span></label>
            <input type="text" name="brand" required value={formData.brand} onChange={handleChange} className={inputCls} placeholder="Toyota" />
          </div>
          <div>
            <label className={labelCls}>รุ่น <span className="text-red-500">*</span></label>
            <input type="text" name="model" required value={formData.model} onChange={handleChange} className={inputCls} placeholder="Camry" />
          </div>
          <div>
            <label className={labelCls}>ปี <span className="text-red-500">*</span></label>
            <input type="number" name="year" required value={formData.year} onChange={handleChange} min="1990" max="2099" className={inputCls} placeholder="2023" />
          </div>
          <div>
            <label className={labelCls}>ราคา (บาท) <span className="text-red-500">*</span></label>
            <input type="number" name="price" required value={formData.price} onChange={handleChange} min="0" step="1000" className={inputCls} placeholder="500000" />
          </div>
        </div>
      </div>

      {/* ── รายละเอียดเทคนิค ────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <p className="text-sm font-semibold text-gray-700">⚙️ รายละเอียดเทคนิค</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>ไมล์ (กม.)</label>
            <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} min="0" className={inputCls} placeholder="50000" />
          </div>
          <div>
            <label className={labelCls}>สี</label>
            <input type="text" name="color" value={formData.color} onChange={handleChange} className={inputCls} placeholder="ขาว" />
          </div>
          <div>
            <label className={labelCls}>เกียร์</label>
            <input type="text" name="transmission" value={formData.transmission} onChange={handleChange} className={inputCls} placeholder="ออโต้" />
          </div>
          <div>
            <label className={labelCls}>ประเภทเชื้อเพลิง</label>
            <input type="text" name="fuel_type" value={formData.fuel_type} onChange={handleChange} className={inputCls} placeholder="เบนซิน" />
          </div>
          <div>
            <label className={labelCls}>ขนาดเครื่องยนต์</label>
            <input type="text" name="engine_size" value={formData.engine_size} onChange={handleChange} className={inputCls} placeholder="2.0" />
          </div>
          <div>
            <label className={labelCls}>ทะเบียน</label>
            <input type="text" name="license_plate" value={formData.license_plate} onChange={handleChange} className={inputCls} placeholder="กก 1234" />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>สถานะ</label>
            <select name="status" value={formData.status} onChange={handleChange} className={inputCls}>
              <option value="available">พร้อมขาย</option>
              <option value="sold">ขายแล้ว</option>
              <option value="pending">รอดำเนินการ</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── คำอธิบาย ──────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <p className="text-sm font-semibold text-gray-700">📝 คำอธิบายเพิ่มเติม</p>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} placeholder="รายละเอียดเพิ่มเติม..." />
      </div>

      {/* ── Submit ─────────────────────────────────────────────────────────── */}
      <div className="flex gap-3">
      {onCancel && (
        <button type="button" onClick={onCancel}
          className="flex-1 rounded-xl border border-gray-200 bg-gray-50 py-3.5 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all"
        >ยกเลิก</button>
      )}
      <button type="submit" disabled={loading || uploading}
        className="flex-[2] rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {(uploading || loading) ? (
          <><svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>{uploading ? 'กำลังอัพโหลดรูป...' : 'กำลังบันทึก...'}</>
        ) : (
          <><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{isEdit ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูลรถยนต์'}</>
        )}
      </button>
      </div>
    </form>
  );
}
