import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dynamically set APP_BASE_URL for Render compatibility
  env: {
    APP_BASE_URL: process.env['RENDER_EXTERNAL_URL'] || process.env['AUTH0_BASE_URL'] || 'http://localhost:10000',
  },
};

export default nextConfig;
