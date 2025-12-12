'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function CategoryTemplateGrid({ collectionHandle }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');

  // TODO: Fetch products from Shopify
  // useEffect(() => {
  //   getCollectionByHandle(collectionHandle).then((data) => {
  //     setProducts(data.collection.products.edges);
  //     setLoading(false);
  //   });
  // }, [collectionHandle]);

  if (loading) {
    return <div className="container-custom py-12">Lädt...</div>;
  }

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-4xl font-bold mb-4 md:mb-0">Kategorie Name</h1>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border-2 border-gray-300 rounded-lg"
        >
          <option value="default">Standard</option>
          <option value="price-asc">Preis: Niedrig zu Hoch</option>
          <option value="price-desc">Preis: Hoch zu Niedrig</option>
          <option value="name-asc">Name: A-Z</option>
          <option value="name-desc">Name: Z-A</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <Link
            key={item}
            href={`/produkte/produkt-${item}`}
            className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow"
          >
            <div className="aspect-square bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Produkt {item}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                Produktname {item}
              </h3>
              <p className="text-primary font-bold text-lg">19,99 €</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-12">
        <button className="px-4 py-2 border-2 border-gray-300 rounded-lg">Zurück</button>
        <button className="px-4 py-2 bg-primary text-white rounded-lg">1</button>
        <button className="px-4 py-2 border-2 border-gray-300 rounded-lg">2</button>
        <button className="px-4 py-2 border-2 border-gray-300 rounded-lg">Weiter</button>
      </div>
    </div>
  );
}

