import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d8guwbw7auosl.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
