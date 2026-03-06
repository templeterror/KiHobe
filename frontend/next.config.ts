import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
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
