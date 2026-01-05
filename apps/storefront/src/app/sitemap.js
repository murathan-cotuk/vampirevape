import { getCollections } from '@/utils/shopify';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vampirevape.vercel.app';

  // Static routes
  const staticRoutes = [
    '',
    '/aromen',
    '/nicotine-shots',
    '/kontakt',
    '/impressum',
    '/datenschutz',
    '/agb',
  ];

  // Dynamic routes from Shopify
  let dynamicRoutes = [];
  try {
    const collectionsData = await getCollections({ limit: 100 });
    const collections = collectionsData?.collections?.edges?.map((e) => e.node) || [];
    dynamicRoutes = collections.map((collection) => ({
      url: `${baseUrl}/${collection.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Failed to fetch collections for sitemap:', error);
  }

  // Combine static and dynamic routes
  const routes = [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: route === '' ? 1 : 0.8,
    })),
    ...dynamicRoutes,
  ];

  return routes;
}

