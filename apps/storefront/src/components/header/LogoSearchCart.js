'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AccountDropdown from './AccountDropdown';
import { getCartTotal } from '@/utils/cart';

function formatPrice(amount, currencyCode = 'EUR') {
  try {
    const value = Number(amount || 0);
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currencyCode,
    }).format(value);
  } catch {
    return `${amount} ${currencyCode}`;
  }
}

export default function LogoSearchCart({ isAccountOpen, setIsAccountOpen }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    // Update cart total
    const updateCartTotal = () => {
      const total = getCartTotal();
      setCartTotal(total);
    };

    updateCartTotal();
    // Listen for cart changes
    window.addEventListener('storage', updateCartTotal);
    // Custom event for cart updates
    window.addEventListener('cartUpdated', updateCartTotal);

    return () => {
      window.removeEventListener('storage', updateCartTotal);
      window.removeEventListener('cartUpdated', updateCartTotal);
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
              window.location.href = `/suche?q=${encodeURIComponent(searchQuery)}`;
            }}
            className="relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {/* Favoriten */}
          <Link href="/favoriten" className="relative p-2 hover:text-primary transition-colors">
            <div className="relative flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5 border-2 border-white shadow-sm z-10">
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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            {isAccountOpen && (
              <AccountDropdown onClose={() => setIsAccountOpen(false)} />
            )}
          </div>

          {/* Warenkorb */}
          <Link href="/warenkorb" className="relative p-2 hover:text-primary transition-colors flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5 border-2 border-white shadow-sm z-10">
                0
              </span>
            </div>
            <span className={`text-sm font-medium ${cartTotal > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
              {formatPrice(cartTotal)}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

