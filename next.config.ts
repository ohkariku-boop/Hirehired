import type { NextConfig } from "next";

/**
 * - Vercel: standard Next.js (VERCEL=1). No static export.
 * - GitHub Pages: set STATIC_EXPORT=1 and NEXT_PUBLIC_BASE_PATH=/Hirehired
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const isStatic =
  process.env.STATIC_EXPORT === "1" || Boolean(basePath);

const nextConfig: NextConfig = {
  ...(isStatic ? { output: "export" as const } : {}),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
