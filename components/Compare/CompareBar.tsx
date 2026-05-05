'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  getCompareCars,
  removeFromCompare,
  clearCompare,
  COMPARE_EVENT,
  MAX_COMPARE,
  CompareCarItem,
} from '@/lib/compareStore';
import { getImagePath, IMAGE_PLACEHOLDER } from '@/lib/utils';
import { encodeCarId } from '@/lib/id-encoder';

export default function CompareBar() {
  const [cars, setCars] = useState<CompareCarItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    setCars(getCompareCars());
    const handleUpdate = () => setCars(getCompareCars());
    window.addEventListener(COMPARE_EVENT, handleUpdate);
    return () => window.removeEventListener(COMPARE_EVENT, handleUpdate);
  }, []);

  if (cars.length === 0) return null;

  const handleCompare = () => {
    const ids = cars.map((c) => encodeCarId(c.id)).join(',');
    router.push(`/compare?ids=${ids}`);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-[#111111] border-t-2 border-[#EF4444] shadow-2xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
          <span className="hidden sm:block text-white/50 text-xs font-medium uppercase tracking-wider shrink-0">
            เปรียบเทียบรถ ({cars.length}/{MAX_COMPARE})
          </span>

          <div className="flex items-center gap-3 flex-1 min-w-0 overflow-x-auto">
            {cars.map((car) => (
              <div
                key={car.id}
                className="relative flex items-center gap-2 bg-[#242424] rounded-lg px-3 py-2 shrink-0 border border-white/10"
              >
                <div className="relative w-12 h-8 rounded overflow-hidden shrink-0 bg-[#333]">
                  <Image
                    src={getImagePath(car.image)}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const t = e.target as HTMLImageElement;
                      if (t.src !== IMAGE_PLACEHOLDER) t.src = IMAGE_PLACEHOLDER;
                    }}
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-white/90 truncate max-w-[80px] font-medium">
                    {car.brand} {car.model}
                  </p>
                  <p className="text-[10px] text-[#EF4444] font-semibold">{car.year}</p>
                </div>
                <button
                  onClick={() => removeFromCompare(car.id)}
                  className="ml-1 text-white/30 hover:text-white transition-colors"
                  aria-label="ลบออก"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {Array.from({ length: MAX_COMPARE - cars.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center justify-center w-28 h-[52px] border border-dashed border-white/15 rounded-lg shrink-0"
              >
                <span className="text-white/25 text-xs">+ เพิ่มรถ</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clearCompare}
              className="text-white/40 hover:text-white text-sm transition-colors px-3 py-2"
            >
              ล้าง
            </button>
            <button
              onClick={handleCompare}
              disabled={cars.length < 2}
              className="px-5 py-2.5 bg-[#EF4444] text-white font-bold rounded-lg hover:bg-[#DC2626] transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm whitespace-nowrap shadow-lg shadow-red-900/30"
            >
              เปรียบเทียบ {cars.length} คัน →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
