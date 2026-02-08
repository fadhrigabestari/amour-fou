"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Image from "next/image";

type MatchedPhoto = {
  src: string;
  similarity: number;
};

export default function FindYourPicture() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [matches, setMatches] = useState<MatchedPhoto[]>([]);
  const [error, setError] = useState<string>("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError("");
    setMatches([]);
  };

  const handleSearch = async () => {
    if (!selectedFile) return;

    setIsSearching(true);
    setError("");
    setMatches([]);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("/api/search-face", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setMatches(data.matches || []);
    } catch (err) {
      setError("Failed to search for photos. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setMatches([]);
    setError("");
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">
              Find Your Photos
            </h1>
            <p className="text-lg text-gray-300">
              Upload a photo of yourself to find all pictures from our wedding
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-zinc-900 rounded-2xl p-8 shadow-2xl">
              {!previewUrl ? (
                <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer hover:border-[#9CAF88] transition-colors">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
                    <p className="text-white mb-2">Click to upload your photo</p>
                    <p className="text-sm text-gray-400">PNG, JPG up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </label>
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
                      className="flex-1 bg-[#9CAF88] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#8A9F78] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSearching ? "Searching..." : "Search Photos"}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={isSearching}
                      className="px-6 py-3 border-2 border-zinc-700 text-white rounded-xl font-semibold hover:border-zinc-600 transition-colors disabled:opacity-50"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-900 rounded-xl">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>

          {matches.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-serif font-bold text-white mb-6 text-center">
                Found {matches.length} photo{matches.length !== 1 ? "s" : ""}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((match, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                  >
                    <div className="relative h-64">
                      <Image
                        src={match.src}
                        alt={`Match ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-white text-sm">
                        Match: {Math.round(match.similarity)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isSearching && matches.length === 0 && previewUrl && !error && (
            <div className="mt-12 text-center">
              <p className="text-gray-400">
                Click &quot;Search Photos&quot; to find your pictures
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}