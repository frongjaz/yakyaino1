'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { apiPost, getApiUrl } from '@/lib/api';

export default function AddCarForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    image: '',
    photo_count: '0',
    description: '',
    mileage: '',
    color: '',
    transmission: '',
    fuel_type: '',
    engine_size: '',
    status: 'available',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น' });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'ขนาดไฟล์ไม่ควรเกิน 10MB' });
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);

    // Upload to FTP
    setUploading(true);
    setMessage(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const uploadUrl = getApiUrl('/api/upload');
      const sessionToken = localStorage.getItem('admin_session');
      
      const headers: HeadersInit = {};
      if (sessionToken) {
        headers['Authorization'] = `Bearer ${encodeURIComponent(sessionToken)}`;
      }

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: uploadFormData,
        credentials: 'include',
        headers,
      });

      const data = await response.json();

      if (data.success) {
        // Use functional update to avoid stale closure
        setFormData((prev) => ({ ...prev, image: data.url }));
        setMessage({ type: 'success', text: 'อัพโหลดรูปภาพสำเร็จ' });
      } else {
        setMessage({ type: 'error', text: data.message || 'เกิดข้อผิดพลาดในการอัพโหลด' });
        setImagePreview(null);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการอัพโหลด' });
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, image: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const data = await apiPost('/api/cars', {
        ...formData,
        year: parseInt(formData.year),
        price: parseFloat(formData.price),
        photo_count: parseInt(formData.photo_count) || 0,
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        image: formData.image, // Use URL from FTP upload
      });

      if (data.success) {
        setMessage({ type: 'success', text: 'เพิ่มข้อมูลรถสำเร็จ!' });
        setFormData({
          brand: '',
          model: '',
          year: '',
          price: '',
          image: '',
          photo_count: '0',
          description: '',
          mileage: '',
          color: '',
          transmission: '',
          fuel_type: '',
          engine_size: '',
          status: 'available',
        });
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        router.refresh();
      } else {
        setMessage({ type: 'error', text: data.message || 'เกิดข้อผิดพลาด' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Success/Error Message */}
      {message && (
        <div
          className={`rounded-lg border p-4 ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}
        >
          <div className="flex items-center">
            {message.type === 'success' ? (
              <svg
                className="mr-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="mr-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        </div>
      )}

      {/* Image Upload Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stroke dark:border-stroke-dark">
          <svg
            className="h-5 w-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            รูปภาพรถยนต์
          </h3>
        </div>

        <div className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              อัพโหลดรูปภาพ <span className="text-red-500">*</span>
              {uploading && (
                <span className="ml-2 text-xs text-primary">กำลังอัพโหลด...</span>
              )}
            </label>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`flex-1 cursor-pointer rounded-lg border-2 border-dashed border-stroke dark:border-stroke-dark bg-gray-50 dark:bg-gray-800/50 p-6 text-center hover:border-primary transition-colors ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  {uploading ? (
                    <svg
                      className="h-10 w-10 text-primary animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="h-10 w-10 text-body-color dark:text-body-color-dark"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  )}
                  <p className="text-sm text-body-color dark:text-body-color-dark">
                    <span className="font-semibold text-primary">คลิกเพื่ออัพโหลด</span> หรือลากไฟล์มาวาง
                  </p>
                  <p className="text-xs text-body-color dark:text-body-color-dark">
                    PNG, JPG, GIF สูงสุด 10MB
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative">
              <div className="relative h-64 w-full rounded-lg overflow-hidden border border-stroke dark:border-stroke-dark bg-gray-100 dark:bg-gray-800">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Or use URL */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stroke dark:border-stroke-dark"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-dark text-body-color dark:text-body-color-dark">
                หรือ
              </span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              URL รูปภาพ
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg
                  className="h-5 w-5 text-body-color dark:text-body-color-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                disabled={!!imageBase64}
                className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-lg border bg-[#f8f8f8] pl-10 pr-4 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary focus:bg-white dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="/images/hero/main1.png หรือ https://example.com/image.jpg"
              />
            </div>
            {!imageBase64 && formData.image && (
              <div className="mt-3 relative h-32 w-full rounded-lg overflow-hidden border border-stroke dark:border-stroke-dark">
                <Image
                  src={formData.image}
                  alt="Preview"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                  unoptimized
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Basic Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stroke dark:border-stroke-dark">
          <svg
            className="h-5 w-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            ข้อมูลพื้นฐาน
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              ยี่ห้อ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="brand"
              required
              value={formData.brand}
              onChange={handleChange}
              className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-lg border bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary focus:bg-white dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
              placeholder="เช่น TOYOTA, HONDA"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              รุ่น <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="model"
              required
              value={formData.model}
              onChange={handleChange}
              className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-lg border bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary focus:bg-white dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
              placeholder="เช่น Corolla Altis"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              ปี <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="year"
              required
              value={formData.year}
              onChange={handleChange}
              min="1900"
              max="2099"
              className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-lg border bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary focus:bg-white dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
              placeholder="2023"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              ราคา (บาท) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              required
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="1000"
              className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-lg border bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary focus:bg-white dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
              placeholder="699000"
            />
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stroke dark:border-stroke-dark">
          <svg
            className="h-5 w-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            รายละเอียดเทคนิค
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              ไมล์ (กม.)
            </label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              min="0"
              className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-lg border bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary focus:bg-white dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
              placeholder="50000"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              สี
            </label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-lg border bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary focus:bg-white dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
              placeholder="ดำ, แดง, ขาว"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              เกียร์
            </label>
            <input
              type="text"
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-lg border bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary focus:bg-white dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
              placeholder="AT, MT"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              ประเภทเชื้อเพลิง
            </label>
            <input
              type="text"
              name="fuel_type"
              value={formData.fuel_type}
              onChange={handleChange}
              className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-lg border bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary focus:bg-white dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
              placeholder="เบนซิน, ดีเซล"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              ขนาดเครื่องยนต์
            </label>
            <input
              type="text"
              name="engine_size"
              value={formData.engine_size}
              onChange={handleChange}
              className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-lg border bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary focus:bg-white dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
              placeholder="2000 CC"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              สถานะ
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-lg border bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary focus:bg-white dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
            >
              <option value="available">พร้อมขาย</option>
              <option value="sold">ขายแล้ว</option>
              <option value="pending">รอดำเนินการ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stroke dark:border-stroke-dark">
          <svg
            className="h-5 w-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            คำอธิบายเพิ่มเติม
          </h3>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
            คำอธิบาย
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-lg border bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary focus:bg-white dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none resize-none"
            placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับรถ..."
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-stroke dark:border-stroke-dark">
        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full flex items-center justify-center rounded-lg bg-primary px-6 py-4 text-base font-semibold text-white shadow-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
        >
          {loading ? (
            <>
              <svg
                className="mr-2 h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              กำลังบันทึก...
            </>
          ) : (
            <>
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              บันทึกข้อมูลรถยนต์
            </>
          )}
        </button>
      </div>
    </form>
  );
}
