'use client';

import { useState } from 'react';

export default function ProductTemplateB({ productHandle }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="container-custom py-12">
      {/* Big Media Layout */}
      <div className="mb-12">
        <div className="aspect-[16/9] bg-gray-100 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-2xl">
            Großes Hauptbild
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">Produktname</h1>
          <p className="text-2xl text-primary font-bold mb-6">19,99 €</p>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Beschreibung</h3>
            <p className="text-gray-700">
              Detaillierte Produktbeschreibung...
            </p>
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Variante</label>
            <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg">
              <option>Variante 1</option>
            </select>
          </div>

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

          <button className="btn-primary w-full py-4 text-lg mb-4">
            In den Warenkorb
          </button>
        </div>

        {/* Additional Images */}
        <div>
          <h3 className="font-semibold mb-4">Weitere Bilder</h3>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((img, idx) => (
              <div
                key={idx}
                className="aspect-square bg-gray-100 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Bild {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

