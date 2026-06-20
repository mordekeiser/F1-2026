import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [],
    unoptimized: true, // allows local /public images without extra config
  },
};

export default nextConfig;
