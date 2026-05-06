import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.checkkub.com"),
  title: { absolute: "ติดต่อเรา | ขายรถ รับซื้อรถ | CheckKub" },
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
    url: "https://www.checkkub.com/contact",
    siteName: "CheckKub",
    type: "website",
    locale: "th_TH",
    images: [{ url: "https://www.checkkub.com/images/video/car2.jpg", width: 1200, height: 630, alt: "ติดต่อ CheckKub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ติดต่อ CheckKub | ขายรถ รับซื้อรถ",
    description: "ต้องการขายรถ? รับซื้อรถ? ติดต่อ CheckKub",
    images: ["https://www.checkkub.com/images/video/car2.jpg"],
  },
};

const ContactPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.checkkub.com";

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

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "หน้าแรก", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "ติดต่อเรา", item: `${baseUrl}/contact` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Contact />
    </>
  );
};

export default ContactPage;
