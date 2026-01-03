'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AboutUs from "@/components/AboutUs";
import CarCarousel from "@/components/CarCarousel";
import HowToSell from "@/components/HowToSell";
import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/Hero";
import SellBanner from "@/components/SellBanner";
import SocialVideos from "@/components/SocialVideos";
import Script from "next/script";
import CarDetailContent from '@/components/CarDetail/CarDetailContent';

export default function HomePageContent() {
  const pathname = usePathname();
  const [isCarDetailPage, setIsCarDetailPage] = useState(false);

  useEffect(() => {
    // Check if current path is a car detail page (/cars/[id])
    // Support both encoded IDs and plain numeric IDs
    if (pathname && pathname.match(/^\/cars\/[A-Za-z0-9_-]+\/?$/)) {
      setIsCarDetailPage(true);
    } else {
      setIsCarDetailPage(false);
    }
  }, [pathname]);

  // If it's a car detail page, render the detail page component
  if (isCarDetailPage && pathname) {
    // Extract the ID (can be encoded or plain number)
    const match = pathname.match(/^\/cars\/([A-Za-z0-9_-]+)\/?$/);
    const carId = match?.[1];
    if (carId) {
      return <CarDetailContent carId={carId} />;
    }
  }

  // Otherwise, render the home page
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "AutoDealer",
      name: "CheckKub",
      image: "https://v-autocar.co.th/images/video/car2.jpg",
      url: "https://v-autocar.co.th/",
      telephone: "+66-2-123-4567",
      email: "sales@v-autocar.com",
      description:
        "CheckKub รับซื้อรถจำนวนมาก รถบ้าน รถบริษัท และฟลีตองค์กรทั่วประเทศ ประเมินรวดเร็ว เอกสารครบ โอนเงินไว. หากคุณต้องการขายรถ ต้องการขายรถให้ใคร หรือกำลังมองหาที่รับซื้อรถ CheckKub พร้อมให้บริการรับซื้อรถทุกประเภท.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "123 ถนนสุขุมวิท",
        addressLocality: "เขตวัฒนา",
        addressRegion: "กรุงเทพมหานคร",
        postalCode: "10110",
        addressCountry: "TH",
      },
      areaServed: [
        "Bangkok",
        "Chiang Mai",
        "Khon Kaen",
        "Phuket",
        "Thailand",
      ],
      sameAs: [
        "https://www.facebook.com/vautocar",
        "https://line.me/R/ti/p/@vautocar",
      ],
      serviceType: [
        "รับซื้อรถจำนวนมาก",
        "รับซื้อรถบริษัท",
        "รับซื้อรถฟลีต",
        "รับซื้อรถยนต์มือสอง",
        "รับซื้อรถ",
        "ขายรถ",
        "ต้องการขายรถ",
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
          opens: "09:00",
          closes: "18:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Saturday"],
          opens: "09:00",
          closes: "16:00",
        },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "บริการรับซื้อรถจำนวนมาก",
        itemListElement: [
          {
            "@type": "Offer",
            name: "รับซื้อรถบ้านและรถครอบครัวหลายคัน",
          },
          {
            "@type": "Offer",
            name: "รับซื้อฟลีตรถบริษัทและรถเช่า",
          },
          {
            "@type": "Offer",
            name: "รับซื้อสต็อกจากดีลเลอร์และเต็นท์รถ",
          },
        ],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "ทำไมควรขายรถจำนวนมากให้ CheckKub?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "CheckKub มีทีมประเมินราคามืออาชีพ จัดทีมตรวจสภาพทั่วประเทศ และดูแลเอกสารโอนกรรมสิทธิ์ครบ ทำให้ปิดดีลได้รวดเร็วและโปร่งใส.",
          },
        },
        {
          "@type": "Question",
          name: "ต้องเตรียมเอกสารอะไรสำหรับรถบริษัทหรือรถลีสซิ่ง?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "ลูกค้าต้องเตรียมสำเนาทะเบียนรถ หนังสือปลดภาระ หนังสือมอบอำนาจ และเอกสารนิติบุคคล ทีมงานจะส่งเช็กลิสต์ให้ก่อนวันนัดหมาย.",
          },
        },
        {
          "@type": "Question",
          name: "ใช้เวลานานเท่าไรตั้งแต่ประเมินจนถึงโอนเงิน?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "หลังส่งข้อมูลครบ ทีมงานจะเสนอราคาภายใน 24 ชั่วโมง และสามารถโอนเงินได้ภายใน 1-3 วันทำการหลังตรวจสภาพเรียบร้อย.",
          },
        },
      ],
    },
  ];

  return (
    <>
      <ScrollUp />
      <Hero />
      <CarCarousel />
      <SellBanner />
      <HowToSell />
      <AboutUs />
      
      <SocialVideos />
      <Script
        id="checkkub-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}

