import ConditionalLayout from "@/components/ConditionalLayout";
import { Providers } from "./providers";
import { Inter } from "next/font/google";
import { Metadata } from "next";
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
  alternates: { canonical: "https://www.checkkub.com" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="th">
      <head />
      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
