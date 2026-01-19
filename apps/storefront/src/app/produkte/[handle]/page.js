import { getProductByHandle } from '@/utils/shopify';
import ProductTemplateA from '@/components/produkt/TemplateA';
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
  let error = null;
  
  try {
    console.log(`Fetching product with handle: ${handle}`);
    const data = await getProductByHandle(handle);
    console.log('API Response data:', JSON.stringify(data, null, 2));
    product = data?.product || null;
    
    if (!product) {
      console.error(`Product not found for handle: ${handle}`);
      console.error('Full API Response:', JSON.stringify(data, null, 2));
    } else {
      console.log(`Product found: ${product.title}`);
    }
  } catch (err) {
    console.error('Error fetching product:', err);
    error = err.message || 'Unknown error';
    // Log full error details
    if (err.stack) {
      console.error('Error stack:', err.stack);
    }
  }

  return (
    <>
      <Header />
      {product ? (
        <ProductTemplateA product={product} />
      ) : (
        <div className="container-custom py-12">
          <h1 className="text-4xl font-bold mb-4">Produkt nicht gefunden</h1>
          <p className="text-gray-600 mb-2">
            Bitte prüfen Sie den Product-Handle: <code className="font-mono">{handle}</code>
          </p>
          {error && (
            <p className="text-red-600 text-sm mt-2">
              Fehler: {error}
            </p>
          )}
          <p className="text-gray-500 text-sm mt-4">
            Stellen Sie sicher, dass das Produkt in Shopify existiert und der Handle korrekt ist.
          </p>
        </div>
      )}
      <Footer />
    </>
  );
}

