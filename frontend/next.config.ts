import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PWA: add serwist or next-pwa here once icons are ready
  // For now: basic config only
  async redirects() {
    if (process.env.NODE_ENV !== "production") return [];
    return [
      {
        source: "/",
        destination: "/waitlist",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
