'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CategoryTemplateFilterLeft({ collectionHandle }) {
  const [filters, setFilters] = useState({
    price: null,
    brand: null,
    flavor: null,
    nicotine: null,
  });

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">Kategorie Name (Filter Links)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Filter</h2>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Preis</h3>
              <div className="space-y-2">
                {['0-20€', '20-50€', '50-100€', '100€+'].map((range) => (
                  <label key={range} className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      value={range}
                      className="mr-2"
                    />
                    <span>{range}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Marke</h3>
              <div className="space-y-2">
                {['Marke 1', 'Marke 2', 'Marke 3'].map((brand) => (
                  <label key={brand} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Flavor Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Geschmack</h3>
              <div className="space-y-2">
                {['Fruchtig', 'Süß', 'Menthol', 'Tabak'].map((flavor) => (
                  <label key={flavor} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                    />
                    <span>{flavor}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="btn-primary w-full">Filter anwenden</button>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
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
      </div>
    </div>
  );
}

