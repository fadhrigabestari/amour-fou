"use client";

import Image from "next/image";
import Header from "@/components/Header";
import { useState, useEffect } from "react";

type Photo = {
  src: string;
  alt: string;
  orientation: "landscape" | "portrait";
};

const isValidPhoto = (item: unknown): item is Photo => {
  return (
    typeof item === "object" &&
    item !== null &&
    "src" in item &&
    "alt" in item &&
    "orientation" in item &&
    typeof (item as Photo).src === "string" &&
    typeof (item as Photo).alt === "string" &&
    ((item as Photo).orientation === "landscape" || (item as Photo).orientation === "portrait")
  );
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateCollageLayout = (landscapeCount: number, portraitCount: number) => {
  const items: Array<{
    photoIndex: number;
    size: string;
    row: number;
    col: number;
    rowSpan?: number;
    colSpan?: number;
  }> = [];
  
  const grid: boolean[][] = Array(8).fill(null).map(() => Array(12).fill(false));
  let landscapeIndex = 0;
  let portraitIndex = 0;
  
  const canPlacePhoto = (row: number, col: number, rowSpan: number, colSpan: number) => {
    if (row + rowSpan > 8 || col + colSpan > 12) return false;
    
    for (let r = row; r < row + rowSpan; r++) {
      for (let c = col; c < col + colSpan; c++) {
        if (grid[r][c]) return false;
      }
    }
    return true;
  };
  
  const placePhoto = (row: number, col: number, rowSpan: number, colSpan: number, size: string, orientation: "landscape" | "portrait") => {
    for (let r = row; r < row + rowSpan; r++) {
      for (let c = col; c < col + colSpan; c++) {
        grid[r][c] = true;
      }
    }
    
    const photoIndex = orientation === "landscape" 
      ? landscapeIndex % landscapeCount
      : landscapeCount + (portraitIndex % portraitCount);
    
    items.push({
      photoIndex,
      size: `${size}-${orientation}`,
      row: row + 1,
      col: col + 1,
      rowSpan: rowSpan > 1 ? rowSpan : undefined,
      colSpan: colSpan > 1 ? colSpan : undefined,
    });
    
    if (orientation === "landscape") {
      landscapeIndex++;
    } else {
      portraitIndex++;
    }
  };
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 12; col++) {
      if (grid[row][col]) continue;
      
      const rand = Math.random();
      const orientationRand = Math.random();
      const orientation = orientationRand < 0.5 ? "landscape" : "portrait";
      
      let placed = false;
      
      if (orientation === "landscape" && rand < 0.65 && canPlacePhoto(row, col, 1, 2)) {
        placePhoto(row, col, 1, 2, "medium", "landscape");
        placed = true;
      } else if (orientation === "portrait" && rand < 0.65 && canPlacePhoto(row, col, 2, 1)) {
        placePhoto(row, col, 2, 1, "medium", "portrait");
        placed = true;
      }
      
      if (!placed && canPlacePhoto(row, col, 1, 1)) {
        placePhoto(row, col, 1, 1, "small", orientation);
      }
    }
  }
  
  return items;
};

