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
import FAQ from "@/components/FAQ";
import CarDetailContent from '@/components/CarDetail/CarDetailContent';

interface HomePageContentProps {
  initialCars?: { id?: string | number; name: string; image: string }[];
}

export default function HomePageContent({ initialCars }: HomePageContentProps) {
  const pathname = usePathname();
  const [isCarDetailPage, setIsCarDetailPage] = useState(false);

  useEffect(() => {
    if (pathname && pathname.match(/^\/cars\/[A-Za-z0-9_-]+\/?$/)) {
      setIsCarDetailPage(true);
    } else {
      setIsCarDetailPage(false);
    }
  }, [pathname]);

  // Fallback for static export: render car detail when on /cars/[id]
  if (isCarDetailPage && pathname) {
    const match = pathname.match(/^\/cars\/([A-Za-z0-9_-]+)\/?$/);
    const carId = match?.[1];
    if (carId) {
      return <CarDetailContent carId={carId} />;
    }
  }

  return (
    <>
      <ScrollUp />
      <Hero />
      <CarCarousel cars={initialCars} />
      <SellBanner />
      <HowToSell />
      <AboutUs />
      <FAQ />
      <SocialVideos />
    </>
  );
}
