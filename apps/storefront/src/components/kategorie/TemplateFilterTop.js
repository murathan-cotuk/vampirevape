'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CategoryTemplateFilterTop({ collectionHandle }) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">Kategorie Name (Filter Oben)</h1>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline"
          >
            {showFilters ? 'Filter ausblenden' : 'Filter anzeigen'}
          </button>

          {showFilters && (
            <div className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 gap-4">
              <select className="px-4 py-2 border-2 border-gray-300 rounded-lg">
                <option>Preis</option>
                <option>0-20€</option>
                <option>20-50€</option>
              </select>
              <select className="px-4 py-2 border-2 border-gray-300 rounded-lg">
                <option>Marke</option>
                <option>Marke 1</option>
                <option>Marke 2</option>
              </select>
              <select className="px-4 py-2 border-2 border-gray-300 rounded-lg">
                <option>Geschmack</option>
                <option>Fruchtig</option>
                <option>Süß</option>
              </select>
              <select className="px-4 py-2 border-2 border-gray-300 rounded-lg">
                <option>Sortierung</option>
                <option>Preis: Niedrig zu Hoch</option>
                <option>Preis: Hoch zu Niedrig</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
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
    </div>
  );
}

