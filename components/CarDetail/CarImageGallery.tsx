"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getImagePath, IMAGE_PLACEHOLDER } from "@/lib/utils";

interface CarImageGalleryProps {
  mainImage: string;
  images: string[];
  totalPhotos: number;
}

export default function CarImageGallery({
  mainImage,
  images,
  totalPhotos,
}: CarImageGalleryProps) {
  const initialImage = mainImage || images[0];
  const [selectedImage, setSelectedImage] = useState(initialImage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSelectedIndex, setModalSelectedIndex] = useState(0);

  const validImages = images.filter(img => img && img.trim() !== '');
  const thumbs = validImages.slice(0, 3);
  const remaining = Math.max(totalPhotos - 3, 0);

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      } else if (e.key === 'ArrowLeft' && modalSelectedIndex > 0) {
        setModalSelectedIndex(modalSelectedIndex - 1);
      } else if (e.key === 'ArrowRight' && modalSelectedIndex < Math.min(totalPhotos - 1, validImages.length - 1)) {
        setModalSelectedIndex(modalSelectedIndex + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, modalSelectedIndex, totalPhotos, validImages.length]);

  const openModal = (startIndex: number = 0) => {
    setModalSelectedIndex(startIndex);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      {/* ===== GALLERY ===== */}
      <div className="flex flex-col gap-2 md:flex-row md:items-stretch">

        {/* Main Image */}
        <button
          onClick={() => {
            const idx = validImages.indexOf(selectedImage);
            openModal(idx >= 0 ? idx : 0);
          }}
          className="relative w-full md:flex-1 overflow-hidden rounded-xl bg-gray-100 cursor-zoom-in group"
          style={{ aspectRatio: "16/9", maxHeight: "480px" }}
        >
          <Image
            src={getImagePath(selectedImage)}
            alt="Car main"
            fill
            priority
            className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              if (t && t.src !== IMAGE_PLACEHOLDER) t.src = IMAGE_PLACEHOLDER;
            }}
          />
          {/* hover badge */}
          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm pointer-events-none">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            ขยาย
          </span>
        </button>

        {/* Thumbnail strip — แนวตั้งบน desktop, แนวนอนบน mobile */}
        <div className="flex flex-row gap-2 md:flex-col md:w-[140px] md:max-h-[480px]">
          {thumbs.map((img, index) => {
            const isSelected = img === selectedImage;
            return (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                onDoubleClick={() => openModal(validImages.indexOf(img))}
                className={`relative flex-1 md:flex-none overflow-hidden rounded-lg bg-gray-100 transition-all duration-200 ${
                  isSelected
                    ? "ring-2 ring-[#EF4444] ring-offset-1 opacity-100"
                    : "opacity-55 hover:opacity-90"
                }`}
                style={{ aspectRatio: "4/3" }}
              >
                <Image
                  src={getImagePath(img)}
                  alt={`thumb ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="140px"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    if (t && t.src !== IMAGE_PLACEHOLDER) t.src = IMAGE_PLACEHOLDER;
                  }}
                />
              </button>
            );
          })}

          {remaining > 0 && (
            <button
              onClick={() => openModal(3)}
              className="relative flex-1 md:flex-none overflow-hidden rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"
              style={{ aspectRatio: "4/3" }}
            >
              {validImages[3] && (
                <Image
                  src={getImagePath(validImages[3])}
                  alt="more"
                  fill
                  className="object-contain opacity-25"
                  sizes="140px"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    if (t && t.src !== IMAGE_PLACEHOLDER) t.src = IMAGE_PLACEHOLDER;
                  }}
                />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-gray-600">+{remaining}</span>
                <span className="text-xs text-gray-500">รูปเพิ่มเติม</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* ===== LIGHTBOX MODAL ===== */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeModal}
        >
          {/* Close */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            aria-label="Close modal"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev */}
          {modalSelectedIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setModalSelectedIndex(modalSelectedIndex - 1); }}
              className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
              aria-label="Previous image"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next */}
          {modalSelectedIndex < Math.min(totalPhotos - 1, validImages.length - 1) && (
            <button
              onClick={(e) => { e.stopPropagation(); setModalSelectedIndex(modalSelectedIndex + 1); }}
              className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
              aria-label="Next image"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Main Modal Image */}
          <div
            className="relative h-full w-full max-h-[85vh] max-w-[90vw] pb-32"
            onClick={(e) => e.stopPropagation()}
          >
            {validImages[modalSelectedIndex] ? (
              <Image
                src={getImagePath(validImages[modalSelectedIndex])}
                alt={`Car image ${modalSelectedIndex + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
                priority
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  if (t && t.src !== IMAGE_PLACEHOLDER) t.src = IMAGE_PLACEHOLDER;
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-900">
                <p className="text-white">รูปภาพกำลังโหลด...</p>
              </div>
            )}
          </div>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-white shadow-lg">
            {modalSelectedIndex + 1} / {totalPhotos}
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-8 pb-4">
            <div className="container mx-auto px-4">
              <div
                className="flex items-center justify-center gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-thumb]:rounded-full"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.3) transparent' }}
              >
                {Array.from({ length: totalPhotos }, (_, index) => {
                  const img = validImages[index];
                  return (
                    <button
                      key={index}
                      onClick={(e) => { e.stopPropagation(); if (img) setModalSelectedIndex(index); }}
                      disabled={!img}
                      className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                        !img
                          ? 'border-white/10 opacity-30 cursor-not-allowed'
                          : index === modalSelectedIndex
                          ? 'border-white scale-105 ring-2 ring-white/50'
                          : 'border-white/30 opacity-70 hover:opacity-100 hover:border-white/60'
                      }`}
                    >
                      {img ? (
                        <>
                          <Image
                            src={getImagePath(img)}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="112px"
                            onError={(e) => {
                              const t = e.target as HTMLImageElement;
                              if (t && t.src !== IMAGE_PLACEHOLDER) t.src = IMAGE_PLACEHOLDER;
                            }}
                          />
                          {index === modalSelectedIndex && (
                            <div className="absolute inset-0 bg-white/10" />
                          )}
                        </>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-800">
                          <span className="text-xs text-white/50">{index + 1}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
