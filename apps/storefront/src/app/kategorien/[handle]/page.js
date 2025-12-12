import { getCollectionByHandle } from '@/utils/shopify';
import CategoryTemplateGrid from '@/components/kategorie/TemplateGrid';
import CategoryTemplateMasonry from '@/components/kategorie/TemplateMasonry';
import CategoryTemplateFilterLeft from '@/components/kategorie/TemplateFilterLeft';
import CategoryTemplateFilterTop from '@/components/kategorie/TemplateFilterTop';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

export async function generateMetadata({ params }) {
  const { handle } = params;
  // TODO: Fetch collection data for metadata
  return {
    title: `Kategorie - Vampire Vape`,
    description: 'Kategoriebeschreibung',
  };
}

export default function CategoryPage({ params }) {
  const { handle } = params;
  // TODO: Determine template based on collection metafields
  const template = 'grid'; // grid, masonry, filter-left, filter-top

  const templates = {
    grid: CategoryTemplateGrid,
    masonry: CategoryTemplateMasonry,
    'filter-left': CategoryTemplateFilterLeft,
    'filter-top': CategoryTemplateFilterTop,
  };

  const CategoryTemplate = templates[template] || CategoryTemplateGrid;

  return (
    <>
      <Header />
      <CategoryTemplate collectionHandle={handle} />
      <Footer />
    </>
  );
}

