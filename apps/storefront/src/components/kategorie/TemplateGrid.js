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

    // Extract nicotine strength from metafields or variant options
    const nicotineMetafield = metafieldsArray.find(m => m && (m.key === 'nicotine_strength' || m.key === 'nicotine'));
    if (nicotineMetafield?.value) {
      nicotineStrengths.add(nicotineMetafield.value);
    } else {
      // Try to extract from variant options
      product.variants?.edges?.forEach(({ node: variant }) => {
        const nicotineOption = variant?.selectedOptions?.find(opt => opt && opt.name?.toLowerCase().includes('nikotin') || opt?.name?.toLowerCase().includes('nicotine'));
        if (nicotineOption?.value) {
          nicotineStrengths.add(nicotineOption.value);
        }
      });
    }
  });

  // Create price ranges
  const priceRanges = [];
  if (prices.length > 0) {
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (maxPrice <= 20) {
      priceRanges.push('0-20');
    }
    if (minPrice <= 30 && maxPrice >= 20) {
      priceRanges.push('20-30');
    }
    if (minPrice <= 50 && maxPrice >= 30) {
      priceRanges.push('30-50');
    }
    if (minPrice <= 100 && maxPrice >= 50) {
      priceRanges.push('50-100');
    }
    if (minPrice >= 100) {
      priceRanges.push('100+');
    }
  }

  return {
    brands: Array.from(brands).sort(),
    priceRanges: priceRanges.sort(),
    flavors: Array.from(flavors).sort(),
    nicotineStrengths: Array.from(nicotineStrengths).sort(),
  };
}

export default function CategoryTemplateGrid({ collection }) {
  const [filters, setFilters] = useState({
    price: null,
    brand: null,
    flavor: null,
    nicotine: null,
  });
  const [sortBy, setSortBy] = useState('best-selling');

  // Extract products from collection
  const allProducts = collection?.products?.edges?.map((e) => e.node) || [];

  // Extract filter options from products
  const filterOptions = useMemo(() => extractFilterOptions(allProducts), [allProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    // Apply filters
    if (filters.price) {
      const [min, max] = filters.price.split('-').map(Number);
      products = products.filter((product) => {
        const price = parseFloat(product.priceRange?.minVariantPrice?.amount || 0);
        if (filters.price === '100+') {
          return price >= 100;
        }
        return price >= min && price <= max;
      });
    }

    if (filters.brand) {
      products = products.filter((product) => product.vendor === filters.brand);
    }

    if (filters.flavor) {
      products = products.filter((product) => {
        const metafieldsArray = product.metafields?.edges 
          ? product.metafields.edges.map(e => e.node).filter(Boolean)
          : (Array.isArray(product.metafields) ? product.metafields : []);
        const flavorMetafield = metafieldsArray.find(m => m && m.key === 'flavor');
        return flavorMetafield?.value === filters.flavor;
      });
    }

    if (filters.nicotine) {
      products = products.filter((product) => {
        const metafieldsArray = product.metafields?.edges 
          ? product.metafields.edges.map(e => e.node).filter(Boolean)
          : (Array.isArray(product.metafields) ? product.metafields : []);
        const nicotineMetafield = metafieldsArray.find(m => m && (m.key === 'nicotine_strength' || m.key === 'nicotine'));
        if (nicotineMetafield?.value === filters.nicotine) {
          return true;
        }
        // Also check variant options
        return product.variants?.edges?.some(({ node: variant }) => {
          const nicotineOption = variant?.selectedOptions?.find(opt => opt && (opt.name?.toLowerCase().includes('nikotin') || opt.name?.toLowerCase().includes('nicotine')));
          return nicotineOption?.value === filters.nicotine;
        });
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'name-asc':
        products.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        products.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'price-asc':
        products.sort((a, b) => {
          const priceA = parseFloat(a.priceRange?.minVariantPrice?.amount || 0);
          const priceB = parseFloat(b.priceRange?.minVariantPrice?.amount || 0);
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        products.sort((a, b) => {
          const priceA = parseFloat(a.priceRange?.minVariantPrice?.amount || 0);
          const priceB = parseFloat(b.priceRange?.minVariantPrice?.amount || 0);
          return priceB - priceA;
        });
        break;
      case 'best-selling':
      default:
        // Keep original order (best-selling is default from Shopify)
        break;
    }
    
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
      {/* Container starts immediately under navbar - 1:4 Layout */}
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          {/* Left Section - 1/5 width: Fixed Filters - More to the left */}
          <aside className="lg:col-span-1 bg-white border-r-2 border-gray-300 pl-4 pr-2">
            <div className="sticky top-0 p-4 h-screen overflow-y-auto">
              <h2 className="text-xl font-bold mb-6 text-primary">Filter</h2>

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
                        <span className="text-sm">{range} €</span>
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

          {/* Right Section - 4/5 width: Banner, Products, Description - More spacing from filter */}
          <div className="lg:col-span-4 pl-6">
            {/* Category Banner - 1920x300px, NO CROP, white background, full width to right */}
            {categoryBanner && (
              <div className="w-full relative bg-white" style={{ height: '300px', marginLeft: '-1.5rem', marginRight: '-1.5rem', paddingRight: '1.5rem' }}>
                <Image
                  src={categoryBanner}
                  alt={collection?.title || 'Kategorie Banner'}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}

            {/* Products Section */}
            <div className="py-6">
              {filteredProducts.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-6">
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
                <div className="bg-white p-8 rounded-lg">
                  <p className="text-gray-600 text-center">
                    {allProducts.length === 0 
                      ? 'In dieser Kategorie sind noch keine Produkte verfügbar.'
                      : 'Keine Produkte entsprechen den ausgewählten Filtern.'}
                  </p>
                </div>
              )}

              {/* Collection Description - Last Section */}
              {(collection?.description || collection?.descriptionHtml) && (
                <div className="mt-12 pt-8">
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
    </div>
  );
}
