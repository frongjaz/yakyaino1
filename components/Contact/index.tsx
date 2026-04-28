"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Contact = () => {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainerRef.current || mapRef.current || typeof window === "undefined") return;

    import("leaflet").then((L) => {
      delete (L.default.Icon.Default.prototype as any)._getIconUrl;
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.default.map(mapContainerRef.current!).setView([13.7447016, 100.4025408], 17);

      L.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.default.marker([13.7447016, 100.4025408]).addTo(map);
      marker.bindPopup("<b>V AUTOCAR</b><br>KCC กาญจนา คาร์ เซนเตอร์").openPopup();

      mapRef.current = map;
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isClient]);

  return (
    <section id="contact" className="overflow-hidden bg-gray-50 py-16 md:py-20 lg:py-28">
      {/* Section Header */}
      <div className="container px-4 mb-10 text-center">
        <span className="mb-3 inline-block rounded-full bg-red-100 px-5 py-1.5 text-sm font-semibold text-red-600">
          ติดต่อเรา
        </span>
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
          V.AUTO CAR
        </h2>
        <p className="mt-3 text-gray-500 max-w-md mx-auto">
          KCC กาญจนา คาร์ เซนเตอร์ — ร้านรถยนต์มือสองคุณภาพ ใกล้ The Mall บางแค
        </p>
      </div>

      {/* Interactive Map */}
      <div className="mb-10 w-full shadow-md">
        <div
          ref={mapContainerRef}
          className="relative h-[380px] w-full overflow-hidden md:h-[430px] lg:h-[480px]"
          style={{ zIndex: 0 }}
        ></div>
      </div>

      <div className="container px-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

          {/* Left column: Location image + Address */}
          <div className="lg:col-span-3 space-y-5">
            {/* Directional map image */}
            <div className="relative h-[260px] w-full overflow-hidden rounded-2xl shadow-md md:h-[300px]">
              <Image
                src={getImagePath("/images/map-vautocar.jpg")}
                alt="แผนที่เส้นทาง V-autocar"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <Link
                href="https://maps.google.com/?q=13.7447016,100.4025408"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 text-sm font-semibold text-gray-800 shadow hover:bg-white transition"
              >
                <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                เปิดใน Google Maps
              </Link>
            </div>

            {/* Address card */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 rounded-xl bg-red-50 p-3">
                  <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-bold text-gray-900">ที่อยู่</h3>
                  <p className="text-gray-600 leading-relaxed">
                    KCC กาญจนา คาร์ เซนเตอร์<br />
                    1647 แขวงบางไผ่ บางแค<br />
                    กรุงเทพมหานคร 10160
                  </p>
                  <p className="mt-2 text-sm text-gray-400">ใกล้ The Mall บางแค · ถ.กาญจนาภิเษก</p>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-4">
                <div className="flex-shrink-0 rounded-xl bg-red-50 p-3">
                  <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-bold text-gray-900">เวลาทำการ</h3>
                  <p className="text-gray-600">ทุกวัน · 09:00 – 18:00 น.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Contact methods */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm h-full flex flex-col items-center gap-5">
              <h3 className="text-xl font-bold text-gray-900">ช่องทางการติดต่อ</h3>

              {/* QR Code */}
              <div className="rounded-xl border-2 border-red-100 p-3">
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://line.me/ti/p/@nattaauto`}
                  alt="LINE QR Code"
                  width={180}
                  height={180}
                  className="h-[180px] w-[180px]"
                  unoptimized
                />
              </div>
              <p className="text-sm text-gray-400 -mt-2">สแกน QR เพื่อเพิ่มเพื่อน LINE</p>

              {/* LINE Button */}
              <Link
                href="https://line.me/ti/p/@nattaauto"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#06C755] px-6 py-3.5 text-white font-semibold shadow-sm transition hover:bg-[#05b34c]"
              >
                <Image
                  src={getImagePath("/images/logo/line 01 Icon-06.svg")}
                  alt="LINE"
                  width={22}
                  height={22}
                  className="h-[22px] w-[22px]"
                />
                LINE: @nattaauto
              </Link>

              {/* Phone Button */}
              <Link
                href="tel:0625646455"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-500 px-6 py-3.5 text-white font-semibold shadow-sm transition hover:bg-red-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                062-564-6455
              </Link>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-8">
          <p className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-gray-400">
            ติดตามเราได้ที่
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              href="https://www.facebook.com/thaanaat.k"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl bg-white px-6 py-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1877F2]">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-[#1877F2] transition-colors">Facebook</p>
                <p className="text-sm text-gray-400">thaanaat.k</p>
              </div>
            </Link>

            <Link
              href="https://www.tiktok.com/@v_autocar"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl bg-white px-6 py-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1a1a1a]">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-[#1a1a1a] transition-colors">TikTok</p>
                <p className="text-sm text-gray-400">@v_autocar</p>
              </div>
            </Link>

            <Link
              href="https://www.youtube.com/@nattaauto"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl bg-white px-6 py-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF0000]">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-[#FF0000] transition-colors">YouTube</p>
                <p className="text-sm text-gray-400">@nattaauto</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
