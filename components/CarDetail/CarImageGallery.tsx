"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getImagePath } from "@/lib/utils";

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

  // Filter out empty images and ensure we have valid images
  const validImages = images.filter(img => img && img.trim() !== '');
  const thumbs = validImages.slice(0, 3);
  // Use totalPhotos from database instead of calculating from array length
  const remaining = Math.max(totalPhotos - 3, 0);

  // Handle keyboard navigation in modal
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

  const openModal = (startIndex: number = 3) => {
    setModalSelectedIndex(startIndex);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[3fr_2fr]">
      {/* ================= LEFT : MAIN IMAGE ================= */}
      <button
        onClick={() => {
          const imageIndex = validImages.indexOf(selectedImage);
          if (imageIndex >= 0) {
            openModal(imageIndex);
          }
        }}
        className="relative aspect-[16/10] w-full overflow-hidden rounded-md hover:opacity-95 transition-opacity cursor-pointer"
      >
        <Image
          src={getImagePath(selectedImage)}
          alt="Car main"
          fill
          priority
          className="object-cover"
        />
      </button>

      {/* ================= RIGHT : THUMBNAILS ================= */}
      <div className="grid grid-cols-2 gap-3">
        {/* top row */}
        {thumbs.map((img, index) => {
          const imageIndex = validImages.indexOf(img);
          return (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              onDoubleClick={() => openModal(imageIndex)}
              className="relative aspect-[16/10] w-full overflow-hidden rounded-md hover:opacity-90 transition-opacity"
            >
              <Image
                src={getImagePath(img)}
                alt={`thumb ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          );
        })}

        {/* bottom right : + more */}
        {remaining > 0 && (
          <button
            onClick={() => openModal(3)}
            className="relative aspect-[16/10] w-full overflow-hidden rounded-md cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Image
              src={getImagePath(validImages[3] || initialImage)}
              alt="more photos"
              fill
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 hover:bg-black/70 transition-colors">
              <span className="text-lg font-semibold text-white">
                +{remaining}
              </span>
              <span className="text-xs text-white">more photos</span>
            </div>
          </button>
        )}
      </div>

      {/* Image Modal/Lightbox */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            aria-label="Close modal"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Previous Button */}
          {modalSelectedIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setModalSelectedIndex(modalSelectedIndex - 1);
              }}
              className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
              aria-label="Previous image"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {modalSelectedIndex < Math.min(totalPhotos - 1, validImages.length - 1) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setModalSelectedIndex(modalSelectedIndex + 1);
              }}
              className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
              aria-label="Next image"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {/* Main Image */}
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
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-900">
                <p className="text-white">รูปภาพกำลังโหลด...</p>
              </div>
            )}
          </div>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-white shadow-lg">
            {modalSelectedIndex + 1} / {totalPhotos}
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-8 pb-4">
            <div className="container mx-auto px-4">
              <div 
                className="flex items-center justify-center gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-white/50"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent',
                }}
              >
                {Array.from({ length: totalPhotos }, (_, index) => {
                  const img = validImages[index];
                  return (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (img) {
                          setModalSelectedIndex(index);
                        }
                      }}
                      disabled={!img}
                      className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 transform hover:scale-105 ${
                        !img
                          ? 'border-white/10 opacity-30 cursor-not-allowed'
                          : index === modalSelectedIndex
                          ? 'border-white shadow-lg shadow-white/30 scale-105 ring-2 ring-white/50'
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
                          />
                          {index === modalSelectedIndex && (
                            <div className="absolute inset-0 bg-white/10"></div>
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
    </div>
  );
}
