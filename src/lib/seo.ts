import type { FaqArticle, FaqCategory } from "./faq";
import { getSiteUrl } from "./faq";

export function websiteJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Centro de Ayuda Punto Pago",
    url: siteUrl,
    description:
      "Centro de ayuda oficial de Punto Pago con preguntas frecuentes, guías y soporte.",
    publisher: {
      "@type": "Organization",
      name: "Punto Pago",
      url: "https://puntopago.net",
      logo: {
        "@type": "ImageObject",
        url: "https://puntopago.net/favicon.ico",
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/buscar?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url?: string }>) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}` } : {}),
    })),
  };
}

export function articleJsonLd(category: FaqCategory, article: FaqArticle) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/articulo/${category.slug}/${article.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url,
    mainEntityOfPage: url,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: "Punto Pago",
    },
    publisher: {
      "@type": "Organization",
      name: "Punto Pago",
      url: "https://puntopago.net",
    },
    articleSection: category.title,
    inLanguage: "es-PA",
  };
}

export function faqPageJsonLd(
  items: Array<{ question: string; answer: string; url: string }>,
) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
        url: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
      },
    })),
  };
}

export function collectionPageJsonLd(category: FaqCategory) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    description: category.description,
    url: `${siteUrl}/categoria/${category.slug}`,
    inLanguage: "es-PA",
  };
}
