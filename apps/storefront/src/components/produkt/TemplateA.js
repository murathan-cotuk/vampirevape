'use client';

import { useState } from 'react';
import Image from 'next/image';

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

export default function ProductTemplateA({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.edges?.[0]?.node || null
  );
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const images = product?.images?.edges?.map((e) => e.node) || [];
  const variants = product?.variants?.edges?.map((e) => e.node) || [];
  const price = selectedVariant?.price || product?.priceRange?.minVariantPrice;

  return (
    <div className="container-custom py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
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

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          <p className="text-2xl text-primary font-bold mb-6">
            {formatPrice(price?.amount, price?.currencyCode)}
          </p>
          
          {product.description && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Beschreibung</h3>
              <div
                className="text-gray-700 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
              />
            </div>
          )}

          {/* Variants */}
          {variants.length > 1 && (
            <div className="mb-6">
              <label className="block font-semibold mb-2">Variante wählen</label>
              <select
                value={selectedVariant?.id || ''}
                onChange={(e) => {
                  const variant = variants.find((v) => v.id === e.target.value);
                  setSelectedVariant(variant);
                }}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
              >
                {variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.title} {variant.availableForSale ? '' : '(Nicht verfügbar)'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Menge</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border-2 border-gray-300 rounded-lg"
              >
                -
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border-2 border-gray-300 rounded-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            disabled={!selectedVariant?.availableForSale}
            className="btn-primary w-full py-4 text-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedVariant?.availableForSale ? 'In den Warenkorb' : 'Nicht verfügbar'}
          </button>
          <button className="btn-outline w-full py-4 text-lg">
            Zu Favoriten hinzufügen
          </button>
        </div>
      </div>
    </div>
  );
}

