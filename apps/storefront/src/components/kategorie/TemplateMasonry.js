'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function CategoryTemplateMasonry({ collectionHandle }) {
  const [products, setProducts] = useState([]);

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">Kategorie Name (Masonry)</h1>

      {/* Masonry Grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
          <Link
            key={item}
            href={`/produkte/produkt-${item}`}
            className="block mb-4 bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow break-inside-avoid"
          >
            <div className={`bg-gray-200 relative ${
              item % 3 === 0 ? 'aspect-[3/4]' : 
              item % 2 === 0 ? 'aspect-square' : 'aspect-[4/3]'
            }`}>
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Produkt {item}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                Produktname {item}
              </h3>
              <p className="text-primary font-bold">19,99 €</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

