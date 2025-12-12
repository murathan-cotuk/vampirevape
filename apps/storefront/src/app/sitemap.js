export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vampirevape.de';

  // TODO: Fetch dynamic routes from Shopify and Strapi
  const routes = [
    '',
    '/e-liquids',
    '/hardware',
    '/aromen',
    '/nicotine-shots',
    '/bundles',
    '/angebote',
    '/marken',
    '/lexikon',
    '/blog',
    '/kontakt',
    '/ueber-uns',
    '/versand',
    '/zahlungsarten',
    '/faq',
    '/impressum',
    '/datenschutz',
    '/agb',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}

