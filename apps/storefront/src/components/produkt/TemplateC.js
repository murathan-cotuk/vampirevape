'use client';

import { useState } from 'react';

export default function ProductTemplateC({ productHandle }) {
  const [selectedBundle, setSelectedBundle] = useState(null);
  const bundles = [
    { id: 1, name: 'Bundle 1', price: 49.99, savings: 10 },
    { id: 2, name: 'Bundle 2', price: 79.99, savings: 20 },
  ];

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">Bundle Produkt</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Main Image */}
        <div className="aspect-square bg-gray-100 rounded-lg">
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Bundle Bild
          </div>
        </div>

        {/* Bundle Selection */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Bundle wählen</h2>
          <div className="space-y-4">
            {bundles.map((bundle) => (
              <button
                key={bundle.id}
                onClick={() => setSelectedBundle(bundle.id)}
                className={`w-full p-6 border-2 rounded-lg text-left transition-all ${
                  selectedBundle === bundle.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-primary/50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{bundle.name}</h3>
                    <p className="text-sm text-gray-600">Sie sparen {bundle.savings}€</p>
                  </div>
                  <p className="text-2xl font-bold text-primary">{bundle.price}€</p>
                </div>
              </button>
            ))}
          </div>

          {selectedBundle && (
            <button className="btn-primary w-full py-4 text-lg mt-6">
              Bundle in den Warenkorb
            </button>
          )}
        </div>
      </div>

      {/* Bundle Contents */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Bundle Inhalt</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md p-4">
              <div className="aspect-square bg-gray-100 rounded-lg mb-2">
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  Item {item}
                </div>
              </div>
              <h3 className="font-semibold text-sm">Produkt {item}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

