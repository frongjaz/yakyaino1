"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import { encodeCarId } from "@/lib/id-encoder";

type CarListing = {
  id: string | number;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  photo_count: number;
  status?: string;
};

type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const CarListingsGrid = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const brand = searchParams.get('brand') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const page = searchParams.get('page') || '1';

  const [cars, setCars] = useState<CarListing[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCars();
  }, [searchQuery, brand, minPrice, maxPrice, page]);

  const fetchCars = async () => {
    try {
      setLoading(true);

      // Build URL with all filter parameters including pagination
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (brand && brand !== 'ทั้งหมด') params.set('brand', brand);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      params.set('page', page);
      params.set('limit', '12');

      const url = `/api/cars?${params.toString()}`;

      const data = await apiGet<{
        success: boolean;
        data: CarListing[];
        pagination?: PaginationInfo;
      }>(url);

      if (data.success && data.data) {
        // Filter only available cars
        const availableCars = data.data.filter((car: CarListing) =>
          car.status === 'available' || !car.status
        );
        setCars(availableCars);

        // Update pagination info
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } else {
        setError('ไม่สามารถโหลดข้อมูลรถได้');
      }
    } catch (err: any) {
      console.error('Error fetching cars:', err);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH").format(price);
  };

  if (loading) {
    return (
      <section className="bg-[#2C2C2C] py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white">กำลังโหลดข้อมูล...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-[#2C2C2C] py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchCars}
                className="px-4 py-2 bg-[#EF4444] text-white rounded hover:bg-[#DC2626] transition"
              >
                ลองอีกครั้ง
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (cars.length === 0) {
    return (
      <section className="bg-[#2C2C2C] py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <p className="text-white text-lg">ยังไม่มีข้อมูลรถ</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#2C2C2C] py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <Link
              key={car.id}
              href={`/cars/${encodeCarId(car.id)}`}
              className="group relative block overflow-hidden rounded-lg bg-gray-800 transition hover:shadow-lg cursor-pointer"
            >
              {/* Car Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={getImagePath(car.image)}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                  }}
                  unoptimized
                />

                {/* Photo Count Badge */}
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-lg bg-black/60 backdrop-blur-sm px-2.5 py-1.5 z-10 border border-white/20 shadow-lg">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs font-medium text-white">
                    {car.photo_count || 0}
                  </span>
                </div>

                {/* Year Badge - Red with rounded corners */}
                <div className="absolute right-4 top-4 rounded-md bg-[#EF4444] px-3 py-1.5 text-sm font-bold text-white z-10">
                  {car.year}
                </div>
              </div>

              {/* Car Info - Dark Rectangle at Bottom */}
              <div className="bg-gray-800 p-4">
                {/* Brand - Red, Bold, Uppercase */}
                <h3 className="mb-1 text-lg font-bold uppercase text-[#EF4444]">
                  {car.brand}
                </h3>

                {/* Model + Year - White */}
                <p className="mb-3 text-sm text-white">
                  {car.model} {car.year}
                </p>

                {/* Price - Red, Bold, Right aligned */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex-1"></div>
                  <p className="text-xl font-bold text-[#EF4444]">
                    {formatPrice(car.price)}
                  </p>
                </div>

                {/* Divider Line */}
                <div className="mb-3 h-px bg-gray-700"></div>

                {/* View All Link - Now just a visual indicator */}
                <div className="flex items-center justify-between text-sm text-white transition group-hover:text-gray-300">
                  <span>ดูทั้งหมด</span>
                  <svg
                    className="h-4 w-4 text-[#EF4444]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarListingsGrid;

