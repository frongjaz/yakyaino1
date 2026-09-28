import SellHero from "@/components/SellPage/SellHero";
import SellBenefits from "@/components/SellPage/SellBenefits";
import SellPolicy from "@/components/SellPage/SellPolicy";
import AcceptCars from "@/components/SellPage/AcceptCars";
import SellSteps from "@/components/SellPage/SellSteps";
import SellCtaBanner from "@/components/SellPage/SellCtaBanner";
import SellTrustBar from "@/components/SellPage/SellTrustBar";
import ScrollUp from "@/components/Common/ScrollUp";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.checkkub.com"),
  title: { absolute: "ขายรถ — รับซื้อรถทุกประเภท ราคายุติธรรม | CheckKub" },
  description: "ต้องการขายรถ? รับซื้อรถ? CheckKub รับซื้อรถทุกประเภท รวดเร็ว โปร่งใส ราคายุติธรรม ชำระเงินภายใน 1–3 วันทำการ. เรารับซื้อรถมือสอง รถฟลีต รถบริษัททั่วประเทศ. ขายรถให้เรา รับซื้อรถที่ไหนดี CheckKub พร้อมให้บริการ.",
  keywords: [
    "ขายรถ",
    "รับซื้อรถ",
    "ต้องการขายรถ",
    "ขายรถมือสอง",
    "รับซื้อรถมือสอง",
    "ขายรถให้เรา",
    "ที่รับซื้อรถ",
    "บริษัทรับซื้อรถ",
    "ขายรถฟลีต",
    "รับซื้อรถฟลีต",
  ],
  alternates: {
    canonical: "/sell",
  },
  openGraph: {
    title: "ขายรถ รับซื้อรถ | CheckKub - ต้องการขายรถ รับซื้อรถทุกประเภท",
    description: "ต้องการขายรถ? รับซื้อรถ? CheckKub รับซื้อรถทุกประเภท รวดเร็ว โปร่งใส ราคายุติธรรม ชำระเงินภายใน 1–3 วันทำการ",
    url: "https://www.checkkub.com/sell",
    siteName: "CheckKub",
    type: "website",
    locale: "th_TH",
    images: [{ url: "https://www.checkkub.com/images/video/car3.jpg", width: 1200, height: 630, alt: "ขายรถ รับซื้อรถ CheckKub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ขายรถ รับซื้อรถ | CheckKub",
    description: "ต้องการขายรถ? รับซื้อรถ? CheckKub รับซื้อรถทุกประเภท ราคายุติธรรม ชำระเงินภายใน 1–3 วันทำการ",
    images: ["https://www.checkkub.com/images/video/car3.jpg"],
  },
};

export default function SellPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.checkkub.com";

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "วิธีขายรถกับ CheckKub",
      description: "ขั้นตอนการขายรถให้กับ CheckKub อย่างง่ายดาย ประเมินราคารวดเร็ว ชำระเงินภายใน 1–3 วันทำการ",
      totalTime: "P1D",
      estimatedCost: {
        "@type": "MonetaryAmount",
        currency: "THB",
        value: "0",
      },
      supply: [
        { "@type": "HowToSupply", name: "สำเนาทะเบียนรถ" },
        { "@type": "HowToSupply", name: "บัตรประชาชนเจ้าของรถ" },
        { "@type": "HowToSupply", name: "เล่มทะเบียนรถ" },
      ],
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "ส่งข้อมูลรถให้ทีม CheckKub",
          text: "ส่งรูปถ่ายและข้อมูลรถ เช่น ยี่ห้อ รุ่น ปี เลขไมล์ สภาพรถ ผ่านช่องทาง LINE, Facebook หรือเว็บไซต์",
          url: `${baseUrl}/sell`,
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "รับใบเสนอราคาภายใน 24 ชั่วโมง",
          text: "ทีมผู้เชี่ยวชาญของ CheckKub จะประเมินราคาและส่งข้อเสนอภายใน 24 ชั่วโมง ไม่มีค่าใช้จ่าย",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "นัดตรวจสภาพรถ",
          text: "หากตกลงราคาได้ ทีมงานจะนัดหมายตรวจสภาพรถ ณ สถานที่ที่คุณสะดวก ทั่วประเทศ",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "โอนเงินภายใน 1–3 วันทำการหลังตรวจสภาพ",
          text: "เมื่อตรวจสภาพรถเรียบร้อย CheckKub จะชำระเงินภายใน 1–3 วันทำการภายใน 1-3 วันทำการ พร้อมดูแลเอกสารโอนกรรมสิทธิ์ครบ",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: ["ขายรถ", "รับซื้อรถ", "ต้องการขายรถ"],
      name: "บริการขายรถ รับซื้อรถ",
      provider: {
        "@type": "AutoDealer",
        name: "CheckKub",
        url: baseUrl,
        telephone: "+66-2-123-4567",
        email: "sales@v-autocar.com",
      },
      areaServed: {
        "@type": "Country",
        name: "Thailand",
      },
      description:
        "ขายรถ รับซื้อรถ - CheckKub รับซื้อรถทุกประเภท สำหรับผู้ที่ต้องการขายรถ. เรามีบริการรับซื้อรถมือสอง รถฟลีต รถบริษัททั่วประเทศ. ประเมินรวดเร็ว ราคายุติธรรม ชำระเงินภายใน 1–3 วันทำการ. ที่รับซื้อรถ CheckKub พร้อมให้บริการ.",
      offers: {
        "@type": "Offer",
        name: "ขายรถ รับซื้อรถ",
        description: "รับซื้อรถทุกประเภท ราคายุติธรรม ชำระเงินภายใน 1–3 วันทำการ สำหรับผู้ที่ต้องการขายรถ",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "ต้องการขายรถ ควรขายให้ใครดี?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "หากคุณต้องการขายรถ CheckKub เป็นตัวเลือกที่ดี เพราะเรามีทีมประเมินราคามืออาชีพ ให้ราคาตามสภาพจริง ไม่กดราคา และชำระเงินภายใน 1–3 วันทำการหลังตกลงราคา. เรารับซื้อรถทุกประเภท ทั้งรถส่วนบุคคล รถฟลีต และรถบริษัท.",
          },
        },
        {
          "@type": "Question",
          name: "รับซื้อรถที่ไหนบ้าง?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "CheckKub รับซื้อรถทั่วประเทศ เรามีทีมตรวจสภาพและประเมินราคาในทุกจังหวัด. ไม่ว่าคุณต้องการขายรถที่กรุงเทพ เชียงใหม่ ขอนแก่น หรือจังหวัดไหน เราพร้อมให้บริการ.",
          },
        },
        {
          "@type": "Question",
          name: "ขายรถที่ไหนดี?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "ขายรถที่ CheckKub รับซื้อรถทุกประเภท ให้ราคายุติธรรม ประเมินรวดเร็ว ชำระเงินภายใน 1–3 วันทำการ. เรารับซื้อรถมือสอง รถฟลีต รถบริษัททั่วประเทศ.",
          },
        },
      ],
    },
  ];

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "หน้าแรก", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "ขายรถ รับซื้อรถ", item: `${baseUrl}/sell` },
    ],
  };

  return (
    <>
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <ScrollUp />
      <SellHero />
      <SellTrustBar />

      {/* LINE CTA — Primary hook */}
      <section className="bg-white py-14 md:py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-lg text-center">
            <span className="mb-3 inline-block rounded-full bg-green-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#06C755]">
              รับราคาภายใน 5 นาที · ฟรี
            </span>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">ทักผ่าน LINE ได้เลย</h2>
            <p className="mb-8 text-gray-500">ทีมเราพร้อมตอบทันที ไม่มีข้อผูกมัด ไม่มีค่าใช้จ่าย</p>
            <a
              href="https://line.me/ti/p/@checkkub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between gap-4 rounded-2xl bg-[#06C755] px-6 py-5 shadow-lg shadow-green-200 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-green-300 active:scale-100"
            >
              <div className="text-left">
                <p className="text-xs font-semibold uppercase tracking-widest text-green-100">ช่องทางที่เร็วที่สุด</p>
                <p className="mt-0.5 text-xl font-bold text-white">@checkkub</p>
                <p className="text-sm text-green-100">ทีมเราตอบทันที · ประเมินฟรีภายใน 5 นาที</p>
              </div>
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md">
                  <svg viewBox="0 0 24 24" fill="#06C755" className="h-8 w-8">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.41-.097-.54-.271l-2.396-3.27v2.914c0 .345-.282.629-.631.629-.345 0-.627-.284-.627-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .4.099.528.271l2.397 3.27V8.108c0-.345.282-.63.628-.63.349 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.631-.63.345 0 .627.285.627.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-white">เปิด LINE</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Floating LINE button — mobile only */}
      <a
        href="https://line.me/ti/p/@checkkub"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-4 z-50 flex items-center gap-2.5 rounded-full bg-[#06C755] px-5 py-3.5 shadow-2xl shadow-green-400/50 transition-transform hover:scale-105 active:scale-95 lg:hidden"
        aria-label="ติดต่อผ่าน LINE"
      >
        <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5 shrink-0">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.41-.097-.54-.271l-2.396-3.27v2.914c0 .345-.282.629-.631.629-.345 0-.627-.284-.627-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .4.099.528.271l2.397 3.27V8.108c0-.345.282-.63.628-.63.349 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.631-.63.345 0 .627.285.627.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
        </svg>
        <span className="text-sm font-bold text-white">ทักหาเราผ่าน LINE</span>
      </a>

      <SellBenefits />
      <SellPolicy />
      <AcceptCars />
      <SellCtaBanner
        heading="มีรถที่ต้องการขาย?"
        sub="ส่งข้อมูลรถให้เราประเมินราคาได้ฟรี รับราคาภายใน 5 นาที"
        btnText="ประเมินราคารถ"
      />
      <SellSteps />
      <SellCtaBanner
        heading="พร้อมขายรถแล้วใช่ไหม?"
        sub="เริ่มประเมินราคาได้เลย ไม่มีค่าใช้จ่าย รับราคาภายใน 5 นาที"
        btnText="ส่งข้อมูลรถ"
      />
    </>
  );
}

