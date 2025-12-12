'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getProductByHandle } from '@/utils/shopify';

export default function ProductTemplateA({ productHandle }) {
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // TODO: Fetch product data
  // useEffect(() => {
  //   getProductByHandle(productHandle).then(setProduct);
  // }, [productHandle]);

  if (!product) {
    return <div>Lädt...</div>;
  }

  return (
    <div className="container-custom py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg mb-4 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              Hauptbild
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`aspect-square bg-gray-100 rounded-lg border-2 ${
                  selectedImage === idx ? 'border-primary' : 'border-transparent'
                }`}
              >
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  {idx + 1}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">Produktname</h1>
          <p className="text-2xl text-primary font-bold mb-6">19,99 €</p>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Beschreibung</h3>
            <p className="text-gray-700">
              Produktbeschreibung hier...
            </p>
          </div>

          {/* Variants */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Variante wählen</label>
            <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg">
              <option>Variante 1</option>
              <option>Variante 2</option>
            </select>
          </div>

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
          <button className="btn-primary w-full py-4 text-lg mb-4">
            In den Warenkorb
          </button>
          <button className="btn-outline w-full py-4 text-lg">
            Zu Favoriten hinzufügen
          </button>
        </div>
      </div>
    </div>
  );
}

