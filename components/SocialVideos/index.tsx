"use client";
import { useEffect, useState } from "react";
import Script from "next/script";

interface TikTokVideo {
  url: string;
  title: string;
  thumbnail?: string;
}

const SocialVideos = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const tiktokVideos: TikTokVideo[] = [
    {
      url: "https://www.tiktok.com/@v_autocar/video/7456310987864526088",
      title: "",
    },
    {
      url: "https://www.tiktok.com/@v_autocar/video/7281662392226925826",
      title: "",
    },
    {
      url: "https://www.tiktok.com/@v_autocar/video/7281662392226925826",
      title: "",
    },
  ];


  // ฟังก์ชันสำหรับดึง video ID จาก URL
  const getVideoId = (url: string) => {
    const match = url.match(/\/video\/(\d+)/);
    return match ? match[1] : null;
  };

  // ฟังก์ชันสำหรับดึง username และ video ID จาก URL
  const getTikTokEmbedUrl = (url: string) => {
    const match = url.match(/@([^/]+)\/video\/(\d+)/);
    if (match) {
      return `https://www.tiktok.com/@${match[1]}/video/${match[2]}`;
    }
    return url;
  };

  // ฟังก์ชันสำหรับดึง username จาก URL
  const getUsername = (url: string) => {
    const match = url.match(/@([^/]+)/);
    return match ? match[1] : "v_autocar";
  };

  // Render embed เมื่อ script โหลดเสร็จ
  useEffect(() => {
    if (scriptLoaded && typeof window !== "undefined" && window.tiktokEmbed) {
      const timer = setTimeout(() => {
        window.tiktokEmbed?.lib.render();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [scriptLoaded]);

  return (
    <section className="bg-[#2C2C2C] py-16 md:py-20">
      <Script
        src="https://www.tiktok.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          setScriptLoaded(true);
        }}
      />
      <div className="container px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiktokVideos.map((video, index) => {
            const videoId = getVideoId(video.url);
            const embedUrl = getTikTokEmbedUrl(video.url);

            return (
              <div key={index} className="flex justify-center">
                <div className="relative h-[500px] w-full min-w-[325px] max-w-[400px] overflow-hidden rounded-lg flex items-center justify-center">
                  <blockquote
                    className="tiktok-embed"
                    cite={embedUrl}
                    data-video-id={videoId || undefined}
                    data-embed-from="embed_page"
                    style={{
                      maxWidth: "605px",
                      minWidth: "325px",
                      width: "100%",
                    }}
                  >
                    <section>
                      <a
                        target="_blank"
                        title={`@${getUsername(video.url)}`}
                        href={`https://www.tiktok.com/@${getUsername(video.url)}?refer=embed`}
                      >
                        @{getUsername(video.url)}
                      </a>
                    </section>
                  </blockquote>
                </div>
              </div>
            );
          })}
        </div>

        {/* TikTok Button */}
        <div className="mt-8 text-center">
          <a
            href="https://www.tiktok.com/@v_autocar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[#EF4444] bg-[#1a1a1a] px-6 py-3 font-semibold text-white transition hover:bg-[#2a2a2a]"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-white"
            >
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
            # TIKTOK
          </a>
        </div>
      </div>
    </section>
  );
};

// เพิ่ม type declaration สำหรับ window.tiktokEmbed
declare global {
  interface Window {
    tiktokEmbed?: {
      lib: {
        render: () => void;
      };
    };
  }
}

export default SocialVideos;

