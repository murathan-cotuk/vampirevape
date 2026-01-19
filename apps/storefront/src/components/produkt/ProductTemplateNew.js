'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { addToCart } from '@/utils/cart';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isFavorite, setIsFavorite] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  const images = product?.images?.edges?.map((e) => e.node) || [];
  const price = selectedVariant?.price || product?.priceRange?.minVariantPrice;
  
  // Handle both array and edges structure for metafields
  const metafields = product?.metafields?.edges 
    ? product.metafields.edges.map(e => e.node).filter(Boolean)
    : (Array.isArray(product?.metafields) ? product.metafields : []);

  // Extract specific metafields
  const mlMetafield = metafields.find(m => m && (m.key === 'ml' || m.key === 'volume' || m.key === 'inhalt'));
  const mlValue = mlMetafield?.value || selectedVariant?.selectedOptions?.find(opt => opt?.name?.toLowerCase().includes('ml'))?.value?.match(/\d+/)?.[0];
  
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

  const produktnummer = metafields.find(mf => 
    mf && mf.namespace === 'custom' && 
    (mf.key.toLowerCase().includes('produktnummer') || mf.key.toLowerCase().includes('sku'))
  ) || selectedVariant?.sku;

  const hersteller = metafields.find(mf => 
    mf && mf.namespace === 'custom' && 
    mf.key.toLowerCase().includes('hersteller')
  ) || product?.vendor;

  const weeeReg = metafields.find(mf => 
    mf && mf.namespace === 'custom' && 
    (mf.key.toLowerCase().includes('weee') || mf.key.toLowerCase().includes('reg'))
  );

  // Calculate bonus points (1 EUR = 1 point)
  const bonusPoints = Math.floor(parseFloat(price?.amount || 0));

  const handleAddToCart = () => {
    if (!selectedVariant || (!selectedVariant.availableForSale && (!selectedVariant.quantityAvailable || selectedVariant.quantityAvailable <= 0))) return;
    
    setIsAdding(true);
    addToCart(selectedVariant.id, quantity, {
      title: product.title,
      variantTitle: selectedVariant.title,
      image: images[0]?.url || '',
      price: selectedVariant.price || price,
    });
    
    // Dispatch cart update event
    window.dispatchEvent(new Event('cartUpdated'));
    // Open cart sidebar
    window.dispatchEvent(new CustomEvent('openCartSidebar'));
    
    setTimeout(() => setIsAdding(false), 500);
  };

  const hasAvailableVariant = variants.length > 0 
    ? variants.some(v => v.availableForSale === true || (v.quantityAvailable && v.quantityAvailable > 0))
    : true;

  const isInStock = selectedVariant?.availableForSale || (selectedVariant?.quantityAvailable && selectedVariant.quantityAvailable > 0);
  const stockQuantity = selectedVariant?.quantityAvailable || 0;

  // Calculate price per 1000ml if ml value exists
  let pricePer1000Ml = null;
  if (mlValue && price?.amount) {
    const ml = parseFloat(mlValue);
    const pricePerMl = parseFloat(price.amount) / ml;
    pricePer1000Ml = pricePerMl * 1000;
  }

  return (
    <div className="container-custom py-8">
      {/* Top Section: Image Left, Buybox Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Images - Left */}
        <div className="relative">
          {images.length > 0 ? (
            <>
              <div 
                className="aspect-square bg-gray-100 rounded-lg mb-3 relative overflow-hidden cursor-zoom-in"
                onClick={() => setLightboxImage(images[selectedImage]?.url)}
              >
                <Image
                  src={images[selectedImage]?.url}
                  alt={images[selectedImage]?.altText || product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-contain"
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
                        sizes="(max-width: 768px) 25vw, 10vw"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-square bg-gray-100 rounded-lg mb-3 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Kein Bild
              </div>
            </div>
          )}
        </div>

        {/* Buybox - Right (Narrower) */}
        <div className="max-w-md">
          <div className="relative">
            <h1 className="text-2xl font-bold mb-3 text-primary">{product.title}</h1>
            
            {/* Favorite Button - Top Right */}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute top-0 right-0 p-2 hover:scale-110 transition-transform group"
            >
              <div className="relative">
                <motion.svg
                  className="w-6 h-6"
                  fill={isFavorite ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ scale: isFavorite ? 1.2 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </motion.svg>
                <motion.svg
                  className="w-4 h-4 absolute -bottom-1 -right-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </div>
            </button>
          </div>

          {/* Price Section */}
          <div className="mb-4">
            <p className="text-xl text-primary font-bold">
              {formatPrice(price?.amount, price?.currencyCode)}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Preise inkl. MwSt. zzgl. Versandkosten
            </p>
          </div>

          {/* Inhalt */}
          {mlValue && pricePer1000Ml && (
            <div className="mb-4 text-sm text-gray-700">
              <span className="font-semibold">Inhalt:</span> {mlValue} ml ({formatPrice(pricePer1000Ml.toString(), price?.currencyCode)}* / 1000 ml)
            </div>
          )}

          {/* Stock Information */}
          <div className="mb-4">
            {isInStock ? (
              <>
                <p className="text-sm font-semibold text-green-600 mb-1">Sofort verfügbar</p>
                {stockQuantity > 0 && (
                  <p className="text-xs text-gray-600">Über {stockQuantity} lieferbar</p>
                )}
                <p className="text-xs text-gray-600 mt-1">Lieferzeit: 2 - 3 Werktage</p>
              </>
            ) : (
              <p className="text-sm font-semibold text-primary">Bald wieder da</p>
            )}
          </div>

          {/* Product Info */}
          <div className="mb-4 space-y-1 text-xs text-gray-600">
            {produktnummer && (
              <p><span className="font-semibold">Produktnummer:</span> {produktnummer}</p>
            )}
            {hersteller && (
              <p><span className="font-semibold">Hersteller:</span> {hersteller}</p>
            )}
            {weeeReg && (
              <p><span className="font-semibold">WEEE-Reg. r.:</span> {weeeReg.value}</p>
            )}
            <p className="text-primary font-semibold mt-2">
              Du erhältst für dieses Produkt {bonusPoints} Bonus-Punkte
            </p>
          </div>

          {/* Variants */}
          {variants.length > 1 && (
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Variante wählen</label>
              <select
                value={selectedVariant?.id || ''}
                onChange={(e) => {
                  const variant = variants.find((v) => v.id === e.target.value);
                  if (variant) setSelectedVariant(variant);
                }}
                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
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
          {hasAvailableVariant && isInStock && (
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Menge</label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 border-2 border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center justify-center text-sm"
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
                  className="w-16 h-8 text-sm font-semibold text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 border-2 border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center justify-center text-sm"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart */}
          {hasAvailableVariant && isInStock ? (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="btn-primary w-full py-2.5 text-sm mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? 'Wird hinzugefügt...' : 'In den Warenkorb'}
            </button>
          ) : (
            <div className="w-full py-2.5 text-sm text-center text-primary font-semibold border-2 border-primary rounded-lg mb-3">
              Bald wieder da
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Centered Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Beschreibung */}
        {product.description && (
          <section>
            <h2 className="text-xl font-bold mb-3 text-primary">Beschreibung</h2>
            <div
              className="text-gray-700 prose prose-sm max-w-none prose-headings:text-primary prose-headings:font-bold prose-p:mb-3 prose-ul:list-disc prose-ul:ml-6 prose-ol:list-decimal prose-ol:ml-6"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
            />
          </section>
        )}

        {/* Angaben zum Hersteller */}
        {gpsrManufacturer && (
          <section>
            <h2 className="text-xl font-bold mb-3 text-primary">Angaben zum Hersteller (Informationspflichten zur GPSR Produktsicherheitsverordnung)</h2>
            <div className="text-gray-700 whitespace-pre-line text-sm">
              {gpsrManufacturer.value}
            </div>
          </section>
        )}

        {/* Angaben zur verantwortlichen Person */}
        {gpsrResponsible && (
          <section>
            <h2 className="text-xl font-bold mb-3 text-primary">Angaben zur verantwortlichen Person (Informationspflichten zur GPSR Produktsicherheitsverordnung)</h2>
            <div className="text-gray-700 whitespace-pre-line text-sm">
              {gpsrResponsible.value}
            </div>
          </section>
        )}

        {/* Wichtige Informationsunterlagen */}
        {importantDocs.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-3 text-primary">Wichtige Informationsunterlagen</h2>
            <div className="space-y-2 text-sm">
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
            <h2 className="text-xl font-bold mb-3 text-primary">Eigenschaften</h2>
            <ul className="space-y-2 text-sm">
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
            <h2 className="text-xl font-bold mb-3 text-primary">CLP-/REACH-Hinweise</h2>
            <div className="text-gray-700 whitespace-pre-line text-sm">
              {clpReach.value}
            </div>
          </section>
        )}

        {/* Cross Selling */}
        <section>
          <h2 className="text-xl font-bold mb-3 text-primary">Ähnliche Produkte</h2>
        </section>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-7xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxImage}
                alt={product.title}
                width={1200}
                height={1200}
                className="object-contain max-h-[90vh] w-auto"
              />
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
