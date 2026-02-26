'use client';

import Image from 'next/image';
import { getImagePath, IMAGE_PLACEHOLDER } from '@/lib/utils';
import { BlogData } from './AddBlogForm';

interface BlogCardProps {
    blog: any; // Using any for flexibility with transformed data
    onEdit: (blog: any) => void;
    onDelete: (id: number) => void;
}

export default function BlogCard({ blog, onEdit, onDelete }: BlogCardProps) {
    const isPublished = blog.status === 'published';
    const formattedDate = new Date(blog.createdAt).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <div className="bg-white dark:bg-dark border border-stroke dark:border-stroke-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
            {/* Image Section */}
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={getImagePath(blog.image || '/images/blog/blog-01.jpg')}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { const t = e.target as HTMLImageElement; if (t && t.src !== IMAGE_PLACEHOLDER) t.src = IMAGE_PLACEHOLDER; }}
                />
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm ${isPublished
                            ? 'bg-green-500 text-white'
                            : 'bg-yellow-400 text-black'
                        }`}>
                        {isPublished ? 'Published' : 'Draft'}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-medium text-body-color dark:text-body-color-dark bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                        ID: {blog.id}
                    </span>
                    <span className="text-[11px] font-medium text-body-color dark:text-body-color-dark">
                        {formattedDate}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-dark dark:text-white mb-2 line-clamp-2 leading-tight min-h-[3rem]">
                    {blog.title}
                </h3>

                <p className="text-sm text-body-color dark:text-body-color-dark mb-4 line-clamp-2 leading-relaxed">
                    {blog.paragraph}
                </p>

                {/* Author Section */}
                <div className="flex items-center gap-3 mb-5 border-t border-gray-100 dark:border-stroke-dark pt-4">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                        {blog.author?.image ? (
                            <Image src={getImagePath(blog.author.image)} alt={blog.author.name} fill className="object-cover" onError={(e) => { const t = e.target as HTMLImageElement; if (t && t.src !== IMAGE_PLACEHOLDER) t.src = IMAGE_PLACEHOLDER; }} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary text-white text-[10px] font-bold">
                                {blog.author?.name?.charAt(0) || 'A'}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-dark dark:text-white truncate">
                            {blog.author?.name || 'Unknown Author'}
                        </p>
                        <p className="text-[10px] text-body-color dark:text-body-color-dark truncate">
                            {blog.author?.designation || 'Author'}
                        </p>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(blog)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-dark dark:text-white text-xs font-bold hover:bg-primary hover:text-white transition-all border border-gray-200 dark:border-stroke-dark group-hover:border-primary"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        แก้ไข
                    </button>
                    <button
                        onClick={() => onDelete(blog.id)}
                        className="flex-none w-10 h-10 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100 dark:border-red-900/20"
                        title="ลบ"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
