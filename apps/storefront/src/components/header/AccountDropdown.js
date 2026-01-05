'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function AccountDropdown({ onClose }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[100]"
    >
      <Link
        href="/konto/uebersicht"
        className="block px-4 py-2 hover:bg-gray-100 transition-colors"
        onClick={onClose}
      >
        Übersicht
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
    </div>
  );
}

