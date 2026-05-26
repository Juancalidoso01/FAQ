import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "puntopago.net" },
      { protocol: "https", hostname: "intercom.help" },
      { protocol: "https", hostname: "downloads.intercomcdn.com" },
    ],
  },
};

export default nextConfig;
