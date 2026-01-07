'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { getCart, removeFromCart, updateCartItem, getCartCount, getCartTotal } from '@/utils/cart';

function formatPrice(amount, currencyCode = 'EUR') {
  try {
    const value = Number(amount || 0);
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  } catch {
    return `${amount} EUR`;
  }
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const updateCart = () => {
      const cart = getCart();
      setCartItems(cart);
      setCartCount(getCartCount());
      setCartTotal(getCartTotal());
    };

    updateCart();
    window.addEventListener('cartUpdated', updateCart);
    window.addEventListener('storage', updateCart);

    return () => {
      window.removeEventListener('cartUpdated', updateCart);
      window.removeEventListener('storage', updateCart);
    };
  }, []);

  const handleRemove = (variantId) => {
    removeFromCart(variantId);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleQuantityChange = (variantId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemove(variantId);
    } else {
      updateCartItem(variantId, newQuantity);
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const subtotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price?.amount || 0);
    return total + (price * item.quantity);
  }, 0);

  return (
    <>
      <Header />
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-8">Warenkorb</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 mb-4">Ihr Warenkorb ist leer.</p>
                <Link href="/" className="btn-primary inline-block">
                  Weiter einkaufen
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.variantId} className="bg-white rounded-lg shadow-md p-6 flex gap-4">
                    {item.image && (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title || 'Produkt'}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{item.title || 'Produkt'}</h3>
                      {item.variantTitle && (
                        <p className="text-sm text-gray-600 mb-2">{item.variantTitle}</p>
                      )}
                      <p className="text-primary font-bold text-lg mb-3">
                        {formatPrice(item.price?.amount, item.price?.currencyCode)}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.variantId, item.quantity - 1)}
                            className="w-8 h-8 border-2 border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              handleQuantityChange(item.variantId, val);
                            }}
                            className="w-16 text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                          />
                          <button
                            onClick={() => handleQuantityChange(item.variantId, item.quantity + 1)}
                            className="w-8 h-8 border-2 border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemove(item.variantId)}
                          className="text-red-600 hover:text-red-800 text-sm ml-auto"
                        >
                          Entfernen
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Zusammenfassung</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Zwischensumme</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Versand</span>
                  <span>Kostenlos</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Gesamt</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="btn-primary w-full py-4 text-lg text-center block"
              >
                Zur Kasse
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
