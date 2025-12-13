"use client";

import { useState } from "react";
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

  const thumbs = images.slice(0, 3);
  const remaining = Math.max(totalPhotos - 3, 0);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[3fr_2fr]">
      {/* ================= LEFT : MAIN IMAGE ================= */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md">
        <Image
          src={getImagePath(selectedImage)}
          alt="Car main"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* ================= RIGHT : THUMBNAILS ================= */}
      <div className="grid grid-cols-2 gap-3">
        {/* top row */}
        {thumbs.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className="relative aspect-[16/10] w-full overflow-hidden rounded-md hover:opacity-90"
          >
            <Image
              src={getImagePath(img)}
              alt={`thumb ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}

        {/* bottom right : + more */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md">
          <Image
            src={getImagePath(images[3] || initialImage)}
            alt="more photos"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
            <span className="text-lg font-semibold text-white">
              +{remaining}
            </span>
            <span className="text-xs text-white">more photos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
