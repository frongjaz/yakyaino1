"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";

const TikTokVideos = () => {
  const videos = [
    {
      thumbnail: "/images/about/S__5800084_0.webp",
      title: "POV เมื่อลูกค้านัดมาดูรถ",
      alt: "POV When a customer makes an appointment to see a car",
    },
    {
      thumbnail: "/images/about/S__5800062.webp",
      title: "BENZ E 250 YEAR:2012 399,900",
      subtitle: "ประวัติศูนย์บริการครบทุกระยะ>>>",
      alt: "BENZ E 250",
    },
    {
      thumbnail: "/images/about/S__5800061.webp",
      title: "POV เมื่อลูกค้าบอกจะเข้ามาจองรถ",
      alt: "POV When a customer says they will come to reserve a car",
    },
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {videos.map((video, index) => (
            <div key={index} className="group relative">
              {/* Video Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={getImagePath(video.thumbnail)}
                  alt={video.alt}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EF4444]">
                    <svg
                      className="ml-1 h-8 w-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="mt-4 text-lg font-bold text-gray-800 md:text-xl">
                {video.title}
              </h3>
              {video.subtitle && (
                <p className="mt-2 text-sm text-gray-600">{video.subtitle}</p>
              )}

              {/* TikTok Button */}
              <div className="mt-4">
                <button className="flex items-center gap-2 rounded-full bg-[#EF4444] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#DC2626]">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                  <span>TIKTOK</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TikTokVideos;

