'use client';

import { useState } from 'react';

export default function ProductTemplateD({ productHandle }) {
  const [nicotineStrength, setNicotineStrength] = useState('0mg');
  const [bottleSize, setBottleSize] = useState('10ml');
  const [quantity, setQuantity] = useState(1);

  const strengths = ['0mg', '3mg', '6mg', '12mg', '18mg'];
  const sizes = ['10ml', '30ml', '60ml', '120ml'];

  return (
    <div className="container-custom py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg mb-4">
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Nicotine/Shot Bild
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">Nicotine Shot / Liquid</h1>
          <p className="text-2xl text-primary font-bold mb-6">19,99 €</p>

          {/* Nicotine Strength */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Nikotinstärke</label>
            <div className="grid grid-cols-5 gap-2">
              {strengths.map((strength) => (
                <button
                  key={strength}
                  onClick={() => setNicotineStrength(strength)}
                  className={`py-3 border-2 rounded-lg font-semibold transition-all ${
                    nicotineStrength === strength
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {strength}
                </button>
              ))}
            </div>
          </div>

          {/* Bottle Size */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Flaschengröße</label>
            <div className="grid grid-cols-4 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setBottleSize(size)}
                  className={`py-3 border-2 rounded-lg font-semibold transition-all ${
                    bottleSize === size
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
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

          <button className="btn-primary w-full py-4 text-lg mb-4">
            In den Warenkorb
          </button>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Hinweis:</strong> Altersprüfung erforderlich. Nur für Personen ab 18 Jahren.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

