import { getCollectionByHandle, getProductByHandle } from '@/utils/shopify';
import CategoryTemplateGrid from '@/components/kategorie/TemplateGrid';
import CategoryTemplateMasonry from '@/components/kategorie/TemplateMasonry';
import CategoryTemplateFilterLeft from '@/components/kategorie/TemplateFilterLeft';
import CategoryTemplateFilterTop from '@/components/kategorie/TemplateFilterTop';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

// Force dynamic rendering since we fetch from Shopify API
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { handle } = params;
  
  // Exclude special routes that should not be treated as category handles
  const excludedHandles = ['checkout', 'warenkorb', 'konto', 'anmelden', 'blog', 'lexikon', 'produkte', 'kategorien'];
  if (excludedHandles.includes(handle)) {
    return {
      title: `Seite nicht gefunden - Vampire Vape`,
      description: 'Die angeforderte Seite konnte nicht gefunden werden.',
    };
  }
  
  // Best-effort metadata
  try {
    const data = await getCollectionByHandle(handle);
    const c = data?.collection;
    if (c) {
      return {
        title: `${c.title} – Vampire Vape`,
        description: c.description || 'Kategoriebeschreibung',
      };
    }
  } catch (_) {}
  return {
    title: `Kategorie - Vampire Vape`,
    description: 'Kategoriebeschreibung',
  };
}

export default async function CategoryPage({ params }) {
  const { handle } = params;
  
  // Exclude special routes that should not be treated as category handles
  // These routes have their own specific pages, so we should not handle them here
  // Next.js route priority: static routes (checkout/page.js) should come before dynamic routes ([handle]/page.js)
  const excludedHandles = ['checkout', 'warenkorb', 'konto', 'anmelden', 'registrieren', 'blog', 'lexikon', 'produkte', 'kategorien', 'suche', 'favoriten', 'kontakt'];
  if (excludedHandles.includes(handle)) {
    // These routes should be handled by their specific pages
    // Don't render anything - let Next.js try static routes first
    return null;
  }
  
  // First check if it's a product - if so, redirect to product page
  // But only if it's not in excluded handles (to avoid unnecessary API calls)
  let product = null;
  if (!excludedHandles.includes(handle)) {
    try {
      const productData = await getProductByHandle(handle);
      product = productData?.product || null;
    } catch (error) {
      // Silently fail - might be a collection or invalid handle
      console.error('Product fetch error:', error);
    }
    
    if (product) {
      // This is a product, not a collection - redirect to product page
      const { redirect } = await import('next/navigation');
      redirect(`/produkte/${handle}`);
    }
  }
  
  // If not a product, try as collection
  let collection = null;
  try {
    const data = await getCollectionByHandle(handle);
    collection = data?.collection || null;
  } catch (_) {}

  // For now: always render Grid template with real data.
  // (Other templates can be wired once filters/sorting are implemented server-side.)

  return (
    <>
      <Header />
      {collection ? (
        <CategoryTemplateGrid collection={collection} />
      ) : (
        <div className="container-custom py-12">
          <h1 className="text-4xl font-bold mb-4">Kategorie nicht gefunden</h1>
          <p className="text-gray-600">
            Bitte prüfen Sie den Collection-Handle: <code className="font-mono">{handle}</code>
          </p>
        </div>
      )}
      <Footer />
    </>
  );
}

