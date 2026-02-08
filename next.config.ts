import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'amour-fou-bucket.s3.ap-southeast-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
