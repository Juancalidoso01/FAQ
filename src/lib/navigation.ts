import {
  articlePath,
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

export type FaqNavArticleRef = {
  categorySlug: string;
  articleSlug: string;
  /** Etiqueta corta en el menú lateral y tarjetas. */
  navTitle?: string;
  /** Etiqueta corta en tarjetas (ej. badge de Dream Card). */
  badge?: string;
};

export type FaqNavSubgroup = {
  id: string;
  title: string;
  categorySlugs?: string[];
  articleRefs?: FaqNavArticleRef[];
};

export type FaqNavGroup = {
  id: string;
  audience: FaqAudience;
  title: string;
  description: string;
  /** Etiqueta corta para distinguir productos similares (ej. "App", "Comercios"). */
  badge?: string;
  /** Subsecciones dentro del producto (preferido). */
  subgroups?: FaqNavSubgroup[];
  /** En el sidebar: lista plana sin encabezados de subsección. */
  flatSidebar?: boolean;
  /** Fallback plano si no hay subgroups. */
  categorySlugs?: string[];
  articleRefs?: FaqNavArticleRef[];
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

/** Productos de crédito: guías de guia.puntopago.net + Dream Card. */
export const CREDIT_PRODUCT_REFS: FaqNavArticleRef[] = [
  {
    categorySlug: "tarjeta-de-credito",
    articleSlug: "tarjeta-de-credito",
    navTitle: "Tarjeta de crédito",
  },
  {
    categorySlug: "dreamcard",
    articleSlug: "dreamcard",
    navTitle: "Dream Card",
    badge: "Historial APC",
  },
  {
    categorySlug: "linea-credito",
    articleSlug: "linea-de-credito",
    navTitle: "Línea de crédito",
  },
  {
    categorySlug: "adelanto-de-saldo",
    articleSlug: "adelanto-de-saldo",
    navTitle: "Adelanto de saldo",
  },
  {
    categorySlug: "cuotas-debito",
    articleSlug: "pago-con-cuotas",
    navTitle: "Pago con cuotas",
  },
];

export type CreditProduct = {
  title: string;
  description: string;
  href: string;
  categorySlug: string;
  articleSlug: string;
  badge?: string;
};

export function getCreditProducts(): CreditProduct[] {
  const products: CreditProduct[] = [];
  for (const ref of CREDIT_PRODUCT_REFS) {
    const result = getArticle(ref.categorySlug, ref.articleSlug);
    if (!result) continue;
    products.push({
      title: ref.navTitle ?? result.article.title,
      description: result.article.description,
      href: articlePath(result.category.slug, result.article.slug),
      categorySlug: result.category.slug,
      articleSlug: result.article.slug,
      badge: ref.badge,
    });
  }
  return products;
}

export type FaqNavSubgroupResolved = FaqNavSubgroup & {
  items: FaqNavItem[];
};

export type FaqNavGroupResolved = Omit<FaqNavGroup, "subgroups"> & {
  items: FaqNavItem[];
  subgroups: FaqNavSubgroupResolved[];
};

export const FAQ_NAV: FaqNavSection[] = [
  {
    id: "cliente",
    title: "Para clientes",
    description: "Productos financieros, recargas y soporte de la app Punto Pago.",
    groups: [
      {
        id: "productos-credito",
        audience: "cliente",
        title: "Productos de crédito",
        flatSidebar: true,
        description:
          "Tarjeta de crédito, Dream Card, línea de crédito, adelanto de saldo y pago con cuotas — guías oficiales Punto Pago.",
        articleRefs: CREDIT_PRODUCT_REFS,
        links: [
          { title: "Ver en guia.puntopago.net", href: "https://guia.puntopago.net/", external: true },
        ],
      },
      {
        id: "bcl-pago-con-credito",
        audience: "cliente",
        title: "BCL — Pago con crédito (app)",
        badge: "Préstamo app",
        flatSidebar: true,
        description:
          "Cupo de crédito Punto Pago en la app para pagar facturas de operadores (luz, cable, telefonía, etc.) en cuotas.",
        articleRefs: [
          {
            categorySlug: "bcl-pago-con-credito",
            articleSlug: "bcl-pago-con-credito-en-la-app",
          },
          {
            categorySlug: "bcl-pago-con-credito",
            articleSlug: "tres-servicios-de-cuotas",
            navTitle: "Tipos de cuotas en Punto Pago",
          },
          {
            categorySlug: "terminos-y-condiciones",
            articleSlug: "terminos-y-condiciones-a-cuotas",
            navTitle: "Términos y condiciones",
          },
        ],
        links: [
          { title: "Descargar app Punto Pago", href: "https://puntopago.net/", external: true },
        ],
      },
      {
        id: "recarga-billetera",
        audience: "cliente",
        title: "Recarga y billetera",
        flatSidebar: true,
        description: "Formas de recargar saldo en tu wallet Punto Pago.",
        articleRefs: [
          {
            categorySlug: "recarga-tu-app",
            articleSlug: "recarga-tu-app",
            navTitle: "Cómo recargar",
          },
          {
            categorySlug: "recarga-tu-app",
            articleSlug: "recargar-tu-billetera",
            navTitle: "Recargar billetera",
          },
          {
            categorySlug: "recarga-tu-app",
            articleSlug: "transferencia-bancaria-ach",
            navTitle: "Transferencia ACH",
          },
          {
            categorySlug: "terminos-y-condiciones",
            articleSlug: "paypal-nuevo-metodo-de-recarga",
            navTitle: "Recargar con PayPal",
          },
        ],
      },
      {
        id: "preguntas-frecuentes",
        audience: "cliente",
        title: "Preguntas frecuentes",
        flatSidebar: true,
        description:
          "Respuestas rápidas sobre la app, pagos, cuenta y problemas comunes que suelen tener los clientes.",
        articleRefs: [
          {
            categorySlug: "nuestros-servicios",
            articleSlug: "preguntas-frecuentes-faq",
            navTitle: "Preguntas frecuentes",
          },
          {
            categorySlug: "nuestros-servicios",
            articleSlug: "revisar-pago-o-transaccion",
            navTitle: "Revisar un pago",
          },
          {
            categorySlug: "pago-no-reflejado",
            articleSlug: "pago-no-reflejado",
            navTitle: "Pago no reflejado",
          },
          {
            categorySlug: "cambio-de-numero-de-telefono",
            articleSlug: "cambio-de-numero-de-telefono",
            navTitle: "Cambiar número de teléfono",
          },
          {
            categorySlug: "nuestros-servicios",
            articleSlug: "links-para-interactuar-con-nuestra-app",
            navTitle: "Contacto y canales",
          },
          {
            categorySlug: "contacto-de-operadores",
            articleSlug: "contacto-de-operadores-punto-pago",
            navTitle: "Contacto de operadores",
          },
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
        id: "cuotas-merchant",
        audience: "empresa",
        title: "Pago en cuotas merchant",
        badge: "Comercios",
        description:
          "Compra ahora y paga después en tu local: Punto Pago financia al cliente y te paga a ti. Guía completa en comercios.puntopago.net.",
        subgroups: [
          {
            id: "cuotas-diferencia",
            title: "Antes de empezar",
            articleRefs: [
              {
                categorySlug: "bcl-pago-con-credito",
                articleSlug: "tres-servicios-de-cuotas",
              },
            ],
          },
          { id: "cuotas-intro", title: "Introducción", categorySlugs: ["cuotas-inicio"] },
          { id: "cuotas-comenzar", title: "Comenzando", categorySlugs: ["cuotas-comenzando"] },
          {
            id: "cuotas-registro",
            title: "Registro y contrato",
            categorySlugs: ["cuotas-registro-contrato"],
          },
          { id: "cuotas-cliente", title: "Qué hace el cliente", categorySlugs: ["cuotas-cliente"] },
          { id: "cuotas-empleados", title: "Acceso empleados", categorySlugs: ["cuotas-empleados"] },
          {
            id: "cuotas-pagos",
            title: "Comisiones y pagos",
            categorySlugs: ["cuotas-comisiones-pagos"],
          },
          {
            id: "cuotas-devoluciones",
            title: "Devoluciones y disputas",
            categorySlugs: ["cuotas-devoluciones-disputas"],
          },
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
        subgroups: [
          {
            id: "kioscos-afiliacion",
            title: "Afiliación",
            articleRefs: [
              {
                categorySlug: "aumenta-tus-ventas-con-punto-pago",
                articleSlug: "registrar-mi-negocio",
              },
            ],
          },
          {
            id: "kioscos-soporte",
            title: "Soporte técnico",
            articleRefs: [
              { categorySlug: "reporte-de-terminal", articleSlug: "reporte-de-maquina" },
              { categorySlug: "reporte-de-terminal", articleSlug: "solicitud-de-comisiones" },
            ],
          },
        ],
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
        subgroups: [
          {
            id: "agente-registro",
            title: "Registro",
            articleRefs: [
              {
                categorySlug: "aumenta-tus-ventas-con-punto-pago",
                articleSlug: "registrar-mi-negocio",
              },
            ],
          },
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
      {
        id: "faq-empresas",
        audience: "empresa",
        title: "Preguntas frecuentes",
        description: "Dudas comunes de comercios sobre afiliación, terminales y comisiones.",
        subgroups: [
          {
            id: "faq-emp-afiliacion",
            title: "Afiliación y registro",
            articleRefs: [
              {
                categorySlug: "aumenta-tus-ventas-con-punto-pago",
                articleSlug: "registrar-mi-negocio",
              },
            ],
          },
          {
            id: "faq-emp-terminal",
            title: "Terminales y comisiones",
            articleRefs: [
              { categorySlug: "reporte-de-terminal", articleSlug: "reporte-de-maquina" },
              { categorySlug: "reporte-de-terminal", articleSlug: "solicitud-de-comisiones" },
            ],
          },
        ],
      },
    ],
  },
];

const EMPRESA_CATEGORY_SLUGS = new Set(
  FAQ_NAV.find((s) => s.id === "empresa")?.groups.flatMap((g) => [
    ...(g.categorySlugs ?? []),
    ...(g.subgroups?.flatMap((sg) => sg.categorySlugs ?? []) ?? []),
  ]) ?? [],
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
    if (seen.has(item.href)) return false;
    seen.add(item.href);
    return true;
  });
}

function resolveArticleRefs(refs: FaqNavArticleRef[]): FaqNavItem[] {
  const items: FaqNavItem[] = [];
  for (const ref of refs) {
    const result = getArticle(ref.categorySlug, ref.articleSlug);
    if (!result) continue;
    items.push({
      title: ref.navTitle ?? result.article.title,
      href: articlePath(result.category.slug, result.article.slug),
      categorySlug: result.category.slug,
      articleSlug: result.article.slug,
    });
  }
  return items;
}

function resolveCategorySlugs(slugs: string[]): FaqNavItem[] {
  const items: FaqNavItem[] = [];
  for (const categorySlug of slugs) {
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
  return items;
}

function resolveSubgroup(subgroup: FaqNavSubgroup): FaqNavSubgroupResolved {
  const fromCategories = resolveCategorySlugs(subgroup.categorySlugs ?? []);
  const fromRefs = resolveArticleRefs(subgroup.articleRefs ?? []);
  return {
    ...subgroup,
    items: dedupeItems([...fromCategories, ...fromRefs]),
  };
}

export function resolveNavGroup(group: FaqNavGroup): FaqNavGroupResolved {
  let subgroups: FaqNavSubgroupResolved[] = [];

  if (group.subgroups?.length) {
    subgroups = group.subgroups.map(resolveSubgroup);
  } else {
    const flatItems = dedupeItems([
      ...resolveCategorySlugs(group.categorySlugs ?? []),
      ...resolveArticleRefs(group.articleRefs ?? []),
    ]);
    if (flatItems.length > 0) {
      subgroups = [{ id: `${group.id}-all`, title: "Guías", items: flatItems }];
    }
  }

  return {
    ...group,
    subgroups,
    items: dedupeItems(subgroups.flatMap((sg) => sg.items)),
  };
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

const CLIENTE_FEATURED_IDS = [
  "productos-credito",
  "bcl-pago-con-credito",
  "recarga-billetera",
  "preguntas-frecuentes",
] as const;

const EMPRESA_FEATURED_IDS = [
  "cuotas-merchant",
  "kioscos-local",
  "agente-corresponsal",
  "servicios-corporativos",
  "faq-empresas",
] as const;

export function getFeaturedGroups(audience: FaqAudience): FaqNavGroupResolved[] {
  const section = FAQ_NAV.find((s) => s.id === audience);
  if (!section) return [];
  const ids = audience === "cliente" ? CLIENTE_FEATURED_IDS : EMPRESA_FEATURED_IDS;
  return ids
    .map((id) => section.groups.find((g) => g.id === id))
    .filter((g): g is FaqNavGroup => !!g)
    .map(resolveNavGroup);
}

export function getUnmappedCategories(): FaqCategory[] {
  const mapped = new Set<string>();
  for (const section of FAQ_NAV) {
    for (const group of section.groups) {
      for (const slug of group.categorySlugs ?? []) mapped.add(slug);
      for (const ref of group.articleRefs ?? []) mapped.add(ref.categorySlug);
      for (const sg of group.subgroups ?? []) {
        for (const slug of sg.categorySlugs ?? []) mapped.add(slug);
        for (const ref of sg.articleRefs ?? []) mapped.add(ref.categorySlug);
      }
    }
  }
  return getAllCategories().filter((c) => !mapped.has(c.slug));
}
