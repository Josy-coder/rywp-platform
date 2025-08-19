import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://colorless-leopard-579.convex.cloud/**')],
  },
  reactStrictMode: true,
};

export default nextConfig;
