import { Metadata } from 'next';
import ComparePageClient from './ComparePageClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.checkkub.com'),
  title: 'เปรียบเทียบรถยนต์ | CheckKub',
  description:
    'เปรียบเทียบรถยนต์มือสองแบบเคียงข้างกัน เทียบสเปค ราคา เลขไมล์ เกียร์ เชื้อเพลิง และรายละเอียดทั้งหมด ช่วยตัดสินใจก่อนซื้อรถ',
  keywords: [
    'เปรียบเทียบรถ',
    'compare รถยนต์',
    'เทียบสเปครถ',
    'เปรียบเทียบรถมือสอง',
    'checkkub เปรียบเทียบ',
  ],
  alternates: { canonical: '/compare' },
  openGraph: {
    title: 'เปรียบเทียบรถยนต์ | CheckKub',
    description:
      'เปรียบเทียบรถยนต์มือสองแบบเคียงข้างกัน เทียบสเปค ราคา และรายละเอียดทั้งหมด',
    url: 'https://www.checkkub.com/compare',
    siteName: 'CheckKub',
    type: 'website',
    locale: 'th_TH',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'เปรียบเทียบรถยนต์ | CheckKub',
    description: 'เปรียบเทียบรถยนต์มือสองแบบเคียงข้างกัน เทียบสเปคและราคา',
  },
};

export default function ComparePage() {
  return <ComparePageClient />;
}
