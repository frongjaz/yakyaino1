"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

const CarListingsGrid = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const brand = searchParams.get('brand') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  
  const [cars, setCars] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCars();
  }, [searchQuery, brand, minPrice, maxPrice]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      
      // Build URL with all filter parameters
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (brand && brand !== 'ทั้งหมด') params.set('brand', brand);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      
      const url = params.toString() 
        ? `/api/cars?${params.toString()}`
        : '/api/cars';
      
      const data = await apiGet<{ success: boolean; data: CarListing[] }>(url);
      
      if (data.success && data.data) {
        // Filter only available cars
        const availableCars = data.data.filter((car: CarListing) => 
          car.status === 'available' || !car.status
        );
        setCars(availableCars);
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
            <div
              key={car.id}
              className="group relative overflow-hidden rounded-lg bg-gray-800 transition hover:shadow-lg"
            >
              {/* Car Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={car.image || '/images/placeholder.jpg'}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                  }}
                  unoptimized
                />
                
                {/* Photo Count Badge - White circle with black border */}
                <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full border-2 border-black bg-white px-2 py-1">
                  <svg
                    className="h-3.5 w-3.5 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-black">
                    {car.photo_count || 0}
                  </span>
                </div>

                {/* Year Badge - Red with rounded corners */}
                <div className="absolute right-4 top-4 rounded-md bg-[#EF4444] px-3 py-1.5 text-sm font-bold text-white">
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
                
                {/* View All Link */}
                <Link
                  href={`/cars/${encodeCarId(car.id)}`}
                  className="flex items-center justify-between text-sm text-white transition hover:text-gray-300"
                >
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
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarListingsGrid;

