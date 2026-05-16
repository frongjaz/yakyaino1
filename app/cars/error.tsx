'use client';

export default function CarsError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-4 text-2xl font-bold text-dark dark:text-white">ไม่สามารถโหลดข้อมูลรถได้</h2>
      <p className="mb-6 text-body-color dark:text-body-color-dark">{error.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90"
      >
        ลองใหม่อีกครั้ง
      </button>
    </div>
  );
}
