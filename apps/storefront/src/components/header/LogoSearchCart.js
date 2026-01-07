'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AccountDropdown from './AccountDropdown';
import CartSidebar from '@/components/cart/CartSidebar';
import SearchResults from '@/components/search/SearchResults';
import { getCartTotal, getCartCount } from '@/utils/cart';

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

export default function LogoSearchCart({ isAccountOpen, setIsAccountOpen }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Listen for openCartSidebar event
  useEffect(() => {
    const handleOpenCart = () => {
      setIsCartOpen(true);
    };
    window.addEventListener('openCartSidebar', handleOpenCart);
    return () => window.removeEventListener('openCartSidebar', handleOpenCart);
  }, []);

  useEffect(() => {
    // Update cart total and count
    const updateCart = () => {
      const total = getCartTotal();
      const count = getCartCount();
      setCartTotal(total);
      setCartCount(count);
    };

    updateCart();
    // Listen for cart changes
    window.addEventListener('storage', updateCart);
    // Custom event for cart updates
    window.addEventListener('cartUpdated', updateCart);

    return () => {
      window.removeEventListener('storage', updateCart);
      window.removeEventListener('cartUpdated', updateCart);
    };
  }, []);

  return (
    <div className="container-custom py-1">
      <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="https://cdn.shopify.com/s/files/1/0969/5084/5726/files/Vlad_Logo_big.png?v=1767097230"
            alt="Vampire Vape Logo"
            width={130}
            height={120}
            className=""
            priority
          />
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/suche?q=${encodeURIComponent(searchQuery)}`;
              }
            }}
            className="relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(e.target.value.length >= 2);
              }}
              onFocus={() => setIsSearchOpen(searchQuery.length >= 2)}
              placeholder="Produkte suchen..."
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-primary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
          <SearchResults 
            query={searchQuery} 
            isOpen={isSearchOpen} 
            onClose={() => setIsSearchOpen(false)} 
          />
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {/* Favoriten */}
          <Link href="/favoriten" className="relative p-2 hover:text-primary transition-colors">
            <div className="relative flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-0.5 border-2 border-white shadow-sm z-10">
                0
              </span>
            </div>
          </Link>

          {/* Konto */}
          <div className="relative">
            <button
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className="p-2 hover:text-primary transition-colors"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            {isAccountOpen && (
              <AccountDropdown onClose={() => setIsAccountOpen(false)} />
            )}
          </div>

          {/* Warenkorb */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 hover:text-primary transition-colors flex items-center gap-2"
          >
            <div className="relative flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-0.5 border-2 border-white shadow-sm z-10">
                {cartCount}
              </span>
            </div>
            <span className={`text-base font-medium ${cartTotal > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
              {formatPrice(cartTotal)}
            </span>
          </button>
        </div>
      </div>
      
      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

