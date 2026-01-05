'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/produkt/ProductCard';

function formatPrice(amount, currencyCode) {
  try {
    const value = Number(amount || 0);
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currencyCode || 'EUR',
    }).format(value);
  } catch {
    return `${amount} ${currencyCode || 'EUR'}`;
  }
}

export default function CategoryTemplateGrid({ collection }) {
  const products = collection?.products?.edges?.map((e) => e.node) || [];
  const [filters, setFilters] = useState({
    price: null,
    brand: null,
    flavor: null,
    nicotine: null,
  });

  // Get category banner from collection metafields or image (if available)
  const categoryBanner = collection?.metafields?.find(m => m.key === 'category_banner')?.value || collection?.image?.url;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Banner */}
      {categoryBanner && (
        <div className="w-full h-64 md:h-80 lg:h-96 relative mb-8">
          <Image
            src={categoryBanner}
            alt={collection?.title || 'Kategorie Banner'}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Filter</h2>

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-900">Preis</h3>
                <div className="space-y-2">
                  {['0-20€', '20-50€', '50-100€', '100€+'].map((range) => (
                    <label key={range} className="flex items-center cursor-pointer hover:text-primary transition-colors">
                      <input
                        type="radio"
                        name="price"
                        value={range}
                        checked={filters.price === range}
                        onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                        className="mr-2 accent-primary"
                      />
                      <span className="text-sm">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-900">Marke</h3>
                <div className="space-y-2">
                  {['Vampire Vape', 'ElfBar', 'GeekVape'].map((brand) => (
                    <label key={brand} className="flex items-center cursor-pointer hover:text-primary transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.brand === brand}
                        onChange={(e) => setFilters({ ...filters, brand: e.target.checked ? brand : null })}
                        className="mr-2 accent-primary"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Flavor Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-900">Geschmack</h3>
                <div className="space-y-2">
                  {['Fruchtig', 'Süß', 'Menthol', 'Tabak'].map((flavor) => (
                    <label key={flavor} className="flex items-center cursor-pointer hover:text-primary transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.flavor === flavor}
                        onChange={(e) => setFilters({ ...filters, flavor: e.target.checked ? flavor : null })}
                        className="mr-2 accent-primary"
                      />
                      <span className="text-sm">{flavor}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Nicotine Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-900">Nikotin</h3>
                <div className="space-y-2">
                  {['0mg', '3mg', '6mg', '12mg', '18mg'].map((nicotine) => (
                    <label key={nicotine} className="flex items-center cursor-pointer hover:text-primary transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.nicotine === nicotine}
                        onChange={(e) => setFilters({ ...filters, nicotine: e.target.checked ? nicotine : null })}
                        className="mr-2 accent-primary"
                      />
                      <span className="text-sm">{nicotine}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setFilters({ price: null, brand: null, flavor: null, nicotine: null })}
                className="btn-outline w-full text-sm"
              >
                Filter zurücksetzen
              </button>
            </div>
          </aside>

          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Products Grid - 3 columns */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 mb-12">
                <p className="text-gray-600 text-center">In dieser Kategorie sind noch keine Produkte verfügbar.</p>
              </div>
            )}

            {/* Collection Description - Last Section */}
            {(collection?.description || collection?.descriptionHtml) && (
              <div className="bg-white rounded-lg shadow-md p-8 mt-8">
                <div 
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: collection.descriptionHtml || collection.description }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
