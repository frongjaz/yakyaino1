"use client";
import { getImagePath } from "@/lib/utils";
import { trackPhoneClick, trackLineClick } from "@/lib/gtag";
import Image from "next/image";
import Link from "next/link";

const SellHero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[500px] w-full md:h-[600px] lg:h-[700px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={getImagePath("/images/about/S__5800061.webp")}
            alt="Car Dealership Background"
            fill
            priority
            className="h-full w-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        {/* Content */}
        <div className="container relative z-10 h-full px-4">
          <div className="flex h-full flex-col items-center justify-center text-center">
            {/* Phone numbers - Top left */}
     

            {/* Shopping bag icon with SALE tag */}
            <div className="mb-6 relative inline-block">
              <div className="flex items-center justify-center">
                <Image
                  src={getImagePath("/images/logo/Sale_page_title Icon-12.svg")}
                  alt="Sell to Us Icon"
                  width={120}
                  height={120}
                  className="drop-shadow-lg"
                  priority
                />
              </div>
            </div>

            <h1 className="mb-8 text-4xl font-bold text-white drop-shadow-lg md:text-5xl lg:text-6xl">
              ขายรถกับเรา — รับซื้อรถทุกประเภท ราคายุติธรรม
            </h1>

            {/* Contact & Social */}
            <div className="mt-2 flex flex-col items-center gap-4">

              {/* Primary CTAs — phone + LINE */}
              <div className="flex items-center gap-3">
                <a
                  href="tel:0625646455"
                  aria-label="โทรหาเรา"
                  onClick={() => trackPhoneClick("sell_hero")}
                  className="group flex items-center gap-2.5 rounded-full bg-[#EF4444] px-6 py-3 text-sm font-semibold text-white shadow-xl ring-2 ring-white/20 transition-all duration-200 hover:bg-[#DC2626] hover:scale-105 hover:shadow-red-500/40 hover:shadow-2xl"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0">
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                  </svg>
                  โทรเลย
                </a>

                <a
                  href="https://line.me/ti/p/@831tvslj"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ติดต่อผ่าน LINE"
                  onClick={() => trackLineClick("sell_hero")}
                  className="group flex items-center gap-2.5 rounded-full bg-[#06C755] px-6 py-3 text-sm font-semibold text-white shadow-xl ring-2 ring-white/20 transition-all duration-200 hover:bg-[#05b34c] hover:scale-105 hover:shadow-green-500/40 hover:shadow-2xl"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.41-.097-.54-.271l-2.396-3.27v2.914c0 .345-.282.629-.631.629-.345 0-.627-.284-.627-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .4.099.528.271l2.397 3.27V8.108c0-.345.282-.63.628-.63.349 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.631-.63.345 0 .627.285.627.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                  LINE
                </a>
              </div>

              {/* Social icons row */}
              <div className="flex items-center gap-2">
                <a
                  href="https://www.facebook.com/thaanaat.k"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm ring-1 ring-white/20 transition-all duration-200 hover:bg-[#1877F2] hover:scale-110 hover:ring-[#1877F2]"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                  </svg>
                </a>

                <a
                  href="https://www.youtube.com/@V-autocar"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm ring-1 ring-white/20 transition-all duration-200 hover:bg-[#FF0000] hover:scale-110 hover:ring-[#FF0000]"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                <a
                  href="https://www.tiktok.com/@v_autocar"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm ring-1 ring-white/20 transition-all duration-200 hover:bg-black hover:scale-110 hover:ring-white/40"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellHero;

