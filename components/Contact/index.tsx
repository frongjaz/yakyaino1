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
      {/* Full-width Map */}
      <div className="mb-8 w-full">
        <div
          ref={mapContainerRef}
          className="relative h-[400px] w-full rounded-lg border border-gray-300 overflow-hidden md:h-[450px] lg:h-[500px]"
          style={{ zIndex: 0 }}
        ></div>
      </div>
      
      <div className="container px-4">

        <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left side - Map and Address */}
          <div className="space-y-6">

            {/* Detailed Location Map */}
            <div className="relative h-[200px] w-full rounded-lg border border-gray-300 bg-gray-100 md:h-[250px]">
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-400">แผนที่ย่อ</p>
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
          <div className="hidden lg:block absolute left-[52%] top-0 bottom-0 w-px bg-gray-300"></div>

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
              href="https://line.me"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-1/3 mx-auto items-center justify-center gap-3 rounded-lg bg-[#8BC43F] px-6 py-4 text-white transition hover:bg-[#7AB32F]"
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
              className="mx-auto flex w-1/3 items-center justify-center gap-3 rounded-lg bg-[#EF4444] px-6 py-4 text-white transition hover:bg-[#DC2626]"
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

      </div>
    </section>
  );
};

export default Contact;
