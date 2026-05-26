import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "puntopago.net" },
      { protocol: "https", hostname: "comercios.puntopago.net" },
      { protocol: "https", hostname: "guia.puntopago.net" },
      { protocol: "https", hostname: "intercom.help" },
      { protocol: "https", hostname: "downloads.intercomcdn.com" },
      { protocol: "https", hostname: "images.gitbook.com" },
      { protocol: "https", hostname: "files.gitbook.com" },
      { protocol: "https", hostname: "content.gitbook.com" },
      { protocol: "https", hostname: "3686210280-files.gitbook.io" },
      { protocol: "https", hostname: "837792458-files.gitbook.io" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/articulo/pago-a-cuotas-app/pago-a-cuotas-en-la-app",
        destination: "/articulo/linea-credito/linea-de-credito",
        permanent: true,
      },
      {
        source: "/articulo/pago-a-cuotas-app/diferencia-cuotas-app-vs-comercios",
        destination: "/articulo/cuotas-debito/pago-con-cuotas",
        permanent: true,
      },
      {
        source: "/articulo/bcl-pago-con-credito/:path*",
        destination: "/articulo/linea-credito/linea-de-credito",
        permanent: true,
      },
      {
        source: "/articulo/cuotas-debito/cuotas-con-tarjeta-debito",
        destination: "/articulo/cuotas-debito/pago-con-cuotas",
        permanent: true,
      },
      {
        source: "/articulo/adquiere-tu-mastercard/dreamcard-la-tarjeta-de-credito-de-punto-pago",
        destination: "/articulo/dreamcard/dreamcard",
        permanent: true,
      },
      {
        source: "/articulo/recarga-tu-app/recarga-tu-app",
        destination: "/articulo/recarga-app/recarga-app",
        permanent: true,
      },
      {
        source: "/articulo/recarga-tu-app/recargar-tu-billetera",
        destination: "/articulo/recarga-app/recarga-app",
        permanent: true,
      },
      {
        source: "/articulo/recarga-tu-app/transferencia-bancaria-ach",
        destination: "/articulo/recarga-app/recarga-app-ach",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
