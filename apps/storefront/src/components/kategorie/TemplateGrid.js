import Link from 'next/link';
import ProductCard from '@/components/produkt/ProductCard';

export default function CategoryTemplateGrid({ collection }) {
  const products = collection?.products?.edges?.map((e) => e.node) || [];

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{collection?.title || 'Kategorie'}</h1>
          {collection?.description ? (
            <p className="text-gray-600 max-w-3xl">{collection.description}</p>
          ) : null}
        </div>
        <Link
          href="/"
          className="mt-4 md:mt-0 btn-outline"
        >
          Zur Startseite
        </Link>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">In dieser Kategorie sind noch keine Produkte.</p>
        </div>
      )}
    </div>
  );
}

