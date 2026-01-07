'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

export default function ProductCard({ product }) {
  const variants = product?.variants?.edges?.map((e) => e.node) || [];
  
  // Find first available variant, or fallback to first variant
  // Check both availableForSale and quantityAvailable
  const firstAvailableVariant = variants.find(v => 
    v.availableForSale === true || (v.quantityAvailable && v.quantityAvailable > 0)
  ) || variants[0] || null;
  
  const [selectedVariant, setSelectedVariant] = useState(firstAvailableVariant);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const image = product?.images?.edges?.[0]?.node;
  const price = selectedVariant?.price || product?.priceRange?.minVariantPrice;
  
  // Check if product has any available variant
  // availableForSale can be false even if quantityAvailable > 0, so check both
  const hasAvailableVariant = variants.length > 0 
    ? variants.some(v => v.availableForSale === true || (v.quantityAvailable && v.quantityAvailable > 0))
    : true; // If no variants loaded, assume available

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedVariant || (!selectedVariant.availableForSale && (!selectedVariant.quantityAvailable || selectedVariant.quantityAvailable <= 0))) return;
    
    setIsAdding(true);
    addToCart(selectedVariant.id, quantity, {
      title: product.title,
      variantTitle: selectedVariant.title,
      image: image?.url || '',
      price: selectedVariant.price || price,
    });
    
    // Dispatch cart update event
    window.dispatchEvent(new Event('cartUpdated'));
    // Open cart sidebar
    window.dispatchEvent(new CustomEvent('openCartSidebar'));
    
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow">
      <Link href={`/produkte/${product.handle}`}>
        <div className="aspect-square bg-gray-100 relative">
          {image?.url ? (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              Kein Bild
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        {/* Product Title - Centered, Purple, Clickable */}
        <Link href={`/produkte/${product.handle}`}>
          <h3 className="text-primary font-bold text-center mb-3 line-clamp-2 hover:underline cursor-pointer">
            {product.title}
          </h3>
        </Link>
        
        {/* Price */}
        <p className="text-primary font-bold text-lg text-center mb-4">
          {formatPrice(price?.amount, price?.currencyCode)}
        </p>

        {/* Inhalt Information */}
        {(() => {
          const mlMetafield = product?.metafields?.find(m => m && (m.key === 'ml' || m.key === 'volume' || m.key === 'inhalt'));
          const mlValue = mlMetafield?.value || selectedVariant?.selectedOptions?.find(opt => opt?.name?.toLowerCase().includes('ml'))?.value?.match(/\d+/)?.[0];
          if (mlValue && price?.amount) {
            const ml = parseFloat(mlValue);
            const pricePerMl = parseFloat(price.amount) / ml;
            const pricePer1000Ml = pricePerMl * 1000;
            return (
              <p className="text-xs text-gray-600 text-center mb-3">
                Inhalt: {ml} ml ({formatPrice(pricePer1000Ml.toString(), price.currencyCode)}* / 1000 ml)
              </p>
            );
          }
          return null;
        })()}

        {/* Variants - Only show if product is available */}
        {variants.length > 1 && hasAvailableVariant && (
          <div className="mb-3">
            <label className="block text-xs font-semibold mb-1 text-gray-700">Variante</label>
            <select
              value={selectedVariant?.id || ''}
              onChange={(e) => {
                const variant = variants.find((v) => v.id === e.target.value);
                if (variant) {
                  setSelectedVariant(variant);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            >
              {variants.map((variant) => (
                <option key={variant.id} value={variant.id} disabled={!variant.availableForSale}>
                  {variant.title} {variant.availableForSale ? '' : '(Nicht verfügbar)'}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quantity Selector - Only show if product is available */}
        {hasAvailableVariant && (selectedVariant?.availableForSale || (selectedVariant?.quantityAvailable && selectedVariant.quantityAvailable > 0)) && (
          <div className="mb-3">
            <label className="block text-xs font-semibold mb-1 text-gray-700">Menge</label>
            <div className="flex items-center justify-center gap-1">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuantity(Math.max(1, quantity - 1));
                }}
                className="w-8 h-8 border-2 border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center justify-center"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setQuantity(Math.max(1, val));
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-20 h-10 text-lg font-semibold text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuantity(quantity + 1);
                }}
                className="w-8 h-8 border-2 border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Add to Cart Button or Out of Stock Message */}
        {hasAvailableVariant && (selectedVariant?.availableForSale || (selectedVariant?.quantityAvailable && selectedVariant.quantityAvailable > 0)) ? (
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="btn-primary w-full py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? 'Wird hinzugefügt...' : 'In den Warenkorb'}
          </button>
        ) : (
          <div className="w-full py-2 text-sm text-center text-primary font-semibold border-2 border-primary rounded-lg">
            Bald wieder da
          </div>
        )}
      </div>
    </div>
  );
}
