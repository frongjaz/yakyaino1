"use client";
import { getImagePath } from "@/lib/utils";
import { apiGet } from "@/lib/api";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

interface Banner {
  id: number;
  image_url: string;
  alt_text: string;
  sort_order: number;
  is_active: number;
}

const FALLBACK: Banner = {
  id: 0,
  image_url: "/images/hero/HomeBanner.webp",
  alt_text: "ขายรถให้เรา... จบไวภายใน 15 นาที",
  sort_order: 0,
  is_active: 1,
};

const Hero = () => {
  const [slides, setSlides] = useState<Banner[]>([FALLBACK]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    apiGet<{ success: boolean; data: Banner[] }>('/api/banners')
      .then(res => {
        if (res.success && res.data?.length > 0) setSlides(res.data);
      })
      .catch(() => {});
  }, []);

  const next = useCallback(() => setCurrentSlide(i => (i + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrentSlide(i => (i - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [slides.length, next]);

  const slide = slides[currentSlide] ?? FALLBACK;

  const BannerImage = (
    <div className="relative w-full max-w-full">
      {/* Mobile */}
      <div className="relative block w-full md:hidden">
        <Image
          src={getImagePath(slide.image_url)}
          alt={slide.alt_text}
          width={1200}
          height={675}
          priority
          className="h-auto w-full object-contain object-center"
          sizes="100vw"
        />
      </div>
      {/* Desktop */}
      <div className="hidden md:block relative h-[400px] w-full lg:h-[500px] xl:h-[600px]">
        <Image
          src={getImagePath(slide.image_url)}
          alt={slide.alt_text}
          fill
          priority
          className="h-full w-full object-cover object-center"
          sizes="100vw"
        />
      </div>
    </div>
  );

  return (
    <section id="home" className="pt-[82px] md:pt-[90px] lg:pt-0">
      <div className="relative w-full max-w-full overflow-hidden">
        {BannerImage}

        {/* Arrows — แสดงเมื่อมีมากกว่า 1 slide */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/20 p-3 text-white transition hover:bg-white/30 backdrop-blur-sm lg:left-8"
              aria-label="Previous slide"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/20 p-3 text-white transition hover:bg-white/30 backdrop-blur-sm lg:right-8"
              aria-label="Next slide"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        {/* Dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all ${i === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
