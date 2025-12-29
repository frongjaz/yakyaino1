'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { apiPost, getApiUrl } from '@/lib/api';

export default function AddCarForm() {
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
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([null, null, null, null, null]);
  const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>([null, null, null, null, null]);
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    image: '',
    image2: '',
    image3: '',
    image4: '',
    image5: '',
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

  const handleImageSelect = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Store file for later upload
    const newFiles = [...selectedFiles];
    newFiles[index] = file;
    setSelectedFiles(newFiles);
    setMessage(null);

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const newPreviews = [...imagePreviews];
      newPreviews[index] = base64String;
      setImagePreviews(newPreviews);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles[index] = null;
    setSelectedFiles(newFiles);
    
    const newPreviews = [...imagePreviews];
    newPreviews[index] = null;
    setImagePreviews(newPreviews);
    
    const newFormData = { ...formData };
    if (index === 0) newFormData.image = '';
    else if (index === 1) newFormData.image2 = '';
    else if (index === 2) newFormData.image3 = '';
    else if (index === 3) newFormData.image4 = '';
    else if (index === 4) newFormData.image5 = '';
    setFormData(newFormData);
    
    if (fileInputRefs[index].current) {
      fileInputRefs[index].current!.value = '';
    }
  };

  const uploadImageToFTP = async (file: File): Promise<string> => {
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

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
      throw new Error(errorData.message || errorData.error || 'เกิดข้อผิดพลาดในการอัพโหลด');
    }

    const data = await response.json();

    if (!data.success) {
      const errorMsg = data.error 
        ? `${data.message || 'เกิดข้อผิดพลาด'}: ${data.error}`
        : data.message || 'เกิดข้อผิดพลาดในการอัพโหลด';
      throw new Error(errorMsg);
    }

    return data.url;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Validate that we have at least one file selected
      const hasFile = selectedFiles.some(file => file !== null);
      if (!hasFile) {
        setMessage({ type: 'error', text: 'กรุณาเลือกรูปภาพอย่างน้อย 1 รูป' });
        setLoading(false);
        return;
      }

      // Upload all images to FTP
      setUploading(true);
      const imageFields = ['image', 'image2', 'image3', 'image4', 'image5'];
      const uploadPromises: Promise<{ index: number; url: string }>[] = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        if (selectedFiles[i]) {
          uploadPromises.push(
            uploadImageToFTP(selectedFiles[i]!).then(url => ({ index: i, url }))
          );
        }
      }

      let updatedFormData = { ...formData };
      
      try {
        const uploadResults = await Promise.all(uploadPromises);
        
        // Update formData with uploaded URLs
        uploadResults.forEach(({ index, url }) => {
          updatedFormData[imageFields[index] as keyof typeof updatedFormData] = url;
        });
        setFormData(updatedFormData);
        
        setMessage({ type: 'success', text: `อัพโหลดรูปภาพสำเร็จ (${uploadResults.length} รูป) กำลังบันทึกข้อมูล...` });
      } catch (uploadError: any) {
        setMessage({ type: 'error', text: uploadError.message || 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ' });
        setUploading(false);
        setLoading(false);
        return;
      } finally {
        setUploading(false);
      }

      // Save car data
      const data = await apiPost('/api/cars', {
        ...updatedFormData,
        year: parseInt(updatedFormData.year),
        price: parseFloat(updatedFormData.price),
        photo_count: parseInt(updatedFormData.photo_count) || selectedFiles.filter(f => f !== null).length,
        mileage: updatedFormData.mileage ? parseInt(updatedFormData.mileage) : null,
      });

      if (data.success) {
        setMessage({ type: 'success', text: 'เพิ่มข้อมูลรถสำเร็จ!' });
        setFormData({
          brand: '',
          model: '',
          year: '',
          price: '',
          image: '',
          image2: '',
          image3: '',
          image4: '',
          image5: '',
          photo_count: '0',
          description: '',
          mileage: '',
          color: '',
          transmission: '',
          fuel_type: '',
          engine_size: '',
          status: 'available',
        });
        setImagePreviews([null, null, null, null, null]);
        setSelectedFiles([null, null, null, null, null]);
        fileInputRefs.forEach(ref => {
          if (ref.current) ref.current.value = '';
        });
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
          {/* Image Upload Fields */}
          {[0, 1, 2, 3, 4].map((index) => (
            <div key={index}>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                รูปภาพ {index === 0 ? 'หลัก' : index + 1} {index === 0 && <span className="text-red-500">*</span>}
                {uploading && selectedFiles[index] && (
                  <span className="ml-2 text-xs text-primary">กำลังอัพโหลด...</span>
                )}
              </label>
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRefs[index]}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect(index)}
                  disabled={uploading || loading}
                  className="hidden"
                  id={`image-upload-${index}`}
                />
                <label
                  htmlFor={`image-upload-${index}`}
                  className={`flex-1 cursor-pointer rounded-lg border-2 border-dashed border-stroke dark:border-stroke-dark bg-gray-50 dark:bg-gray-800/50 p-4 text-center hover:border-primary transition-colors ${
                    uploading || loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {imagePreviews[index] ? (
                      <div className="relative w-full h-32 rounded overflow-hidden border border-stroke dark:border-stroke-dark">
                        <Image
                          src={imagePreviews[index]!}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveImage(index);
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <svg
                            className="h-4 w-4"
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
                        {selectedFiles[index] && (
                          <div className="absolute bottom-1 left-1 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                            รออัพโหลด
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <svg
                          className="h-8 w-8 text-body-color dark:text-body-color-dark"
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
                        <p className="text-xs text-body-color dark:text-body-color-dark">
                          คลิกเพื่ออัพโหลด
                        </p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>
          ))}
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
              placeholder="กรุณากรอกยี่ห้อ"
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
              placeholder="กรุณากรอกรุ่น"
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
              placeholder="กรุณากรอกปี"
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
              placeholder="กรุณากรอกราคา"
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
              placeholder="กรุณากรอกไมล์"
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
              placeholder="กรุณากรอกสี"
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
              placeholder="กรุณากรอกเกียร์"
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
              placeholder="กรุณากรอกประเภทเชื้อเพลิง"
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
              placeholder="กรุณากรอกขนาดเครื่องยนต์"
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
            placeholder="กรุณากรอกคำอธิบาย"
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
          {uploading ? (
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
              กำลังอัพโหลดรูปภาพ...
            </>
          ) : loading ? (
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
              กำลังบันทึกข้อมูล...
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
