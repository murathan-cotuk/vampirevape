import { getProductByHandle } from '@/utils/shopify';
import ProductTemplateA from '@/components/produkt/TemplateA';
import ProductTemplateB from '@/components/produkt/TemplateB';
import ProductTemplateC from '@/components/produkt/TemplateC';
import ProductTemplateD from '@/components/produkt/TemplateD';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

// Force dynamic rendering since we fetch from Shopify API
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { handle } = params;
  try {
    const data = await getProductByHandle(handle);
    const product = data?.product;
    if (product) {
      return {
        title: `${product.title} – Vampire Vape`,
        description: product.description || 'Produktbeschreibung',
      };
    }
  } catch (_) {}
  return {
    title: `Produkt - Vampire Vape`,
    description: 'Produktbeschreibung',
  };
}

export default async function ProductPage({ params }) {
  const { handle } = params;
  let product = null;
  try {
    const data = await getProductByHandle(handle);
    product = data?.product || null;
  } catch (_) {}

  // For now: always use Template A. Later can be based on product metafields
  const template = 'A';

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
      {product ? (
        <ProductTemplate product={product} />
      ) : (
        <div className="container-custom py-12">
          <h1 className="text-4xl font-bold mb-4">Produkt nicht gefunden</h1>
          <p className="text-gray-600">
            Bitte prüfen Sie den Product-Handle: <code className="font-mono">{handle}</code>
          </p>
        </div>
      )}
      <Footer />
    </>
  );
}

