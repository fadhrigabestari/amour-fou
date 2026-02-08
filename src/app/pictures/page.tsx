"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import Image from "next/image";

type MatchedPhoto = {
  src: string;
  similarity: number;
  selected?: boolean;
};

export default function FindYourPicture() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [matches, setMatches] = useState<MatchedPhoto[]>([]);
  const [error, setError] = useState<string>("");
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const ITEMS_PER_PAGE = 9;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  
  const totalPages = Math.ceil(matches.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMatches = matches.slice(startIndex, endIndex);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError("");
    setMatches([]);
    setCurrentPage(0);
  };

  const handleImageLoad = (src: string) => {
    setLoadedImages(prev => new Set(prev).add(src));
  };

  const handleSearch = async () => {
    if (!selectedFile) return;

    setIsSearching(true);
    setError("");
    setMatches([]);
    setLoadedImages(new Set());
    setCurrentPage(0);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("/api/search-face", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Search failed");
      }

      const data = await response.json();
      setMatches((data.matches || []).map((m: MatchedPhoto) => ({ ...m, selected: false })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search for photos. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl("");
    setMatches([]);
    setError("");
    setLoadedImages(new Set());
    setCurrentPage(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const toggleSelectPhoto = (index: number) => {
    setMatches(prev => prev.map((match, i) => 
      i === startIndex + index ? { ...match, selected: !match.selected } : match
    ));
  };

  const downloadImage = async (url: string, filename: string) => {
    const response = await fetch(`/api/download-image?url=${encodeURIComponent(url)}`);
    if (!response.ok) throw new Error("Download failed");
    
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    }, 100);
  };

  const handleDownloadSelected = async () => {
    const selectedPhotos = matches.filter(match => match.selected);
    if (selectedPhotos.length === 0) return;

    setIsDownloading(true);
    setError("");

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const canUseWebShare =
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function";

    for (const photo of selectedPhotos) {
      try {
        const filename = photo.src.split('/').pop()?.split(':').pop() || 'photo.jpg';

        if (isMobile && canUseWebShare) {
          const response = await fetch(`/api/download-image?url=${encodeURIComponent(photo.src)}`);
          if (!response.ok) throw new Error("Fetch failed");

          const blob = await response.blob();
          const file = new File([blob], filename, { type: blob.type });
          
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'Wedding Photo',
            });
          }
        } else {
          await downloadImage(photo.src, filename);
        }

        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (err) {
        setError("Some photos failed to download");
        break;
      }
    }

    setIsDownloading(false);
  };

  const selectedCount = matches.filter(m => m.selected).length;

  return (
    <div className="min-h-screen bg-[#C9D5B5]">
      <Header />

      <main className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-zinc-900 mb-4">
              Find Your Photos
            </h1>
            <p className="text-lg font-serif text-zinc-700">
              Upload a photo of yourself to find your pictures from our wedding
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              {!previewUrl ? (
                <div className="space-y-4">
                  <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-zinc-300 rounded-xl cursor-pointer hover:border-[#4A5D3F] transition-colors">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-zinc-400 mb-4"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="text-zinc-900 mb-2">Click to upload your photo</p>
                      <p className="text-sm text-zinc-500">PNG, JPG up to 5MB</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  </label>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-zinc-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-zinc-500">or</span>
                    </div>
                  </div>

                  <label className="flex items-center justify-center h-14 border-2 border-zinc-300 rounded-xl cursor-pointer hover:border-[#4A5D3F] transition-colors">
                    <svg
                      className="h-6 w-6 text-zinc-400 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-zinc-900">Take a Photo</span>
                    <input
                      ref={cameraInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      capture="user"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative h-64 rounded-xl overflow-hidden">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="flex-1 bg-[#4A5D3F] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#3D4E34] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSearching ? "Searching..." : "Search Photos"}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={isSearching}
                      className="px-6 py-3 border-2 border-zinc-300 text-zinc-900 rounded-xl font-semibold hover:border-zinc-400 transition-colors disabled:opacity-50"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>

          {matches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6 min-h-[3rem]">
                <h2 className="text-2xl font-serif text-zinc-900">
                  Found {matches.length} photo{matches.length !== 1 ? "s" : ""}
                </h2>
                <div className="min-w-[120px]">
                  {selectedCount > 0 && (
                    <button
                      type="button"
                      onClick={handleDownloadSelected}
                      disabled={isDownloading}
                      className="bg-[#4A5D3F] text-white py-2 px-6 rounded-xl hover:bg-[#3D4E34] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDownloading ? "Saving..." : `Save ${selectedCount}`}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {currentMatches.map((match, idx) => {
                  const isLoaded = loadedImages.has(match.src);
                  
                  return (
                    <div
                      key={`${match.src}-${idx}`}
                      onClick={() => toggleSelectPhoto(idx)}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
                        match.selected ? "ring-4 ring-[#4A5D3F]" : ""
                      }`}
                    >
                      <div className={`absolute inset-0 bg-[#9CAF88] transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100 shimmer'}`} />
                      <Image
                        src={match.src}
                        alt={`Match ${startIndex + idx + 1}`}
                        fill
                        className={`object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        onLoad={() => handleImageLoad(match.src)}
                      />
                      {match.selected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#4A5D3F] rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 border-2 border-zinc-300 text-zinc-900 rounded-lg hover:border-zinc-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-zinc-900">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="px-4 py-2 border-2 border-zinc-300 text-zinc-900 rounded-lg hover:border-zinc-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {!isSearching && matches.length === 0 && previewUrl && !error && (
            <div className="mt-6 text-center">
              <p className="text-zinc-600">
                Click &quot;Search Photos&quot; to find your pictures
              </p>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
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