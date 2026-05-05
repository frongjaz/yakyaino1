'use client';

import { useEffect, useState, Suspense, Fragment } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { decodeCarId, encodeCarId } from '@/lib/id-encoder';
import { getImagePath, IMAGE_PLACEHOLDER } from '@/lib/utils';

interface CarData {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  image2?: string | null;
  mileage?: number | null;
  color?: string | null;
  transmission?: string | null;
  fuel_type?: string | null;
  engine_size?: string | null;
  license_plate?: string | null;
  description?: string;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('th-TH').format(price) + ' ฿';

const formatMileage = (mileage: number | null | undefined) =>
  mileage ? new Intl.NumberFormat('th-TH').format(mileage) + ' กม.' : 'N/A';

const specRows: {
  key: keyof CarData;
  label: string;
  format: (v: any) => string;
  highlight?: 'lower' | 'higher';
}[] = [
  { key: 'year', label: 'ปีรถ', format: (v) => String(v ?? 'N/A') },
  { key: 'price', label: 'ราคา (บาท)', format: (v) => formatPrice(Number(v)), highlight: 'lower' },
  { key: 'mileage', label: 'เลขไมล์', format: (v) => formatMileage(v), highlight: 'lower' },
  { key: 'fuel_type', label: 'เชื้อเพลิง', format: (v) => v || 'N/A' },
  { key: 'transmission', label: 'เกียร์', format: (v) => v || 'N/A' },
  { key: 'engine_size', label: 'เครื่องยนต์', format: (v) => v || 'N/A' },
  { key: 'color', label: 'สี', format: (v) => v || 'N/A' },
  { key: 'license_plate', label: 'ทะเบียน', format: (v) => v || '-' },
];

function getMin(cars: CarData[], key: keyof CarData): number | null {
  const vals = cars.map((c) => Number(c[key])).filter((v) => !isNaN(v) && v > 0);
  return vals.length >= 2 ? Math.min(...vals) : null;
}

function getMax(cars: CarData[], key: keyof CarData): number | null {
  const vals = cars.map((c) => Number(c[key])).filter((v) => !isNaN(v) && v > 0);
  return vals.length >= 2 ? Math.max(...vals) : null;
}

function CompareContent() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<(CarData | null)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const idsParam = searchParams.get('ids');
    if (!idsParam) {
      setLoading(false);
      return;
    }

    const encodedIds = idsParam.split(',').filter(Boolean).slice(0, 3);
    const decodedIds = encodedIds.map((eid) => decodeCarId(eid) || eid);

    const fetchAll = async () => {
      const results = await Promise.all(
        decodedIds.map(async (id) => {
          try {
            const encoded = encodeCarId(id);
            const data = await apiGet<{ success: boolean; data: CarData }>(`/api/cars/${encoded}`);
            return data.success ? data.data : null;
          } catch {
            return null;
          }
        }),
      );
      setCars(results);
      setLoading(false);
    };

