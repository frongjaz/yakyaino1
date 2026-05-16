'use client';

import Link from 'next/link';

export default function BlogDetailError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-4 text-2xl font-bold text-dark dark:text-white">ไม่สามารถโหลดบทความนี้ได้</h2>
      <p className="mb-6 text-body-color dark:text-body-color-dark">{error.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'}</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90"
        >
          ลองใหม่อีกครั้ง
        </button>
        <Link
          href="/blog"
          className="rounded-lg border border-primary px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/10"
        >
          ดูบทความทั้งหมด
        </Link>
      </div>
    </div>
  );
}
