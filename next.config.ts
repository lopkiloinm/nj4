import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // Static export configuration for GitHub Pages
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  // Dynamic configuration for GitHub Pages
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  
  // Image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Ensure proper handling of static assets
  generateEtags: false,
  
  // Disable powered by header for security
  poweredByHeader: false,
};

export default nextConfig;
