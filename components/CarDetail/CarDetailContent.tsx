'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CarDetailBreadcrumb from "@/components/CarDetail/CarDetailBreadcrumb";
import CarImageGallery from "@/components/CarDetail/CarImageGallery";
import CarSpecifications from "@/components/CarDetail/CarSpecifications";
import CarPricing from "@/components/CarDetail/CarPricing";
import CarContactSection from "@/components/CarDetail/CarContactSection";
import RelatedCars from "@/components/CarDetail/RelatedCars";
import { apiGet } from '@/lib/api';

interface CarData {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  image2?: string | null;
  image3?: string | null;
  image4?: string | null;
  image5?: string | null;
  photo_count: number;
  description?: string;
  mileage?: number | null;
  color?: string | null;
  transmission?: string | null;
  fuel_type?: string | null;
  engine_size?: string | null;
  license_plate?: string | null;
  status?: string;
}

interface CarDetailContentProps {
  carId: string;
}

export default function CarDetailContent({ carId }: CarDetailContentProps) {
  const router = useRouter();
  const [car, setCar] = useState<CarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (carId) {
      fetchCarData(carId);
    }
  }, [carId]);

  const fetchCarData = async (id: string) => {
    try {
      setLoading(true);
      const data = await apiGet<{ success: boolean; data: CarData }>(`/api/cars/${id}`);
      
      if (data.success && data.data) {
        setCar(data.data);
      } else {
        setError('ไม่พบข้อมูลรถ');
      }
    } catch (err: any) {
      console.error('Error fetching car:', err);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EF4444] mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'ไม่พบข้อมูลรถ'}</p>
          <button
            onClick={() => router.push('/cars')}
            className="px-4 py-2 bg-[#EF4444] text-white rounded hover:bg-[#DC2626] transition"
          >
            กลับไปหน้ารายการรถ
          </button>
        </div>
      </div>
    );
  }

  // Format mileage
  const formatMileage = (mileage: number | null | undefined): string => {
    if (!mileage) return 'N/A';
    return new Intl.NumberFormat('th-TH').format(mileage);
  };

  // Calculate monthly payment (rough estimate: 3% of price)
  const monthlyPayment = Math.round(car.price * 0.03);

  // Collect all images (image, image2, image3, image4, image5) that are not empty
  const allImages = [
    car.image,
    car.image2,
    car.image3,
    car.image4,
    car.image5,
  ].filter((img): img is string => !!img && img.trim() !== '');

  // Prepare car data for components
  const carData = {
    id: car.id.toString(),
    brand: car.brand,
    model: car.model,
    grade: car.engine_size || '',
    year: car.year,
    engine: car.engine_size || 'N/A',
    type: car.fuel_type || 'N/A',
    gearbox: car.transmission || 'N/A',
    color: car.color || 'N/A',
    mileage: formatMileage(car.mileage),
    licensePlate: car.license_plate || '-',
    location: '-', // Not in database
    price: car.price,
    monthlyPayment: monthlyPayment,
    mainImage: allImages[0] || car.image,
    images: allImages.length > 0 ? allImages : [car.image],
    totalPhotos: allImages.length > 0 ? allImages.length : (car.photo_count || 1),
  };

  return (
    <>
      <CarDetailBreadcrumb
        brand={carData.brand}
        model={carData.model}
        year={carData.year}
      />
      <br /><br /><br />
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            {/* Images - Full Width */}
            <CarImageGallery
              mainImage={carData.mainImage}
              images={carData.images}
              totalPhotos={carData.totalPhotos}
            />
            
            {/* Specs and Contact - 2 Columns */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
              {/* Left Column - Specs and Pricing */}
              <div className="space-y-6">
                <CarSpecifications
                  brand={carData.brand}
                  model={carData.model}
                  grade={carData.grade}
                  year={carData.year}
                  engine={carData.engine}
                  type={carData.type}
                  gearbox={carData.gearbox}
                  color={carData.color}
                  mileage={carData.mileage}
                  licensePlate={carData.licensePlate}
                  location={carData.location}
                />
                <CarPricing
                  price={carData.price}
                  monthlyPayment={carData.monthlyPayment}
                />
                {car.description && (
                  <div className="mt-6">
                    <h3 className="mb-3 text-xl font-bold text-gray-900">คำอธิบาย</h3>
                    <p className="text-gray-700 whitespace-pre-line">{car.description}</p>
                  </div>
                )}
              </div>

              {/* Right Column - Contact Section */}
              <div>
                <CarContactSection />
              </div>
            </div>
          </div>
        </div>
      </section>

      <RelatedCars currentCarId={carData.id} />
    </>
  );
}

