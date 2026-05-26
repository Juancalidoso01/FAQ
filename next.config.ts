import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "puntopago.net" },
      { protocol: "https", hostname: "comercios.puntopago.net" },
      { protocol: "https", hostname: "intercom.help" },
      { protocol: "https", hostname: "downloads.intercomcdn.com" },
      { protocol: "https", hostname: "*.gitbook.io" },
    ],
  },
};

export default nextConfig;
