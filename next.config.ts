import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "puntopago.net" },
      { protocol: "https", hostname: "comercios.puntopago.net" },
      { protocol: "https", hostname: "intercom.help" },
      { protocol: "https", hostname: "downloads.intercomcdn.com" },
      { protocol: "https", hostname: "images.gitbook.com" },
      { protocol: "https", hostname: "files.gitbook.com" },
      { protocol: "https", hostname: "content.gitbook.com" },
      { protocol: "https", hostname: "3686210280-files.gitbook.io" },
    ],
  },
};

export default nextConfig;
