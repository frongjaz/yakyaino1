'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { apiPost, getApiUrl, getSessionToken } from '@/lib/api';
import { getSession } from '@/lib/auth-client';

export default function AddBlogForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    paragraph: '',
    content: '',
    image: '',
    author_name: '',
    author_image: '',
    author_designation: '',
    tags: '',
    publish_date: '',
    date_published: '',
    status: 'draft',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setSelectedFile(file);
    setMessage(null);

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormData({ ...formData, image: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImageToFTP = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    // Get session token for Authorization header
    const sessionToken = getSessionToken();

    if (!sessionToken) {
      throw new Error('ไม่พบ session กรุณาเข้าสู่ระบบใหม่');
    }

    const headers: HeadersInit = {};
    headers['Authorization'] = `Bearer ${sessionToken}`;

    const response = await fetch(getApiUrl('/api/upload'), {
      method: 'POST',
      headers,
      credentials: 'include', // Include cookies for same-domain
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ' }));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.success || !data.url) {
      throw new Error(data.message || 'ไม่ได้รับ URL รูปภาพ');
    }

    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    // Check session before submitting
    const session = getSession();
    
    if (!session) {
      setMessage({ type: 'error', text: 'กรุณาเข้าสู่ระบบใหม่' });
      setLoading(false);
      router.push('/admin/login');
      return;
    }

    try {
      // Upload image to FTP if file is selected
      let imageUrl = formData.image;
      
      if (selectedFile) {
        setUploading(true);
        try {
          imageUrl = await uploadImageToFTP(selectedFile);
          setFormData({ ...formData, image: imageUrl });
          setMessage({ type: 'success', text: 'อัพโหลดรูปภาพสำเร็จ กำลังบันทึกข้อมูล...' });
        } catch (uploadError: any) {
          setMessage({ type: 'error', text: uploadError.message || 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ' });
          setUploading(false);
          setLoading(false);
          return;
        } finally {
          setUploading(false);
        }
      }

      // Parse tags from comma-separated string
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      // Format date_published
      let datePublished = null;
      if (formData.date_published) {
        datePublished = new Date(formData.date_published).toISOString();
      } else if (formData.status === 'published') {
        datePublished = new Date().toISOString();
      }

      // Save blog data - Use apiPost which handles auth automatically
      const data = await apiPost('/api/blogs', {
        ...formData,
        image: imageUrl,
        tags: tagsArray,
        date_published: datePublished,
      });

      if (data.success) {
        setMessage({ type: 'success', text: 'เพิ่มบทความสำเร็จ!' });
        
        // Reset form
        setFormData({
          title: '',
          paragraph: '',
          content: '',
          image: '',
          author_name: '',
          author_image: '',
          author_designation: '',
          tags: '',
          publish_date: '',
          date_published: '',
          status: 'draft',
        });
        setImagePreview(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Refresh page after 2 seconds
        setTimeout(() => {
          router.refresh();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'เกิดข้อผิดพลาด' });
      }
    } catch (err: any) {
      console.error('Error:', err);
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
      setMessage({ type: 'error', text: errorMessage });
      
      // If authentication error, suggest re-login
      if (errorMessage.includes('สิทธิ์') || errorMessage.includes('401')) {
        setMessage({ 
          type: 'error', 
          text: 'ไม่มีสิทธิ์เข้าถึง กรุณาเข้าสู่ระบบใหม่' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`rounded-lg p-4 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          หัวข้อบทความ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="กรุณากรอกหัวข้อบทความ"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-dark dark:border-stroke-dark dark:text-white"
        />
      </div>

      {/* Paragraph (Summary) */}
      <div>
        <label htmlFor="paragraph" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          เนื้อหาย่อ <span className="text-red-500">*</span>
        </label>
        <textarea
          id="paragraph"
          name="paragraph"
          value={formData.paragraph}
          onChange={handleChange}
          required
          rows={4}
          placeholder="กรุณากรอกเนื้อหาย่อ"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-dark dark:border-stroke-dark dark:text-white"
        />
      </div>

      {/* Content (Full Content) */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          เนื้อหาเต็ม (ไม่บังคับ)
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={10}
          placeholder="กรุณากรอกเนื้อหาเต็ม"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-dark dark:border-stroke-dark dark:text-white"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          รูปภาพหลัก <span className="text-red-500">*</span>
        </label>
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
          />
          {imagePreview && (
            <div className="relative w-full max-w-md">
              <Image
                src={imagePreview}
                alt="Preview"
                width={400}
                height={250}
                className="rounded-md object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {formData.image && !imagePreview && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              รูปภาพปัจจุบัน: {formData.image}
            </div>
          )}
        </div>
      </div>

      {/* Author Name */}
      <div>
        <label htmlFor="author_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          ชื่อผู้เขียน <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="author_name"
          name="author_name"
          value={formData.author_name}
          onChange={handleChange}
          required
          placeholder="กรุณากรอกชื่อผู้เขียน"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-dark dark:border-stroke-dark dark:text-white"
        />
      </div>

      {/* Author Image URL */}
      <div>
        <label htmlFor="author_image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          URL รูปภาพผู้เขียน (ไม่บังคับ)
        </label>
        <input
          type="text"
          id="author_image"
          name="author_image"
          value={formData.author_image}
          onChange={handleChange}
          placeholder="กรุณากรอก URL รูปภาพผู้เขียน"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-dark dark:border-stroke-dark dark:text-white"
        />
      </div>

      {/* Author Designation */}
      <div>
        <label htmlFor="author_designation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          ตำแหน่งผู้เขียน (ไม่บังคับ)
        </label>
        <input
          type="text"
          id="author_designation"
          name="author_designation"
          value={formData.author_designation}
          onChange={handleChange}
          placeholder="กรุณากรอกตำแหน่งผู้เขียน"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-dark dark:border-stroke-dark dark:text-white"
        />
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          แท็ก (คั่นด้วยเครื่องหมายจุลภาค) (ไม่บังคับ)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="เช่น: market, SUV, ราคาตลาด"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-dark dark:border-stroke-dark dark:text-white"
        />
        <p className="mt-1 text-xs text-gray-500">ตัวอย่าง: market, SUV, ราคาตลาด</p>
      </div>

      {/* Publish Date */}
      <div>
        <label htmlFor="publish_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          วันที่เผยแพร่ (รูปแบบ: มี.ค. 2025) (ไม่บังคับ)
        </label>
        <input
          type="text"
          id="publish_date"
          name="publish_date"
          value={formData.publish_date}
          onChange={handleChange}
          placeholder="เช่น: มี.ค. 2025"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-dark dark:border-stroke-dark dark:text-white"
        />
      </div>

      {/* Date Published (ISO) */}
      <div>
        <label htmlFor="date_published" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          วันที่เผยแพร่ (ISO 8601) (ไม่บังคับ)
        </label>
        <input
          type="datetime-local"
          id="date_published"
          name="date_published"
          value={formData.date_published}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-dark dark:border-stroke-dark dark:text-white"
        />
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          สถานะ
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-dark dark:border-stroke-dark dark:text-white"
        >
          <option value="draft">Draft (ฉบับร่าง)</option>
          <option value="published">Published (เผยแพร่)</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex-1 bg-primary text-white py-3 px-6 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'กำลังอัพโหลดรูปภาพ...' : loading ? 'กำลังบันทึก...' : 'บันทึกบทความ'}
        </button>
      </div>
    </form>
  );
}

