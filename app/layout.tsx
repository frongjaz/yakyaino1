import ConditionalLayout from "@/components/ConditionalLayout";
import GoogleAnalytics from "@/components/Common/GoogleAnalytics";
import { Providers } from "./providers";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.checkkub.com"),
  title: {
    default: "ขายรถ รับซื้อรถ | CheckKub",
    template: "%s | CheckKub",
  },
  description: "CheckKub รับซื้อรถทุกประเภท รถมือสอง รถฟลีต รถบริษัททั่วประเทศ ประเมินรวดเร็ว ราคายุติธรรม ชำระเงินทันที",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#EF4444",
  alternates: {
    canonical: "https://www.checkkub.com",
    types: { 'application/rss+xml': 'https://www.checkkub.com/feed.xml' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="th">
      <head>
        <link rel="preconnect" href="https://www.checkkub.com" />
        <link rel="dns-prefetch" href="https://www.checkkub.com" />
      </head>
      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <GoogleAnalytics />
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
        <Toaster position="top-right" richColors closeButton />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
