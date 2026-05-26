import { HERO_PRODUCTS_IMAGE } from "@/lib/site-images";

const BANNER_WIDTH = 2496;
const BANNER_HEIGHT = 364;

export function HeroBanner() {
  return (
    <div className="pp-hero-banner relative -mx-4 overflow-hidden sm:-mx-8 lg:-mx-12">
      {/* eslint-disable-next-line @next/next/no-img-element -- URL firmada de GitBook; mejor compatibilidad con img nativo */}
      <img
        src={HERO_PRODUCTS_IMAGE}
        alt="Productos Punto Pago: tarjeta de crédito, adelantos de saldo, línea de crédito y pago con cuotas"
        width={BANNER_WIDTH}
        height={BANNER_HEIGHT}
        decoding="async"
        fetchPriority="high"
        className="block h-auto w-full max-w-none object-cover object-center"
      />
    </div>
  );
}
