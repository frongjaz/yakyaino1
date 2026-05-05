'use client';

import { usePathname } from 'next/navigation';
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import CompareBar from "@/components/Compare/CompareBar";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Header />}
      {children}
      {!isAdmin && <Footer />}
      {!isAdmin && <ScrollToTop />}
      {!isAdmin && <CompareBar />}
    </>
  );
}
