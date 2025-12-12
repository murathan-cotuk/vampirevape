import { getProductByHandle } from '@/utils/shopify';
import ProductTemplateA from '@/components/produkt/TemplateA';
import ProductTemplateB from '@/components/produkt/TemplateB';
import ProductTemplateC from '@/components/produkt/TemplateC';
import ProductTemplateD from '@/components/produkt/TemplateD';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

export async function generateMetadata({ params }) {
  const { handle } = params;
  // TODO: Fetch product data for metadata
  return {
    title: `Produkt - Vampire Vape`,
    description: 'Produktbeschreibung',
  };
}

export default function ProductPage({ params }) {
  const { handle } = params;
  // TODO: Determine template based on product metafields or type
  const template = 'A'; // A, B, C, or D

  const templates = {
    A: ProductTemplateA,
    B: ProductTemplateB,
    C: ProductTemplateC,
    D: ProductTemplateD,
  };

  const ProductTemplate = templates[template] || ProductTemplateA;

  return (
    <>
      <Header />
      <ProductTemplate productHandle={handle} />
      <Footer />
    </>
  );
}

