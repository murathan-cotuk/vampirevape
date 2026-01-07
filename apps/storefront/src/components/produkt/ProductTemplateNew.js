'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { addToCart } from '@/utils/cart';

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

export default function ProductTemplateNew({ product }) {
  const variants = product?.variants?.edges?.map((e) => e.node) || [];
  const firstAvailableVariant = variants.find(v => 
    v.availableForSale === true || (v.quantityAvailable && v.quantityAvailable > 0)
  ) || variants[0] || null;
  
  const [selectedVariant, setSelectedVariant] = useState(firstAvailableVariant);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const images = product?.images?.edges?.map((e) => e.node) || [];
  const price = selectedVariant?.price || product?.priceRange?.minVariantPrice;
  // Handle both array and edges structure for metafields
  const metafields = product?.metafields?.edges 
    ? product.metafields.edges.map(e => e.node).filter(Boolean)
    : (Array.isArray(product?.metafields) ? product.metafields : []);

  // Organize metafields by namespace/key
  const organizedMetafields = metafields.reduce((acc, mf) => {
    if (!mf) return acc;
    const key = `${mf.namespace}.${mf.key}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(mf);
    return acc;
  }, {});

  // Extract specific metafield groups
  const eigenschaften = metafields.filter(mf => 
    mf && mf.namespace === 'custom' && 
    (mf.key.toLowerCase().includes('eigenschaft') || 
     mf.key.toLowerCase().includes('attribute') ||
     mf.key.toLowerCase().includes('property'))
  );

  const gpsrManufacturer = metafields.find(mf => 
    mf && mf.namespace === 'custom' && 
    mf.key.toLowerCase().includes('hersteller')
  );

  const gpsrResponsible = metafields.find(mf => 
    mf && mf.namespace === 'custom' && 
    mf.key.toLowerCase().includes('verantwortlich')
  );

  const importantDocs = metafields.filter(mf => 
    mf && mf.namespace === 'custom' && 
    mf.key.toLowerCase().includes('informationsunterlagen')
  );

  const clpReach = metafields.find(mf => 
    mf && mf.namespace === 'custom' && 
    (mf.key.toLowerCase().includes('clp') || mf.key.toLowerCase().includes('reach'))
  );

  const handleAddToCart = () => {
    if (!selectedVariant || (!selectedVariant.availableForSale && (!selectedVariant.quantityAvailable || selectedVariant.quantityAvailable <= 0))) return;
    
    setIsAdding(true);
    addToCart(selectedVariant.id, quantity, {
      title: product.title,
      variantTitle: selectedVariant.title,
      image: images[0]?.url || '',
      price: selectedVariant.price || price,
    });
    
    window.dispatchEvent(new Event('cartUpdated'));
    setTimeout(() => setIsAdding(false), 500);
  };

  const hasAvailableVariant = variants.length > 0 
    ? variants.some(v => v.availableForSale === true || (v.quantityAvailable && v.quantityAvailable > 0))
    : true;

  return (
    <div className="container-custom py-12">
      {/* Top Section: Image Left, Buybox Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Images - Left */}
        <div>
          {images.length > 0 ? (
            <>
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 relative overflow-hidden">
                <Image
                  src={images[selectedImage]?.url}
                  alt={images[selectedImage]?.altText || product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(0, 4).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square bg-gray-100 rounded-lg border-2 relative overflow-hidden ${
                        selectedImage === idx ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.altText || `${product.title} ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 25vw, 12.5vw"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-square bg-gray-100 rounded-lg mb-4 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Kein Bild
              </div>
            </div>
          )}
        </div>

        {/* Buybox - Right */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          <p className="text-2xl text-primary font-bold mb-6">
            {formatPrice(price?.amount, price?.currencyCode)}
          </p>

          {/* Variants */}
          {variants.length > 1 && (
            <div className="mb-6">
              <label className="block font-semibold mb-2">Variante wählen</label>
              <select
                value={selectedVariant?.id || ''}
                onChange={(e) => {
                  const variant = variants.find((v) => v.id === e.target.value);
                  if (variant) setSelectedVariant(variant);
                }}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
              >
                {variants.map((variant) => (
                  <option key={variant.id} value={variant.id} disabled={!variant.availableForSale && (!variant.quantityAvailable || variant.quantityAvailable <= 0)}>
                    {variant.title} {variant.availableForSale || (variant.quantityAvailable && variant.quantityAvailable > 0) ? '' : '(Nicht verfügbar)'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quantity */}
          {hasAvailableVariant && (selectedVariant?.availableForSale || (selectedVariant?.quantityAvailable && selectedVariant.quantityAvailable > 0)) && (
            <div className="mb-6">
              <label className="block font-semibold mb-2">Menge</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors"
                >
                  -
                </button>
                <span className="text-xl font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart */}
          {hasAvailableVariant && (selectedVariant?.availableForSale || (selectedVariant?.quantityAvailable && selectedVariant.quantityAvailable > 0)) ? (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="btn-primary w-full py-4 text-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? 'Wird hinzugefügt...' : 'In den Warenkorb'}
            </button>
          ) : (
            <div className="w-full py-4 text-lg text-center text-primary font-semibold border-2 border-primary rounded-lg mb-4">
              Bald wieder da
            </div>
          )}
          
          <button className="btn-outline w-full py-4 text-lg">
            Zu Favoriten hinzufügen
          </button>
        </div>
      </div>

      {/* Bottom Section: Centered Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Beschreibung */}
        {product.description && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Beschreibung</h2>
            <div
              className="text-gray-700 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
            />
          </section>
        )}

        {/* Angaben zum Hersteller */}
        {gpsrManufacturer && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Angaben zum Hersteller (Informationspflichten zur GPSR Produktsicherheitsverordnung)</h2>
            <div className="text-gray-700 whitespace-pre-line">
              {gpsrManufacturer.value}
            </div>
          </section>
        )}

        {/* Angaben zur verantwortlichen Person */}
        {gpsrResponsible && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Angaben zur verantwortlichen Person (Informationspflichten zur GPSR Produktsicherheitsverordnung)</h2>
            <div className="text-gray-700 whitespace-pre-line">
              {gpsrResponsible.value}
            </div>
          </section>
        )}

        {/* Wichtige Informationsunterlagen */}
        {importantDocs.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Wichtige Informationsunterlagen</h2>
            <div className="space-y-2">
              {importantDocs.map((doc, idx) => (
                <div key={idx} className="text-gray-700">
                  {doc.value}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Eigenschaften */}
        {eigenschaften.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Eigenschaften</h2>
            <ul className="space-y-2">
              {eigenschaften.map((eig, idx) => {
                // Try to parse as JSON if it's a list, otherwise display as text
                let displayValue = eig.value;
                try {
                  const parsed = JSON.parse(eig.value);
                  if (Array.isArray(parsed)) {
                    displayValue = parsed;
                  }
                } catch {
                  // Not JSON, use as is
                }
                
                if (Array.isArray(displayValue)) {
                  return displayValue.map((item, i) => (
                    <li key={`${idx}-${i}`} className="text-gray-700 list-disc list-inside">
                      {typeof item === 'object' ? JSON.stringify(item) : item}
                    </li>
                  ));
                }
                
                return (
                  <li key={idx} className="text-gray-700 list-disc list-inside">
                    {displayValue}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* CLP-/REACH-Hinweise */}
        {clpReach && (
          <section>
            <h2 className="text-2xl font-bold mb-4">CLP-/REACH-Hinweise</h2>
            <div className="text-gray-700 whitespace-pre-line">
              {clpReach.value}
            </div>
          </section>
        )}

        {/* Cross Selling - TODO: Implement product recommendations */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Ähnliche Produkte</h2>
          <p className="text-gray-600">Cross-selling ürünleri buraya eklenecek</p>
        </section>
      </div>
    </div>
  );
}

