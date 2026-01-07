'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getCart, removeFromCart, updateCartItem, clearCart, getCartCount } from '@/utils/cart';

function formatPrice(amount, currencyCode = 'EUR') {
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

export default function CartSidebar({ isOpen, onClose }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCart = () => {
      const cart = getCart();
      setCartItems(cart);
      setCartCount(getCartCount());
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
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-[9998]"
              onClick={onClose}
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[9999] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-primary">Warenkorb</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">Ihr Warenkorb ist leer.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.variantId} className="flex gap-4 pb-4 border-b">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.title || 'Produkt'}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1">{item.title || 'Produkt'}</h3>
                          {item.variantTitle && (
                            <p className="text-xs text-gray-600 mb-2">{item.variantTitle}</p>
                          )}
                          <p className="text-primary font-bold text-sm mb-2">
                            {formatPrice(item.price?.amount, item.price?.currencyCode)}
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item.variantId, item.quantity - 1)}
                              className="w-6 h-6 border border-gray-300 rounded text-xs hover:border-primary hover:text-primary"
                            >
                              -
                            </button>
                            <span className="text-sm font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.variantId, item.quantity + 1)}
                              className="w-6 h-6 border border-gray-300 rounded text-xs hover:border-primary hover:text-primary"
                            >
                              +
                            </button>
                            <button
                              onClick={() => handleRemove(item.variantId)}
                              className="ml-auto text-red-600 hover:text-red-800 text-xs"
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

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="border-t p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Zwischensumme</span>
                    <span className="font-bold text-lg">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Versand</span>
                    <span>Kostenlos</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-bold text-lg">Gesamt</span>
                    <span className="font-bold text-xl text-primary">{formatPrice(subtotal)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="btn-primary w-full py-3 text-center block"
                  >
                    Zur Kasse
                  </Link>
                  <Link
                    href="/warenkorb"
                    onClick={onClose}
                    className="text-center text-sm text-primary hover:underline block"
                  >
                    Zu Warenkorb
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

