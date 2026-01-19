import { getCollectionByHandle, getShopifyMenu } from '@/utils/shopify';
import { buildUrlMapping, getHandleFromUrl } from '@/utils/url-mapper';
import CategoryTemplateGrid from '@/components/kategorie/TemplateGrid';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

// Force dynamic rendering since we fetch from Shopify API
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const urlPath = '/' + (Array.isArray(slug) ? slug.join('/') : slug);

  try {
    // Get menu to build URL mapping
    const { menu } = await getShopifyMenu('main-menu-1');
    const urlMapping = buildUrlMapping(menu);
    const handle = getHandleFromUrl(urlPath, urlMapping);

    if (handle) {
      const data = await getCollectionByHandle(handle);
      const c = data?.collection;
      if (c) {
        return {
          title: `${c.title} – Vampire Vape`,
          description: c.description || 'Kategoriebeschreibung',
        };
      }
    }
  } catch (_) {}

  return {
    title: `Kategorie - Vampire Vape`,
    description: 'Kategoriebeschreibung',
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = params;
  const urlPath = '/' + (Array.isArray(slug) ? slug.join('/') : slug);

  // Exclude special routes that should not be treated as category paths
  // These routes have their own specific pages, so we should not handle them here
  // Next.js route priority: static routes should come before catch-all routes
  const excludedPaths = ['/checkout', '/warenkorb', '/konto', '/anmelden', '/registrieren', '/blog', '/lexikon', '/produkte', '/kategorien', '/suche', '/favoriten', '/kontakt'];
  if (excludedPaths.includes(urlPath) || urlPath.startsWith('/checkout') || urlPath.startsWith('/warenkorb') || urlPath.startsWith('/konto') || urlPath.startsWith('/produkte') || urlPath.startsWith('/kategorien')) {
    // These routes should be handled by their specific pages
    // Don't render anything - let Next.js try static routes first
    return null;
  }

  let collection = null;
  try {
    // Get menu to build URL mapping
    const { menu } = await getShopifyMenu('main-menu-1');
    const urlMapping = buildUrlMapping(menu);
    const handle = getHandleFromUrl(urlPath, urlMapping);

    if (handle) {
      const data = await getCollectionByHandle(handle);
      collection = data?.collection || null;
    }
  } catch (error) {
    console.error('Failed to load category:', error);
  }

  return (
    <>
      <Header />
      {collection ? (
        <CategoryTemplateGrid collection={collection} />
      ) : (
        <div className="container-custom py-12">
          <h1 className="text-4xl font-bold mb-4">Kategorie nicht gefunden</h1>
          <p className="text-gray-600">
            Die angeforderte Kategorie konnte nicht gefunden werden.
          </p>
        </div>
      )}
      <Footer />
    </>
  );
}

