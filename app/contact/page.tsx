import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";
import Script from "next/script";

import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://v-autocar.co.th"),
  title: "ติดต่อ CheckKub | ขายรถ รับซื้อรถ - ส่งรายละเอียดรถเพื่อรับข้อเสนอ",
  description:
    "ต้องการขายรถ? รับซื้อรถ? ติดต่อ CheckKub เพื่อรับข้อเสนอรับซื้อรถ. กรอกข้อมูลรถหรือโทรหาเราเพื่อรับข้อเสนอรับซื้อรถจำนวนมากจากทีม CheckKub ได้ทันที.",
  keywords: [
    "ขายรถ",
    "รับซื้อรถ",
    "ต้องการขายรถ",
    "ติดต่อ CheckKub",
    "ที่รับซื้อรถ",
    "บริษัทรับซื้อรถ",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "ติดต่อ CheckKub | ขายรถ รับซื้อรถ",
    description:
      "ต้องการขายรถ? รับซื้อรถ? ติดต่อ CheckKub เพื่อรับข้อเสนอรับซื้อรถ",
    url: "https://v-autocar.co.th/contact",
    siteName: "CheckKub",
    type: "website",
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: "ติดต่อ CheckKub | ขายรถ รับซื้อรถ",
    description: "ต้องการขายรถ? รับซื้อรถ? ติดต่อ CheckKub",
  },
};

const ContactPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://checkkub.com";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    mainEntity: {
      "@type": "Organization",
      name: "CheckKub",
      url: baseUrl,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+66-2-123-4567",
        email: "sales@v-autocar.com",
        contactType: "Customer Service",
        areaServed: "TH",
        availableLanguage: "Thai",
      },
      description:
        "ติดต่อ CheckKub หากคุณต้องการขายรถ เราพร้อมให้บริการรับซื้อรถทุกประเภท.",
    },
  };

  return (
    <>
      <Script
        id="contact-page-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Contact />
    </>
  );
};

export default ContactPage;
