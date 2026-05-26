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
  async redirects() {
    return [
      {
        source: "/articulo/pago-a-cuotas-app/pago-a-cuotas-en-la-app",
        destination: "/articulo/bcl-pago-con-credito/bcl-pago-con-credito-en-la-app",
        permanent: true,
      },
      {
        source: "/articulo/pago-a-cuotas-app/diferencia-cuotas-app-vs-comercios",
        destination: "/articulo/bcl-pago-con-credito/tres-servicios-de-cuotas",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
