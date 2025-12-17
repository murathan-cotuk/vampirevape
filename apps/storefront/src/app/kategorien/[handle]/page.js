import { getCollectionByHandle } from '@/utils/shopify';
import CategoryTemplateGrid from '@/components/kategorie/TemplateGrid';
import CategoryTemplateMasonry from '@/components/kategorie/TemplateMasonry';
import CategoryTemplateFilterLeft from '@/components/kategorie/TemplateFilterLeft';
import CategoryTemplateFilterTop from '@/components/kategorie/TemplateFilterTop';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

export async function generateMetadata({ params }) {
  const { handle } = params;
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

