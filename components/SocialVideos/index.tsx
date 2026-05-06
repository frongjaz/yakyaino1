"use client";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";

interface TikTokVideo {
  url: string;
}

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const TIKTOK_VIDEOS: TikTokVideo[] = [
  { url: "https://www.tiktok.com/@v_autocar/video/7456310987864526088" },
  { url: "https://www.tiktok.com/@v_autocar/video/7456310987864526088" },
  { url: "https://www.tiktok.com/@v_autocar/video/7281662392226925826" },
];

const getVideoId = (url: string) => url.match(/\/video\/(\d+)/)?.[1] ?? null;
const getUsername = (url: string) => url.match(/@([^/]+)/)?.[1] ?? "v_autocar";

const SocialVideos = () => {
  const [inView, setInView] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Only load TikTok embed when section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (scriptLoaded && typeof window !== "undefined" && window.tiktokEmbed) {
      const timer = setTimeout(() => window.tiktokEmbed?.lib.render(), 100);
      return () => clearTimeout(timer);
    }
  }, [scriptLoaded]);

  return (
    <section ref={sectionRef} className="bg-[#111111] py-16 md:py-20">
      {/* Load embed.js only after section is near viewport */}
      {inView && (
        <Script
          src="https://www.tiktok.com/embed.js"
          strategy="lazyOnload"
          onLoad={() => setScriptLoaded(true)}
        />
      )}

      <div className="container px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
            <TikTokIcon className="h-4 w-4 text-white/80" />
            <span className="text-sm font-medium text-white/50">@v_autocar</span>
          </div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">วิดีโอล่าสุดของเรา</h2>
          <p className="mt-2 text-sm text-white/60">คลิปรถมือสองคุณภาพดี อัปเดตสม่ำเสมอ</p>
        </div>

        {/* Videos */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {TIKTOK_VIDEOS.map((video, index) => {
            const videoId = getVideoId(video.url);
            const username = getUsername(video.url);
            return (
              <div key={index} className="flex justify-center">
                <div
                  className="w-full max-w-[340px] overflow-hidden rounded-2xl bg-[#1c1c1c] shadow-2xl ring-1 ring-white/8"
                  style={{ minHeight: "560px" }}
                >
                  {inView ? (
                    <blockquote
                      className="tiktok-embed"
                      cite={video.url}
                      data-video-id={videoId || undefined}
                      data-embed-from="embed_page"
                      style={{ maxWidth: "100%", minWidth: "100%", width: "100%" }}
                    >
                      <section>
                        <a
                          target="_blank"
                          rel="noreferrer"
                          title={`@${username}`}
                          href={`https://www.tiktok.com/@${username}?refer=embed`}
                        >
                          @{username}
                        </a>
                      </section>
                    </blockquote>
                  ) : (
                    // Placeholder while not in view
                    <div className="flex h-full min-h-[560px] items-center justify-center">
                      <TikTokIcon className="h-10 w-10 text-white/10" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a
            href="https://www.tiktok.com/@v_autocar"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-xl bg-white px-8 py-3.5 font-bold text-black shadow-lg transition hover:scale-105 hover:shadow-2xl"
          >
            <span className="relative flex h-6 w-6 shrink-0">
              <TikTokIcon className="absolute inset-0 h-6 w-6 translate-x-[1.5px] translate-y-[1.5px] text-[#69C9D0]" />
              <TikTokIcon className="absolute inset-0 h-6 w-6 -translate-x-[1.5px] -translate-y-[1.5px] text-[#EE1D52]" />
              <TikTokIcon className="relative h-6 w-6 text-black" />
            </span>
            ดูวิดีโอทั้งหมดบน TikTok
          </a>
        </div>
      </div>
    </section>
  );
};

declare global {
  interface Window {
    tiktokEmbed?: { lib: { render: () => void } };
  }
}

export default SocialVideos;
