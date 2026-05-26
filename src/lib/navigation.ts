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
  {
    categorySlug: "marketplace-en-cuotas",
    articleSlug: "marketplace-en-cuotas",
    navTitle: "Marketplace en cuotas",
    badge: "4 cuotas 0%",
  },
];

/** Marketplace regular: compra directa en la tienda de la app (no crédito ni débito). */
export const MARKETPLACE_PRODUCT_REFS: FaqNavArticleRef[] = [
  {
    categorySlug: "marketplace",
    articleSlug: "marketplace",
    navTitle: "Marketplace",
  },
];

export function getMarketplaceProducts(): CreditProduct[] {
  const products: CreditProduct[] = [];
  for (const ref of MARKETPLACE_PRODUCT_REFS) {
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

/** Remesas internacionales desde la app (crossborder). */
export const REMESAS_PRODUCT_REFS: FaqNavArticleRef[] = [
  {
    categorySlug: "remesas-internacionales",
    articleSlug: "remesas-internacionales",
    navTitle: "Remesas internacionales",
    badge: "2 remesas gratis",
  },
];

export function getRemesasProducts(): CreditProduct[] {
  const products: CreditProduct[] = [];
  for (const ref of REMESAS_PRODUCT_REFS) {
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

/** Recarga en kioscos físicos (pago de operadores con efectivo). */
export const RECARGA_KIOSCOS_REFS: FaqNavArticleRef[] = [
  {
    categorySlug: "recarga-kioscos",
    articleSlug: "recarga-kioscos",
    navTitle: "Recarga en kioscos",
  },
];

export function getRecargaKioscosProducts(): CreditProduct[] {
  const products: CreditProduct[] = [];
  for (const ref of RECARGA_KIOSCOS_REFS) {
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

/** Recarga de billetera desde la app Punto Pago. */
export const RECARGA_APP_REFS: FaqNavArticleRef[] = [
  {
    categorySlug: "recarga-app",
    articleSlug: "recarga-app",
    navTitle: "Recarga en la app",
  },
  {
    categorySlug: "recarga-app",
    articleSlug: "recarga-app-efectivo",
    navTitle: "Efectivo en kioscos",
  },
  {
    categorySlug: "recarga-app",
    articleSlug: "recarga-app-tarjeta",
    navTitle: "Tarjeta débito o crédito",
  },
  {
    categorySlug: "recarga-app",
    articleSlug: "recarga-app-clave",
    navTitle: "Tarjeta Clave",
  },
  {
    categorySlug: "terminos-y-condiciones",
    articleSlug: "paypal-nuevo-metodo-de-recarga",
    navTitle: "PayPal",
  },
  {
    categorySlug: "recarga-app",
    articleSlug: "recarga-app-ach",
    navTitle: "Transferencia ACH",
  },
];

export function getRecargaAppProducts(): CreditProduct[] {
  const products: CreditProduct[] = [];
  for (const ref of RECARGA_APP_REFS) {
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

/** Productos débito: Tarjeta prepago y Tarjeta Junior. */
export const DEBIT_PRODUCT_REFS: FaqNavArticleRef[] = [
  {
    categorySlug: "tarjeta-azul-prepago",
    articleSlug: "tarjeta-azul-prepago",
    navTitle: "Tarjeta prepago",
  },
  {
    categorySlug: "tarjeta-junior",
    articleSlug: "tarjeta-junior",
    navTitle: "Tarjeta Junior",
    badge: "Menores",
  },
];

export function getDebitProducts(): CreditProduct[] {
  const products: CreditProduct[] = [];
  for (const ref of DEBIT_PRODUCT_REFS) {
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

/** Guías comunes para todas las tarjetas Mastercard Punto Pago. */
export const MASTERCARD_PRODUCT_REFS: FaqNavArticleRef[] = [
  {
    categorySlug: "tarjetas-mastercard",
    articleSlug: "tarjetas-mastercard",
    navTitle: "Uso de tu tarjeta",
  },
  {
    categorySlug: "tarjetas-mastercard",
    articleSlug: "como-obtener-tu-tarjeta",
    navTitle: "Cómo obtener tu tarjeta",
  },
  {
    categorySlug: "tarjetas-mastercard",
    articleSlug: "activar-tarjeta",
    navTitle: "Activar tu tarjeta",
  },
  {
    categorySlug: "tarjetas-mastercard",
    articleSlug: "ver-pin-y-datos",
    navTitle: "Ver PIN y datos",
  },
  {
    categorySlug: "tarjetas-mastercard",
    articleSlug: "comprar-en-linea",
    navTitle: "Comprar en línea",
  },
  {
    categorySlug: "tarjetas-mastercard",
    articleSlug: "retirar-en-cajero",
    navTitle: "Retirar en cajero",
  },
  {
    categorySlug: "tarjetas-mastercard",
    articleSlug: "limites-de-uso",
    navTitle: "Límites de uso",
  },
  {
    categorySlug: "tarjetas-mastercard",
    articleSlug: "tarjeta-perdida-o-bloqueada",
    navTitle: "Tarjeta perdida o bloqueada",
  },
  {
    categorySlug: "tarjetas-mastercard",
    articleSlug: "promociones-mastercard",
    navTitle: "Promociones Mastercard",
  },
];

export function getMastercardProducts(): CreditProduct[] {
  const products: CreditProduct[] = [];
  for (const ref of MASTERCARD_PRODUCT_REFS) {
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
          "Tarjeta de crédito, Dream Card, línea de crédito, adelanto de saldo, pago con cuotas y Marketplace en cuotas — guías oficiales Punto Pago.",
        articleRefs: CREDIT_PRODUCT_REFS,
        links: [
          { title: "Ver en guia.puntopago.net", href: "https://guia.puntopago.net/", external: true },
        ],
      },
      {
        id: "productos-debito",
        audience: "cliente",
        title: "Productos débito",
        flatSidebar: true,
        description:
          "Tarjeta prepago Mastercard y Tarjeta Junior para menores — débito prepago, no crédito.",
        articleRefs: DEBIT_PRODUCT_REFS,
        links: [
          { title: "Descargar app Punto Pago", href: "https://puntopago.net/", external: true },
        ],
      },
      {
        id: "tarjetas-mastercard",
        audience: "cliente",
        title: "Tarjetas Mastercard",
        flatSidebar: true,
        description:
          "Activar, consultar PIN, comprar en línea, retirar en cajeros y más — guías que aplican a todas las tarjetas Mastercard Punto Pago.",
        articleRefs: MASTERCARD_PRODUCT_REFS,
      },
      {
        id: "marketplace",
        audience: "cliente",
        title: "Marketplace",
        flatSidebar: true,
        description:
          "Tienda en línea en la app: compra productos de comercios locales con entrega a domicilio y pago al contado.",
        articleRefs: MARKETPLACE_PRODUCT_REFS,
        links: [
          { title: "Marketplace para vendedores", href: "https://puntopago.net/business/marketplace/", external: true },
        ],
      },
      {
        id: "remesas-internacionales",
        audience: "cliente",
        title: "Remesas internacionales",
        flatSidebar: true,
        description:
          "Envía dinero desde Panamá a Colombia, Nicaragua y República Dominicana. Promo permanente: 2 remesas gratis.",
        articleRefs: REMESAS_PRODUCT_REFS,
      },
      {
        id: "recarga-kioscos",
        audience: "cliente",
        title: "Recarga kioscos",
        flatSidebar: true,
        description:
          "Paga operadores y servicios en kioscos Punto Pago con efectivo. El pago se aplica al instante.",
        articleRefs: RECARGA_KIOSCOS_REFS,
      },
      {
        id: "recarga-app",
        audience: "cliente",
        title: "Recarga app",
        flatSidebar: true,
        description:
          "Recarga el saldo de tu billetera desde la app: efectivo, tarjeta, Clave, PayPal o ACH.",
        articleRefs: RECARGA_APP_REFS,
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

/** Categorías GitBook de Cuotas merchant (comercios). No incluye cuotas-debito (cliente). */
const CUOTAS_MERCHANT_CATEGORY_SLUGS = new Set([
  "cuotas-inicio",
  "cuotas-comenzando",
  "cuotas-registro-contrato",
  "cuotas-cliente",
  "cuotas-empleados",
  "cuotas-comisiones-pagos",
  "cuotas-devoluciones-disputas",
]);

const EMPRESA_CATEGORY_SLUGS = new Set(
  FAQ_NAV.find((s) => s.id === "empresa")?.groups.flatMap((g) => [
    ...(g.categorySlugs ?? []),
    ...(g.subgroups?.flatMap((sg) => sg.categorySlugs ?? []) ?? []),
  ]) ?? [],
);

export function getAudienceForCategory(categorySlug: string): FaqAudience {
  if (CUOTAS_MERCHANT_CATEGORY_SLUGS.has(categorySlug) || EMPRESA_CATEGORY_SLUGS.has(categorySlug)) {
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
  "productos-debito",
  "tarjetas-mastercard",
  "marketplace",
  "remesas-internacionales",
  "recarga-kioscos",
  "recarga-app",
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

export type SidebarEntry =
  | { type: "heading"; label: string }
  | { type: "link"; title: string; href: string; external?: boolean };

function isCreditProductArticle(categorySlug: string, articleSlug: string) {
  return CREDIT_PRODUCT_REFS.some(
    (ref) => ref.categorySlug === categorySlug && ref.articleSlug === articleSlug,
  );
}

function isDebitProductArticle(categorySlug: string, articleSlug: string) {
  return DEBIT_PRODUCT_REFS.some(
    (ref) => ref.categorySlug === categorySlug && ref.articleSlug === articleSlug,
  );
}

function isMarketplaceProductArticle(categorySlug: string, articleSlug: string) {
  return MARKETPLACE_PRODUCT_REFS.some(
    (ref) => ref.categorySlug === categorySlug && ref.articleSlug === articleSlug,
  );
}

function isRemesasProductArticle(categorySlug: string, articleSlug: string) {
  return REMESAS_PRODUCT_REFS.some(
    (ref) => ref.categorySlug === categorySlug && ref.articleSlug === articleSlug,
  );
}

function isRecargaKioscosArticle(categorySlug: string, articleSlug: string) {
  return RECARGA_KIOSCOS_REFS.some(
    (ref) => ref.categorySlug === categorySlug && ref.articleSlug === articleSlug,
  );
}

function isRecargaAppArticle(categorySlug: string, articleSlug: string) {
  return RECARGA_APP_REFS.some(
    (ref) => ref.categorySlug === categorySlug && ref.articleSlug === articleSlug,
  );
}

function isMastercardProductArticle(categorySlug: string, articleSlug: string) {
  return MASTERCARD_PRODUCT_REFS.some(
    (ref) => ref.categorySlug === categorySlug && ref.articleSlug === articleSlug,
  );
}

function isCuotasMerchantCategory(categorySlug: string | null) {
  return categorySlug != null && CUOTAS_MERCHANT_CATEGORY_SLUGS.has(categorySlug);
}

/** Navegación lateral plana (máx. 2 niveles), estilo help center estándar. */
export function getSidebarNav(
  audience: FaqAudience,
  activeCategorySlug: string | null,
): SidebarEntry[] {
  if (audience === "cliente") {
    const faq = getNavGroupById("preguntas-frecuentes");
    return [
      { type: "link", title: "Resumen clientes", href: "/clientes" },
      { type: "heading", label: "Productos de crédito" },
      ...getCreditProducts().map((p) => ({
        type: "link" as const,
        title: p.title,
        href: p.href,
      })),
      { type: "heading", label: "Productos débito" },
      ...getDebitProducts().map((p) => ({
        type: "link" as const,
        title: p.title,
        href: p.href,
      })),
      { type: "heading", label: "Tarjetas Mastercard" },
      ...getMastercardProducts().map((p) => ({
        type: "link" as const,
        title: p.title,
        href: p.href,
      })),
      { type: "heading", label: "Marketplace" },
      ...getMarketplaceProducts().map((p) => ({
        type: "link" as const,
        title: p.title,
        href: p.href,
      })),
      { type: "heading", label: "Remesas internacionales" },
      ...getRemesasProducts().map((p) => ({
        type: "link" as const,
        title: p.title,
        href: p.href,
      })),
      { type: "heading", label: "Recarga kioscos" },
      ...getRecargaKioscosProducts().map((p) => ({
        type: "link" as const,
        title: p.title,
        href: p.href,
      })),
      { type: "heading", label: "Recarga app" },
      ...getRecargaAppProducts().map((p) => ({
        type: "link" as const,
        title: p.title,
        href: p.href,
      })),
      { type: "heading", label: "Más ayuda" },
      ...(faq?.items[0]
        ? [{ type: "link" as const, title: "Preguntas frecuentes", href: faq.items[0].href }]
        : []),
    ];
  }

  if (isCuotasMerchantCategory(activeCategorySlug)) {
    const merchant = getNavGroupById("cuotas-merchant");
    if (!merchant) return [{ type: "link", title: "Resumen empresas", href: "/empresas" }];

    const entries: SidebarEntry[] = [
      { type: "link", title: "Resumen empresas", href: "/empresas" },
      { type: "heading", label: "Pago en cuotas merchant" },
    ];

    for (const subgroup of merchant.subgroups) {
      if (subgroup.items.length === 0) continue;
      entries.push({ type: "heading", label: subgroup.title });
      for (const item of subgroup.items) {
        entries.push({ type: "link", title: item.title, href: item.href });
      }
    }

    if (merchant.links?.length) {
      entries.push({ type: "heading", label: "Enlaces" });
      for (const link of merchant.links) {
        entries.push({
          type: "link",
          title: link.title,
          href: link.href,
          external: link.external,
        });
      }
    }

    return entries;
  }

  const section = FAQ_NAV.find((s) => s.id === "empresa");
  const entries: SidebarEntry[] = [{ type: "link", title: "Resumen empresas", href: "/empresas" }];

  if (section) {
    entries.push({ type: "heading", label: "Soluciones" });
    for (const group of section.groups) {
      const resolved = resolveNavGroup(group);
      const href = resolved.items[0]?.href ?? "/empresas";
      entries.push({ type: "link", title: group.title, href });
    }
  }

  return entries;
}

export type BreadcrumbItem = { label: string; href: string };

export function getArticleBreadcrumbs(
  categorySlug: string,
  articleSlug: string,
): BreadcrumbItem[] {
  const result = getArticle(categorySlug, articleSlug);
  if (!result) return [{ label: "Inicio", href: "/" }];

  const audience = getAudienceForCategory(categorySlug);
  const hubHref = audience === "cliente" ? "/clientes" : "/empresas";
  const hubLabel = audience === "cliente" ? "Clientes" : "Empresas";

  const crumbs: BreadcrumbItem[] = [
    { label: "Inicio", href: "/" },
    { label: hubLabel, href: hubHref },
  ];

  if (isCreditProductArticle(categorySlug, articleSlug)) {
    crumbs.push({ label: "Productos de crédito", href: `${hubHref}#creditos` });
  } else if (isDebitProductArticle(categorySlug, articleSlug)) {
    crumbs.push({ label: "Productos débito", href: `${hubHref}#debito` });
  } else if (isMastercardProductArticle(categorySlug, articleSlug)) {
    crumbs.push({ label: "Tarjetas Mastercard", href: `${hubHref}#tarjetas-mastercard` });
  } else if (isMarketplaceProductArticle(categorySlug, articleSlug)) {
    crumbs.push({ label: "Marketplace", href: `${hubHref}#marketplace` });
  } else if (isRemesasProductArticle(categorySlug, articleSlug)) {
    crumbs.push({ label: "Remesas internacionales", href: `${hubHref}#remesas` });
  } else if (isRecargaKioscosArticle(categorySlug, articleSlug)) {
    crumbs.push({ label: "Recarga kioscos", href: `${hubHref}#recarga-kioscos` });
  } else if (isRecargaAppArticle(categorySlug, articleSlug)) {
    crumbs.push({ label: "Recarga app", href: `${hubHref}#recarga-app` });
  } else if (isCuotasMerchantCategory(categorySlug)) {
    const merchant = getNavGroupById("cuotas-merchant");
    if (merchant?.items[0]) {
      crumbs.push({ label: "Pago en cuotas merchant", href: merchant.items[0].href });
    }
  } else {
    crumbs.push({ label: result.category.title, href: `/categoria/${categorySlug}` });
  }

  crumbs.push({
    label: result.article.title,
    href: articlePath(categorySlug, articleSlug),
  });

  return crumbs;
}
