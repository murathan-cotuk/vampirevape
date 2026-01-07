'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/produkt/ProductCard';

function formatPrice(amount, currencyCode) {
  try {
    const value = Number(amount || 0);
    // Force EUR currency
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  } catch {
    return `${amount} EUR`;
  }
}

// Extract filter values from products
function extractFilterOptions(products) {
  if (!products || products.length === 0) {
    return {
      brands: [],
      priceRanges: [],
      flavors: [],
      nicotineStrengths: [],
    };
  }

  const brands = new Set();
  const prices = [];
  const flavors = new Set();
  const nicotineStrengths = new Set();

  products.forEach((product) => {
    // Extract brand (vendor)
    if (product.vendor) {
      brands.add(product.vendor);
    }

    // Extract price
    const minPrice = parseFloat(product.priceRange?.minVariantPrice?.amount || 0);
    if (minPrice > 0) {
      prices.push(minPrice);
    }

    // Extract metafields - handle both array and edges structure
    const metafieldsArray = product.metafields?.edges 
      ? product.metafields.edges.map(e => e.node).filter(Boolean)
      : (Array.isArray(product.metafields) ? product.metafields : []);

    // Extract flavor from metafields
    const flavorMetafield = metafieldsArray.find(m => m && m.key === 'flavor');
    if (flavorMetafield?.value) {
      flavors.add(flavorMetafield.value);
    }

    // Extract nicotine strength from metafields or variants
    const nicotineMetafield = metafieldsArray.find(m => m && m.key === 'nicotine_strength');
    if (nicotineMetafield?.value) {
      nicotineStrengths.add(nicotineMetafield.value);
    }

    // Extract all custom metafields for dynamic filters
    metafieldsArray.forEach(mf => {
      if (mf && mf.namespace === 'custom' && mf.value) {
        // Add to dynamic filter options based on key pattern
        // This will be expanded based on your metafield definitions
      }
    });

    // Also check variants for nicotine
    product.variants?.edges?.forEach(({ node: variant }) => {
      const nicotineOption = variant.selectedOptions?.find(opt => 
        opt && (opt.name?.toLowerCase().includes('nicotin') || opt.name?.toLowerCase().includes('mg'))
      );
      if (nicotineOption?.value) {
        nicotineStrengths.add(nicotineOption.value);
      }
    });
  });

  // Create price ranges
  const priceRanges = [];
  if (prices.length > 0) {
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (maxPrice <= 20) priceRanges.push('0-20€');
    if (maxPrice > 20 || minPrice < 20) priceRanges.push('20-50€');
    if (maxPrice > 50 || minPrice < 50) priceRanges.push('50-100€');
    if (maxPrice > 100) priceRanges.push('100€+');
  }

  return {
    brands: Array.from(brands).sort(),
    priceRanges: [...new Set(priceRanges)],
    flavors: Array.from(flavors).sort(),
    nicotineStrengths: Array.from(nicotineStrengths).sort(),
  };
}

// Filter products based on selected filters
function filterProducts(products, filters) {
  if (!products) return [];

  return products.filter((product) => {
    // Price filter
    if (filters.price) {
      const minPrice = parseFloat(product.priceRange?.minVariantPrice?.amount || 0);
      const [min, max] = filters.price.replace('€', '').replace('+', '').split('-').map(Number);
      
      if (filters.price.includes('+')) {
        if (minPrice < 100) return false;
      } else if (max) {
        if (minPrice < min || minPrice > max) return false;
      }
    }

    // Brand filter
    if (filters.brand && product.vendor !== filters.brand) {
      return false;
    }

    // Flavor filter
    if (filters.flavor) {
      const flavorMetafield = product.metafields?.find(m => m && m.key === 'flavor');
      if (flavorMetafield?.value !== filters.flavor) {
        return false;
      }
    }

    // Nicotine filter
    if (filters.nicotine) {
      const nicotineMetafield = product.metafields?.find(m => m && m.key === 'nicotine_strength');
      const hasNicotine = product.variants?.edges?.some(({ node: variant }) => {
        const nicotineOption = variant.selectedOptions?.find(opt => 
          opt && (opt.name?.toLowerCase().includes('nicotin') || opt.name?.toLowerCase().includes('mg'))
        );
        return nicotineOption?.value === filters.nicotine || nicotineMetafield?.value === filters.nicotine;
      });
      
      if (!hasNicotine && nicotineMetafield?.value !== filters.nicotine) {
        return false;
      }
    }

    return true;
  });
}

