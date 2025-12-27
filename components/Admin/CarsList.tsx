'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  status: string;
  created_at: string;
}

export default function CarsList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cars');
      const data = await response.json();

      if (data.success) {
        setCars(data.data || []);
      } else {
        setError(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH').format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { text: string; color: string } } = {
      available: { text: 'พร้อมขาย', color: 'bg-green-100 text-green-800' },
      sold: { text: 'ขายแล้ว', color: 'bg-gray-100 text-gray-800' },
      pending: { text: 'รอดำเนินการ', color: 'bg-yellow-100 text-yellow-800' },
    };

    const statusInfo = statusMap[status] || statusMap.available;

    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}
      >
        {statusInfo.text}
      </span>
    );
  };

  if (loading) {
    return <div className="text-center py-8">กำลังโหลด...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        ยังไม่มีข้อมูลรถ
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              รูปภาพ
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ยี่ห้อ/รุ่น
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ปี
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ราคา
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              สถานะ
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              วันที่เพิ่ม
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cars.map((car) => (
            <tr key={car.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="relative h-16 w-24 rounded overflow-hidden">
                  <Image
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/404.svg';
                    }}
                    unoptimized
                  />
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {car.brand}
                </div>
                <div className="text-sm text-gray-500">{car.model}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {car.year}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {formatPrice(car.price)} บาท
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {getStatusBadge(car.status)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {new Date(car.created_at).toLocaleDateString('th-TH')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

