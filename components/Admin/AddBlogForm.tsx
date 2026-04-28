'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { apiPost, getApiUrl, getSessionToken } from '@/lib/api';
import { getSession } from '@/lib/auth-client';

export interface BlogData {
  id?: number;
  title: string;
  paragraph: string;
  content?: string;
  image: string;
  author_name?: string;
  author_image?: string;
  author_designation?: string;
  author?: {
    name: string;
    image: string;
    designation: string;
  };
  tags?: string | string[];
  publish_date?: string;
  publishDate?: string;
  date_published?: string;
  datePublished?: string;
  status: string;
}

interface AddBlogFormProps {
  initialData?: BlogData | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddBlogForm({ initialData, onSuccess, onCancel }: AddBlogFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    paragraph: initialData?.paragraph || '',
    content: initialData?.content || '',
    image: initialData?.image || '',
    author_name: initialData?.author_name || initialData?.author?.name || '',
    author_image: initialData?.author_image || initialData?.author?.image || '',
    author_designation: initialData?.author_designation || initialData?.author?.designation || '',
    tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : (initialData?.tags || ''),
    publish_date: initialData?.publish_date || initialData?.publishDate || '',
    date_published: initialData?.date_published || (initialData?.datePublished ? initialData.datePublished.substring(0, 16) : ''),
    status: initialData?.status || 'draft',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        paragraph: initialData.paragraph || '',
        content: initialData.content || '',
        image: initialData.image || '',
        author_name: initialData.author_name || initialData.author?.name || '',
        author_image: initialData.author_image || initialData.author?.image || '',
        author_designation: initialData.author_designation || initialData.author?.designation || '',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : (initialData.tags || ''),
        publish_date: initialData.publish_date || initialData.publishDate || '',
        date_published: initialData.date_published || (initialData.datePublished ? initialData.datePublished.substring(0, 16) : ''),
        status: initialData.status || 'draft',
      });
      setImagePreview(initialData.image || null);
    }
  }, [initialData]);

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
      } else if (formData.status === 'published' && !initialData) {
        datePublished = new Date().toISOString();
      }

      const payload = {
        ...formData,
        image: imageUrl,
        tags: tagsArray,
        date_published: datePublished,
      };

      // Save blog data
      let response;
      if (initialData?.id) {
        // Use PUT for updating
        const { apiPut } = await import('@/lib/api');
        response = await apiPut(`/api/blogs/${initialData.id}`, payload);
      } else {
        // Use apiPost for new entries
        response = await apiPost('/api/blogs', payload);
      }

      if (response.success) {
        setMessage({ type: 'success', text: initialData ? 'อัปเดตบทความสำเร็จ!' : 'เพิ่มบทความสำเร็จ!' });

        if (!initialData) {
          // Reset form only if adding new
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
        }

        // Callback if provided
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        } else {
          // Default behavior
          setTimeout(() => {
            router.refresh();
          }, 2000);
        }
      } else {
        setMessage({ type: 'error', text: response.message || 'เกิดข้อผิดพลาด' });
      }
    } catch (err: any) {
      console.error('Error:', err);
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
      setMessage({ type: 'error', text: errorMessage });

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
          className={`rounded-lg p-4 ${message.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200 shadow-sm'
            : 'bg-red-50 text-red-800 border border-red-200 shadow-sm'
            }`}
        >
          {message.text}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-dark dark:text-white mb-2">
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:bg-dark dark:border-stroke-dark dark:text-white transition-all shadow-sm"
        />
      </div>

      {/* Paragraph (Summary) */}
      <div>
        <label htmlFor="paragraph" className="block text-sm font-semibold text-dark dark:text-white mb-2">
          เนื้อหาย่อ (แสดงในหน้ารวมบทความ) <span className="text-red-500">*</span>
        </label>
        <textarea
          id="paragraph"
          name="paragraph"
          value={formData.paragraph}
          onChange={handleChange}
          required
          rows={3}
          placeholder="กรุณากรอกเนื้อหาย่อ"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:bg-dark dark:border-stroke-dark dark:text-white transition-all shadow-sm"
        />
      </div>

      {/* Content (Full Content) */}
      <div>
        <label htmlFor="content" className="block text-sm font-semibold text-dark dark:text-white mb-2">
          เนื้อหาเต็ม (รองรับ HTML)
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={8}
          placeholder="กรุณากรอกเนื้อหาเต็ม"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:bg-dark dark:border-stroke-dark dark:text-white transition-all shadow-sm"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-semibold text-dark dark:text-white mb-2">
          รูปภาพหน้าปก <span className="text-red-500">*</span>
        </label>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-dark dark:text-white rounded-lg border border-gray-300 dark:border-stroke-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {formData.image ? 'เปลี่ยนรูปภาพ' : 'เลือกรูปภาพ'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            {uploading && <span className="text-sm text-primary animate-pulse">กำลังอัพโหลด...</span>}
          </div>

          {imagePreview && (
            <div className="relative inline-block mt-2">
              <div className="relative h-48 w-80 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-stroke-dark">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-lg"
                title="ลบรูปภาพ"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Author Info */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">ข้อมูลผู้เขียน</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="author_name" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              ชื่อผู้เขียน <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="author_name"
              name="author_name"
              value={formData.author_name}
              onChange={handleChange}
              required
              placeholder="กรอกชื่อผู้เขียน"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:bg-dark dark:border-stroke-dark dark:text-white transition-all"
            />
          </div>
          <div>
            <label htmlFor="author_designation" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              ตำแหน่งผู้เขียน
            </label>
            <input
              type="text"
              id="author_designation"
              name="author_designation"
              value={formData.author_designation}
              onChange={handleChange}
              placeholder="เช่น: บรรณาธิการ"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:bg-dark dark:border-stroke-dark dark:text-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Publishing Info */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">ข้อมูลการเผยแพร่</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="publish_date" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              วันที่แสดงผล (เช่น: ก.พ. 2025)
            </label>
            <input
              type="text"
              id="publish_date"
              name="publish_date"
              value={formData.publish_date}
              onChange={handleChange}
              placeholder="ระบุวันที่ต้องการให้แสดง"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:bg-dark dark:border-stroke-dark dark:text-white transition-all"
            />
          </div>
          <div>
            <label htmlFor="date_published" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              วันที่เผยแพร่ (ระบุเพื่อจัดลำดับ)
            </label>
            <input
              type="datetime-local"
              id="date_published"
              name="date_published"
              value={formData.date_published}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:bg-dark dark:border-stroke-dark dark:text-white transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tags" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              แท็ก (คั่นด้วยเครื่องหมายจุลภาค)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="SUV, EV, ตลาดรถ"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:bg-dark dark:border-stroke-dark dark:text-white transition-all"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              สถานะบทความ
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:bg-dark dark:border-stroke-dark dark:text-white transition-all"
            >
              <option value="draft">Draft (ฉบับร่าง)</option>
              <option value="published">Published (เผยแพร่)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100 dark:border-stroke-dark">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3.5 px-6 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-stroke-dark"
          >
            ยกเลิก
          </button>
        )}
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex-[2] py-3.5 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              กำลังบันทึก...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              {initialData ? 'อัปเดตบทความ' : 'เผยแพร่บทความ'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
