import { Metadata } from 'next';
import CarDetailsClient from "./CarDetailsClient";
import { decodeCarId, encodeCarId } from '@/lib/id-encoder';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.checkkub.com';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || baseUrl;

export function generateStaticParams() {
  return [{ id: 'detail' }];
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params;
  if (!id || id === 'detail') return {};

  try {
    const decodedId = decodeCarId(id);
    const carId = decodedId || id;
    const encodedId = encodeCarId(carId);

    const res = await fetch(`${apiUrl}/api/cars/${encodedId}`, { next: { revalidate: 3600 } });
    if (!res.ok) return {};
    const data = await res.json();
    const car = data?.data;
    if (!car) return {};

    const title = `${car.brand} ${car.model} ปี ${car.year} | CheckKub - ซื้อรถมือสอง`;
    const description = `${car.brand} ${car.model} ปี ${car.year}${car.mileage ? ` เลขไมล์ ${new Intl.NumberFormat('th-TH').format(car.mileage)} กม.` : ''}${car.color ? ` สี${car.color}` : ''}${car.transmission ? ` เกียร์${car.transmission}` : ''} ราคา ${new Intl.NumberFormat('th-TH').format(car.price)} บาท ซื้อรถมือสองคุณภาพดีที่ CheckKub`;
    const imageUrl = car.image?.startsWith('http') ? car.image : `${baseUrl}${car.image || '/images/placeholder.jpg'}`;
    const carUrl = `${baseUrl}/cars/${encodeCarId(car.id)}`;

    return {
      metadataBase: new URL(baseUrl),
      title,
      description,
      keywords: [
        `${car.brand} ${car.model}`,
        `${car.brand} ${car.model} มือสอง`,
        `ซื้อ${car.brand} ${car.model}`,
        `ราคา ${car.brand} ${car.model}`,
        `${car.brand} ${car.model} ปี ${car.year}`,
        'ซื้อรถมือสอง',
        'รถมือสองคุณภาพดี',
        'CheckKub',
      ],
      alternates: { canonical: carUrl },
      openGraph: {
        title,
        description,
        url: carUrl,
        siteName: 'CheckKub',
        images: [{ url: imageUrl, width: 1200, height: 630, alt: `${car.brand} ${car.model} ปี ${car.year}` }],
        locale: 'th_TH',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch {
    return {};
  }
}

export default function CarDetailPage() {
  return <CarDetailsClient />;
}
