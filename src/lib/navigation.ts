import {
  articlePath,
  categoryPath,
  getAllCategories,
  getArticle,
  getCategory,
  type FaqCategory,
} from "@/lib/faq";

export type FaqAudience = "cliente" | "empresa";

export type FaqNavLink = {
  title: string;
  href: string;
  external?: boolean;
};

export type FaqNavGroup = {
  id: string;
  audience: FaqAudience;
  title: string;
  description: string;
  /** Incluye todos los artículos de estas categorías existentes. */
  categorySlugs?: string[];
  /** Artículos puntuales (categorySlug + articleSlug). */
  articleRefs?: Array<{ categorySlug: string; articleSlug: string }>;
  /** Enlaces externos cuando aún no hay artículos en el FAQ. */
  links?: FaqNavLink[];
};

export type FaqNavSection = {
  id: FaqAudience;
  title: string;
  description: string;
  groups: FaqNavGroup[];
};

export type FaqNavItem = {
  title: string;
  href: string;
  categorySlug: string;
  articleSlug: string;
};

export type FaqNavGroupResolved = FaqNavGroup & {
  items: FaqNavItem[];
};

export const FAQ_NAV: FaqNavSection[] = [
  {
    id: "cliente",
    title: "Para clientes",
    description: "Productos financieros, recargas y soporte de la app Punto Pago.",
    groups: [
      {
        id: "tarjeta-credito",
        audience: "cliente",
        title: "Tarjeta de crédito",
        description:
          "Comienza a construir tu historial crediticio con la tarjeta de crédito Punto Pago, sin anualidad de por vida.",
        categorySlugs: ["adquiere-tu-mastercard"],
        articleRefs: [
          { categorySlug: "aumento-de-credito", articleSlug: "solicitud-de-aumento-de-limite-de-credito" },
          { categorySlug: "terminos-y-condiciones", articleSlug: "tarjeta-mastercard-punto-pago" },
          { categorySlug: "terminos-y-condiciones", articleSlug: "limites-de-tu-tarjeta-punto-pago" },
        ],
      },
      {
        id: "adelantos-saldo",
        audience: "cliente",
        title: "Adelantos de saldo",
        description:
          "Paga y recarga tus servicios con un adelanto de saldo hoy y devuélvelo en 15 días.",
        articleRefs: [
          { categorySlug: "nuestros-servicios", articleSlug: "preguntas-frecuentes-faq" },
          { categorySlug: "nuestros-servicios", articleSlug: "links-para-interactuar-con-nuestra-app" },
        ],
        links: [
          { title: "Descargar app Punto Pago", href: "https://puntopago.net/", external: true },
        ],
      },
      {
        id: "linea-credito",
        audience: "cliente",
        title: "Línea de crédito",
        description:
          "Usa tu línea de crédito para pagar facturas y servicios en Punto Pago.",
        categorySlugs: ["aumento-de-credito"],
        articleRefs: [
          { categorySlug: "terminos-y-condiciones", articleSlug: "terminos-y-condiciones-prestamos" },
        ],
      },
      {
        id: "pago-cuotas-cliente",
        audience: "cliente",
        title: "Pago con cuotas",
        description:
          "Compra con tu tarjeta de débito o virtual, incluso cuando no tienes saldo disponible.",
        articleRefs: [
          { categorySlug: "terminos-y-condiciones", articleSlug: "terminos-y-condiciones-a-cuotas" },
        ],
      },
      {
        id: "recarga-billetera",
        audience: "cliente",
        title: "Recarga y billetera",
        description: "Formas de recargar saldo en tu wallet Punto Pago.",
        categorySlugs: ["recarga-tu-app"],
      },
      {
        id: "app-servicios",
        audience: "cliente",
        title: "App y servicios",
        description: "Kioscos, pagos, giros y funciones de la app.",
        categorySlugs: ["nuestros-servicios"],
      },
      {
        id: "terminos-cliente",
        audience: "cliente",
        title: "Términos y condiciones",
        description: "Políticas legales de productos para usuarios.",
        articleRefs: [
          { categorySlug: "terminos-y-condiciones", articleSlug: "terminos-y-condiciones-tarjeta-prepago" },
          { categorySlug: "terminos-y-condiciones", articleSlug: "paypal-nuevo-metodo-de-recarga" },
        ],
      },
      {
        id: "soporte-cliente",
        audience: "cliente",
        title: "Soporte",
        description: "Contacto, cambio de número y pagos no reflejados.",
        categorySlugs: [
          "contacto-de-operadores",
          "cambio-de-numero-de-telefono",
          "pago-no-reflejado",
        ],
      },
    ],
  },
  {
    id: "empresa",
    title: "Para empresas",
    description: "Soluciones para comercios, corresponsales y empresas en Panamá.",
    groups: [
      {
        id: "cuotas-local",
        audience: "empresa",
        title: "Cuotas en su local",
        description:
          "Financia a tus clientes para que compren en tu negocio. Cuotas al 0 % con aprobación digital.",
        categorySlugs: [
          "cuotas-inicio",
          "cuotas-comenzando",
          "cuotas-registro-contrato",
          "cuotas-cliente",
          "cuotas-empleados",
          "cuotas-comisiones-pagos",
          "cuotas-devoluciones-disputas",
        ],
        links: [
          { title: "Portal comercios", href: "https://comercios.puntopago.net/", external: true },
        ],
      },
      {
        id: "kioscos-local",
        audience: "empresa",
        title: "Kioscos en local comercial",
        description:
          "Instala un kiosco Punto Pago en tu comercio para recargas y pagos de servicios.",
        categorySlugs: ["aumenta-tus-ventas-con-punto-pago", "reporte-de-terminal"],
        links: [
          {
            title: "Afiliarse — kioscos",
            href: "https://puntopago.net/business/",
            external: true,
          },
        ],
      },
      {
        id: "agente-corresponsal",
        audience: "empresa",
        title: "Agente corresponsal",
        description:
          "Opera como corresponsal Punto Pago en tu comunidad: cobros, recargas y servicios.",
        articleRefs: [
          { categorySlug: "aumenta-tus-ventas-con-punto-pago", articleSlug: "registrar-mi-negocio" },
        ],
        links: [
          {
            title: "Afiliarse — agente",
            href: "https://puntopago.net/business/",
            external: true,
          },
        ],
      },
      {
        id: "servicios-corporativos",
        audience: "empresa",
        title: "Servicios corporativos",
        description: "Checkout, Payments Hub y soluciones de recaudo para empresas.",
        links: [
          {
            title: "Business Checkout",
            href: "https://puntopago.net/business/checkout/",
            external: true,
          },
          {
            title: "Payments Hub",
            href: "https://puntopago.net/business/paymentshub/",
            external: true,
          },
          {
            title: "Contacto comercial",
            href: "mailto:comercios@puntopago.net",
            external: true,
          },
        ],
      },
    ],
  },
];

