/**
 * SEO Utilities
 */

export function generateProductSchema(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images?.map((img) => img.url) || [],
    brand: {
      '@type': 'Brand',
      name: product.vendor || 'Vampire Vape',
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/produkte/${product.handle}`,
      priceCurrency: product.priceRange?.minVariantPrice?.currencyCode || 'EUR',
      price: product.priceRange?.minVariantPrice?.amount || '0',
      availability: 'https://schema.org/InStock',
    },
  };
}

export function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateArticleSchema(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.image?.url || '',
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'Vampire Vape',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vampire Vape',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      },
    },
  };
}