export default function CategoryTemplateGrid({ collection }) {
  const allProducts = collection?.products?.edges?.map((e) => e.node) || [];
  const [filters, setFilters] = useState({
    price: null,
    brand: null,
    flavor: null,
    nicotine: null,
  });
  const [sortBy, setSortBy] = useState('best-selling'); // Default: en çok satılan

  // Extract filter options from products
  const filterOptions = useMemo(() => extractFilterOptions(allProducts), [allProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = allProducts;
    
    // Apply filters
    if (filters.price || filters.brand || filters.flavor || filters.nicotine) {
      products = filterProducts(allProducts, filters);
    }
    
    // Apply sorting
    products = [...products].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.title.localeCompare(b.title, 'de');
        case 'name-desc':
          return b.title.localeCompare(a.title, 'de');
        case 'price-asc':
          const priceA = parseFloat(a.priceRange?.minVariantPrice?.amount || 0);
          const priceB = parseFloat(b.priceRange?.minVariantPrice?.amount || 0);
          return priceA - priceB;
        case 'price-desc':
          const priceA2 = parseFloat(a.priceRange?.minVariantPrice?.amount || 0);
          const priceB2 = parseFloat(b.priceRange?.minVariantPrice?.amount || 0);
          return priceB2 - priceA2;
        case 'best-selling':
        default:
          // For now, keep original order (best-selling would need sales data)
          return 0;
      }
    });
    
    return products;
  }, [allProducts, filters, sortBy]);

  // Get category banner from collection metafields (if available)
  const metafields = collection?.metafields || [];
  const categoryBannerMetafield = Array.isArray(metafields) 
    ? metafields.find(m => m && m.key === 'category_banner')
    : null;
  const categoryBanner = categoryBannerMetafield?.value || collection?.image?.url;

  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom pt-1 pb-5">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Filters Sidebar - 1/5 width */}
          <aside className="lg:col-span-1 relative">
            <div className="bg-white p-6 sticky top-24 border-r-2 border-gray-300 pr-6">
              <h2 className="text-xl font-bold mb-6">Filter</h2>

              {/* Price Filter */}
              {filterOptions.priceRanges.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 text-gray-900">Preis</h3>
                  <div className="space-y-2">
                    {filterOptions.priceRanges.map((range) => (
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
              )}

              {/* Brand Filter */}
              {filterOptions.brands.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 text-gray-900">Marke</h3>
                  <div className="space-y-2">
                    {filterOptions.brands.map((brand) => (
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
              )}

              {/* Flavor Filter */}
              {filterOptions.flavors.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 text-gray-900">Geschmack</h3>
                  <div className="space-y-2">
                    {filterOptions.flavors.map((flavor) => (
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
              )}

              {/* Nicotine Filter */}
              {filterOptions.nicotineStrengths.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 text-gray-900">Nikotin</h3>
                  <div className="space-y-2">
                    {filterOptions.nicotineStrengths.map((nicotine) => (
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
              )}

              {(filters.price || filters.brand || filters.flavor || filters.nicotine) && (
                <button 
                  onClick={() => setFilters({ price: null, brand: null, flavor: null, nicotine: null })}
                  className="btn-outline w-full text-sm"
                >
                  Filter zurücksetzen
                </button>
              )}

              {filterOptions.priceRanges.length === 0 && 
               filterOptions.brands.length === 0 && 
               filterOptions.flavors.length === 0 && 
               filterOptions.nicotineStrengths.length === 0 && (
                <p className="text-sm text-gray-500">Keine Filter verfügbar</p>
              )}
            </div>
          </aside>

          {/* Right Section - 4/5 width: Banner, Products, Description */}
          <div className="lg:col-span-4 space-y-2">
            {/* Category Banner - Responsive, NO CROP, in right section */}
            {categoryBanner && (
              <div className="w-full relative" style={{ height: '300px' }}>
                <Image
                  src={categoryBanner}
                  alt={collection?.title || 'Kategorie Banner'}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, 80vw"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}

            {/* Products Grid - 3 columns */}
            {filteredProducts.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'Produkt' : 'Produkte'} gefunden
                  </div>
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 font-semibold">Sortieren:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    >
                      <option value="best-selling">Meistverkauft</option>
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="name-desc">Name (Z-A)</option>
                      <option value="price-asc">Preis (niedrig zu hoch)</option>
                      <option value="price-desc">Preis (hoch zu niedrig)</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white p-8">
                <p className="text-gray-600 text-center">
                  {allProducts.length === 0 
                    ? 'In dieser Kategorie sind noch keine Produkte verfügbar.'
                    : 'Keine Produkte entsprechen den ausgewählten Filtern.'}
                </p>
              </div>
            )}

            {/* Collection Description - Last Section */}
            {(collection?.description || collection?.descriptionHtml) && (
              <div className="bg-white p-8">
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