    fetchAll();
  }, [searchParams]);

  const validCars = cars.filter((c): c is CarData => c !== null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EF4444] mx-auto mb-4" />
          <p className="text-white/60">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (validCars.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-6xl mb-6">🚗</div>
          <h2 className="text-white text-xl font-bold mb-3">ยังไม่ได้เลือกรถเปรียบเทียบ</h2>
          <p className="text-white/50 mb-6 text-sm">กดปุ่ม &ldquo;+ เพิ่มเปรียบเทียบ&rdquo; ในหน้ารายการรถ เพื่อเลือกรถที่ต้องการ</p>
          <Link
            href="/cars"
            className="inline-block px-8 py-3 bg-[#EF4444] text-white rounded-xl hover:bg-[#DC2626] transition font-bold"
          >
            เลือกรถเปรียบเทียบ →
          </Link>
        </div>
      </div>
    );
  }

  const colClass = validCars.length === 2 ? 'grid-cols-2' : 'grid-cols-3';
  const tableColClass =
    validCars.length === 2 ? 'grid-cols-[160px_1fr_1fr]' : 'grid-cols-[160px_1fr_1fr_1fr]';

  const minPrice = getMin(validCars, 'price');
  const maxPrice = getMax(validCars, 'price');
  const minMileage = getMin(validCars, 'mileage');
  const maxMileage = getMax(validCars, 'mileage');

  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-24">
      {/* Hero */}
      <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] pt-24 pb-8 border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="mb-3 flex items-center gap-2 text-sm text-white/40">
            <Link href="/" className="hover:text-white/70 transition-colors">
              หน้าแรก
            </Link>
            <span>/</span>
            <Link href="/cars" className="hover:text-white/70 transition-colors">
              รถทั้งหมด
            </Link>
            <span>/</span>
            <span className="text-white/70">เปรียบเทียบรถ</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            เปรียบเทียบรถยนต์
          </h1>
          <p className="text-white/50">
            เทียบสเปคและราคา {validCars.length} คันแบบเคียงข้างกัน
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {/* Car header cards */}
        <div className={`grid ${colClass} gap-4 mb-8`}>
          {validCars.map((car) => {
            const mainImage = car.image2 || car.image;
            return (
              <div
                key={car.id}
                className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5"
              >
                <div className="relative w-full bg-[#111]" style={{ paddingBottom: '66.66%' }}>
                  <Image
                    src={getImagePath(car.image)}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const t = e.target as HTMLImageElement;
                      if (t.src !== IMAGE_PLACEHOLDER) t.src = IMAGE_PLACEHOLDER;
                    }}
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#EF4444] mb-1">
                    {car.brand}
                  </p>
                  <h2 className="text-white font-bold text-lg leading-tight">
                    {car.model}
                  </h2>
                  <p className="text-white/40 text-sm mt-0.5">{car.year}</p>
                  <p className="text-[#EF4444] font-bold text-2xl mt-2">
                    {new Intl.NumberFormat('th-TH').format(car.price)}
                    <span className="text-sm font-normal text-white/50 ml-1">บาท</span>
                  </p>
                  <Link
                    href={`/cars/${encodeCarId(car.id)}`}
                    className="mt-3 flex items-center justify-center py-2.5 text-sm bg-[#EF4444] text-white rounded-xl hover:bg-[#DC2626] transition font-bold w-full"
                  >
                    ดูรายละเอียด →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Specs table */}
        <div className="overflow-x-auto rounded-2xl border border-white/5">
          <div className={`grid ${tableColClass} min-w-[480px]`}>
            {/* Header row */}
            <div className="bg-[#1a1a1a] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/40 border-b border-white/5">
              สเปค
            </div>
            {validCars.map((car) => (
              <div
                key={car.id}
                className="bg-[#1a1a1a] px-4 py-3 text-sm font-bold text-white border-b border-l border-white/5"
              >
                {car.brand} {car.model}
              </div>
            ))}

            {/* Spec rows */}
            {specRows.map((row, i) => {
              const rowBg = i % 2 === 0 ? 'bg-[#181818]' : 'bg-[#141414]';
              return (
                <Fragment key={row.key}>
                  <div className={`${rowBg} px-4 py-3 text-sm text-white/50 font-medium`}>
                    {row.label}
                  </div>
                  {validCars.map((car) => {
                    const raw = car[row.key];
                    const numVal = Number(raw);
                    let cellClass = 'text-white/80';

                    if (row.highlight === 'lower' && !isNaN(numVal) && numVal > 0) {
                      const min = row.key === 'price' ? minPrice : minMileage;
                      const max = row.key === 'price' ? maxPrice : maxMileage;
                      if (min !== null && numVal === min)
                        cellClass = 'text-emerald-400 font-bold';
                      else if (max !== null && numVal === max)
                        cellClass = 'text-red-400';
                    }

                    return (
                      <div
                        key={`${car.id}-${row.key}`}
                        className={`${rowBg} border-l border-white/5 px-4 py-3 text-sm ${cellClass}`}
                      >
                        {row.format(raw)}
                      </div>
                    );
                  })}
                </Fragment>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-4 text-xs text-white/30 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
            ดีกว่า (ราคา/ไมล์ต่ำกว่า)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
            สูงกว่า
          </span>
        </div>

        {/* Descriptions */}
        {validCars.some((c) => c.description) && (
          <div className="mt-8 bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5">
            <div className="px-4 py-3 border-b border-white/5">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">
                คำอธิบายรถ
              </h3>
            </div>
            <div className={`grid ${colClass}`}>
              {validCars.map((car, i) => (
                <div
                  key={car.id}
                  className={`p-4 text-sm text-white/60 leading-relaxed ${
                    i < validCars.length - 1 ? 'border-r border-white/5' : ''
                  }`}
                >
                  {car.description || (
                    <span className="text-white/25 italic">ไม่มีคำอธิบาย</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 text-center py-10 bg-[#1a1a1a] rounded-2xl border border-white/5">
          <p className="text-white/50 text-sm mb-2">สนใจซื้อหรือต้องการขายรถ?</p>
          <h3 className="text-white font-bold text-xl mb-6">
            CheckKub พร้อมให้บริการ ราคายุติธรรม
          </h3>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/cars"
              className="px-6 py-3 bg-[#242424] text-white rounded-xl hover:bg-[#2a2a2a] transition font-medium border border-white/10 text-sm"
            >
              ← กลับดูรถทั้งหมด
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-[#EF4444] text-white rounded-xl hover:bg-[#DC2626] transition font-bold text-sm"
            >
              ติดต่อเรา
            </Link>
            <Link
              href="/sell"
              className="px-6 py-3 bg-[#242424] text-white rounded-xl hover:bg-[#2a2a2a] transition font-medium border border-white/10 text-sm"
            >
              ขายรถกับเรา
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComparePageClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EF4444]" />
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
