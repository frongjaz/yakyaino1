"use client";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const Contact = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map (Bangkok coordinates as default, you can change this)
    const map = L.map(mapContainerRef.current).setView([13.7447016, 100.4025408], 17);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);
    // Add marker
    const marker = L.marker([13.7447016, 100.4025408]).addTo(map);
    marker.bindPopup("V AUTOCAR").openPopup();

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <section id="contact" className="overflow-hidden bg-white py-16 md:py-20 lg:py-28">
      <div className="container px-4">
        {/* Full-width Map */}
        <div className="mb-12 w-full">
          <div
            ref={mapContainerRef}
            className="relative h-[400px] w-full rounded-lg border border-gray-300 overflow-hidden md:h-[450px] lg:h-[500px]"
            style={{ zIndex: 0 }}
          ></div>
        </div>

        <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left side - Map and Address */}
          <div className="space-y-6">
            {/* Detailed Location Map - Orange/Yellow directional map */}
            <div className="relative h-[250px] w-full rounded-lg border border-gray-300 bg-gradient-to-br from-orange-200 via-yellow-200 to-orange-300 md:h-[300px] overflow-hidden">
              <div className="flex h-full items-center justify-center p-4">
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700 mb-2">แผนที่เส้นทาง</p>
                  <p className="text-xs text-gray-600">V.AUTO CAR</p>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div>
              <h3 className="mb-4 text-2xl font-bold text-[#EF4444]">ที่อยู่</h3>
              <p className="text-base leading-relaxed text-gray-700">
                KCC กาญจนา คาร์ เซนเตอร์ 1647 แขวงบางไผ่ บางแค กรุงเทพมหานคร 10160
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 -translate-x-1/2"></div>

          {/* Right side - Contact Methods */}
          <div className="space-y-6 text-center">
            <h3 className="text-2xl font-bold text-[#EF4444]">ช่องทางการติดต่อ</h3>

            {/* QR Code from LINE API */}
            <div className="flex justify-center">
              <div className="rounded-lg border-2 border-[#EF4444] p-4">
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://line.me/ti/p/@nattaauto`}
                  alt="LINE QR Code"
                  width={200}
                  height={200}
                  className="h-[200px] w-[200px]"
                  unoptimized
                />
              </div>
            </div>

            {/* LINE Button */}
            <Link
              href="https://line.me/ti/p/@nattaauto"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full max-w-xs mx-auto items-center justify-center gap-3 rounded-lg bg-[#8BC43F] px-6 py-4 text-white transition hover:bg-[#7AB32F]"
            >
              <Image
                src={getImagePath("/images/logo/line 01 Icon-06.svg")}
                alt="LINE"
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <span className="font-semibold">@nattaauto</span>
            </Link>

            {/* Phone Button */}
            <Link
              href="tel:0625646455"
              className="mx-auto flex w-full max-w-xs items-center justify-center gap-3 rounded-lg bg-[#EF4444] px-6 py-4 text-white transition hover:bg-[#DC2626]"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="font-semibold">062-564-6455</span>
            </Link>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Facebook Button */}
          <Link
            href="https://www.facebook.com/thaanaat.k"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 rounded-lg bg-[#1877F2] px-6 py-4 text-white transition hover:bg-[#166FE5]"
          >
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <div className="text-left">
              <p className="font-semibold">V Autocar</p>
              <p className="text-sm opacity-90">thaanaat.k</p>
            </div>
          </Link>

          {/* TikTok Button */}
          <Link
            href="https://www.tiktok.com/@v_autocar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 rounded-lg bg-[#1a1a1a] px-6 py-4 text-white transition hover:bg-[#2a2a2a]"
          >
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
            <div className="text-left">
              <p className="font-semibold">V Autocar</p>
              <p className="text-sm opacity-90">thaanaat.k</p>
            </div>
          </Link>

          {/* YouTube Button */}
          <Link
            href="https://www.youtube.com/@nattaauto"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 rounded-lg bg-[#FF0000] px-6 py-4 text-white transition hover:bg-[#E60000]"
          >
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <div className="text-left">
              <p className="font-semibold">V Autocar</p>
              <p className="text-sm opacity-90">thaanaat.k</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Contact;