const EMPRESA_CATEGORY_SLUGS = new Set(
  FAQ_NAV.find((s) => s.id === "empresa")?.groups.flatMap((g) => g.categorySlugs ?? []) ?? [],
);

export function getAudienceForCategory(categorySlug: string): FaqAudience {
  if (categorySlug.startsWith("cuotas-") || EMPRESA_CATEGORY_SLUGS.has(categorySlug)) {
    return "empresa";
  }
  return "cliente";
}

function dedupeItems(items: FaqNavItem[]): FaqNavItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.href;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function resolveNavGroup(group: FaqNavGroup): FaqNavGroupResolved {
  const items: FaqNavItem[] = [];

  for (const categorySlug of group.categorySlugs ?? []) {
    const category = getCategory(categorySlug);
    if (!category) continue;
    for (const article of category.articles) {
      items.push({
        title: article.title,
        href: articlePath(category.slug, article.slug),
        categorySlug: category.slug,
        articleSlug: article.slug,
      });
    }
  }

  for (const ref of group.articleRefs ?? []) {
    const result = getArticle(ref.categorySlug, ref.articleSlug);
    if (!result) continue;
    items.push({
      title: result.article.title,
      href: articlePath(result.category.slug, result.article.slug),
      categorySlug: result.category.slug,
      articleSlug: result.article.slug,
    });
  }

  return { ...group, items: dedupeItems(items) };
}

export type FaqNavSectionResolved = Omit<FaqNavSection, "groups"> & {
  groups: FaqNavGroupResolved[];
};

export function getNavSections(): FaqNavSectionResolved[] {
  return FAQ_NAV.map((section) => ({
    ...section,
    groups: section.groups.map(resolveNavGroup),
  }));
}

export function getNavGroupById(id: string): FaqNavGroupResolved | undefined {
  for (const section of FAQ_NAV) {
    const group = section.groups.find((g) => g.id === id);
    if (group) return resolveNavGroup(group);
  }
  return undefined;
}

export function getFeaturedGroups(audience: FaqAudience): FaqNavGroupResolved[] {
  const section = FAQ_NAV.find((s) => s.id === audience);
  if (!section) return [];
  return section.groups
    .filter((g) =>
      ["tarjeta-credito", "adelantos-saldo", "linea-credito", "pago-cuotas-cliente"].includes(g.id) ||
      ["cuotas-local", "kioscos-local", "agente-corresponsal", "servicios-corporativos"].includes(g.id),
    )
    .map(resolveNavGroup);
}

/** Categorías no asignadas explícitamente (fallback en búsqueda). */
export function getUnmappedCategories(): FaqCategory[] {
  const mapped = new Set<string>();
  for (const section of FAQ_NAV) {
    for (const group of section.groups) {
      for (const slug of group.categorySlugs ?? []) mapped.add(slug);
      for (const ref of group.articleRefs ?? []) mapped.add(ref.categorySlug);
    }
  }
  return getAllCategories().filter((c) => !mapped.has(c.slug));
}
