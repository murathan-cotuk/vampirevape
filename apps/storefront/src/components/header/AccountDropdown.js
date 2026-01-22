'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function AccountDropdown({ onClose }) {
  const dropdownRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated (check localStorage or cookie)
    const checkAuth = () => {
      const customerId = localStorage.getItem('shopify_customer_id');
      setIsAuthenticated(!!customerId);
    };
    
    checkAuth();
    // Listen for auth changes
    window.addEventListener('storage', checkAuth);
    window.addEventListener('authChange', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleLogout = () => {
    localStorage.removeItem('shopify_customer_id');
    localStorage.removeItem('shopify_customer_token');
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('authChange'));
    onClose();
    window.location.href = '/';
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[100]"
    >
      {isAuthenticated ? (
        <>
          <Link
            href="/konto"
            className="block px-4 py-2 hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            Mein Konto
          </Link>
          <Link
            href="/konto/profil"
            className="block px-4 py-2 hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            Persönliches Profil
          </Link>
          <Link
            href="/konto/adressen"
            className="block px-4 py-2 hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            Adressen
          </Link>
          <Link
            href="/konto/zahlungsarten"
            className="block px-4 py-2 hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            Zahlungsarten
          </Link>
          <Link
            href="/konto/bestellungen"
            className="block px-4 py-2 hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            Bestellungen
          </Link>
          <Link
            href="/konto/bonus-punkte"
            className="block px-4 py-2 hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            Bonus Punkte
          </Link>
          <div className="border-t border-gray-200 my-2"></div>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-red-600"
          >
            Abmelden
          </button>
        </>
      ) : (
        <>
          <Link
            href="/anmelden"
            className="block px-4 py-2 hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            Anmelden
          </Link>
          <Link
            href="/registrieren"
            className="block px-4 py-2 hover:bg-gray-100 transition-colors text-primary font-semibold"
            onClick={onClose}
          >
            Registrieren
          </Link>
        </>
      )}
    </div>
  );
}

