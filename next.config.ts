import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: process.env.NODE_ENV === "production" ? "/Hirehired" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/Hirehired" : "",
};

export default nextConfig;