export default function Pictures() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [collageLayout, setCollageLayout] = useState<ReturnType<typeof generateCollageLayout>>([]);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch("/api/photos");
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        
        const data = await response.json();
        
        const landscapeData = Array.isArray(data.landscape) ? data.landscape.filter(isValidPhoto) : [];
        const portraitData = Array.isArray(data.portrait) ? data.portrait.filter(isValidPhoto) : [];
        
        const landscape = shuffleArray(landscapeData);
        const portrait = shuffleArray(portraitData);
        const photos = [...landscape, ...portrait] as Photo[];
        
        setAllPhotos(photos);
        setCollageLayout(generateCollageLayout(landscape.length, portrait.length));
        setIsMounted(true);
      } catch (error) {
        console.error("Failed to load photos");
      }
    };

    fetchPhotos();
  }, []);

  const handleImageLoad = (src: string) => {
    setLoadedImages(prev => new Set(prev).add(src));
  };

  const openLightbox = (index: number) => {
    if (index >= 0 && index < allPhotos.length) {
      setSelectedImage(index);
    }
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? allPhotos.length - 1 : selectedImage - 1);
    }
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === allPhotos.length - 1 ? 0 : selectedImage + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage !== null) {
        if (e.key === "ArrowLeft") goToPrevious();
        if (e.key === "ArrowRight") goToNext();
        if (e.key === "Escape") closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, allPhotos.length]);

  const getSizeClasses = (size: string) => {
    const baseClasses = "absolute";
    
    const sizeMap: Record<string, string> = {
      "small-landscape": "w-32 h-32",
      "small-portrait": "w-32 h-32",
      "medium-landscape": "w-64 h-32",
      "medium-portrait": "w-32 h-64"
    };

    return `${baseClasses} ${sizeMap[size] || "w-32 h-32"}`;
  };

  const getPosition = (row: number, col: number) => {
    const topOffset = (row - 1) * 128;
    const leftOffset = (col - 1) * 128;
    return { top: `${topOffset}px`, left: `${leftOffset}px` };
  };

  if (!isMounted || collageLayout.length === 0) {
    return (
      <div className="h-screen bg-rose-50 dark:bg-zinc-900">
        <Header />
        <main className="h-screen">
          <div className="relative h-full w-full overflow-hidden bg-slate-700" />
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen bg-rose-50 dark:bg-zinc-900">
      <Header />

      <main className="h-screen">
        <div className="relative h-full w-full overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="collage-wrapper">
              {Array.from({ length: 8 }).map((_, sectionIdx) => (
                <div
                  key={sectionIdx}
                  className="relative h-full w-[1536px] shrink-0"
                >
                  {collageLayout.map((item, idx) => {
                    const photo = allPhotos[item.photoIndex];
                    if (!photo) return null;
                    
                    const position = getPosition(item.row, item.col);
                    const isLoaded = loadedImages.has(photo.src);
                    
                    return (
                      <div
                        key={`${sectionIdx}-${idx}`}
                        className={getSizeClasses(item.size)}
                        style={position}
                      >
                        <div className={`absolute inset-0 bg-[#9CAF88] transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100 shimmer'}`} />
                        <Image
                          className={`h-full w-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          sizes="(max-width: 256px) 128px, 256px"
                          onLoad={() => handleImageLoad(photo.src)}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-center h-full bg-gradient-to-b from-black/50 via-black/40 to-black/50 dark:from-black/60 dark:via-black/50 dark:to-black/60">
            <h1 className="text-center font-serif text-7xl font-bold text-white drop-shadow-2xl">
              Our Gallery
            </h1>
          </div>
        </div>
      </main>

      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 text-4xl text-white hover:text-rose-300"
            aria-label="Close lightbox"
          >
            ×
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 text-4xl text-white hover:text-rose-300"
            aria-label="Previous image"
          >
            ‹
          </button>

          <div className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {!loadedImages.has(allPhotos[selectedImage].src) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
            <Image
              className={`object-contain transition-opacity duration-300 ${loadedImages.has(allPhotos[selectedImage].src) ? 'opacity-100' : 'opacity-0'}`}
              src={allPhotos[selectedImage].src}
              alt={allPhotos[selectedImage].alt}
              fill
              sizes="100vw"
              priority
              onLoad={() => handleImageLoad(allPhotos[selectedImage].src)}
            />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 text-4xl text-white hover:text-rose-300"
            aria-label="Next image"
          >
            ›
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
            {selectedImage + 1} / {allPhotos.length}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes scroll-collage {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-9216px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .collage-wrapper {
          display: flex;
          position: absolute;
          animation: scroll-collage 360s linear infinite;
        }

        .shimmer {
          background: linear-gradient(
            90deg,
            #9CAF88 0%,
            #B8C9A4 50%,
            #9CAF88 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}