'use client';

import Link from 'next/link';
import { useState } from 'react';

const categories = [
  { name: 'E-Liquids', href: '/e-liquids', subcategories: ['Alle Liquids', 'Top Liquids', 'Neue Liquids', 'Aromen'] },
  { name: 'Hardware', href: '/hardware', subcategories: ['E-Zigaretten', 'Verdampfer', 'Akkus', 'Zubehör'] },
  { name: 'Aromen', href: '/aromen', subcategories: ['Fruchtig', 'Süß', 'Menthol', 'Tabak'] },
  { name: 'Nicotine Shots', href: '/nicotine-shots', subcategories: [] },
  { name: 'Bundles', href: '/bundles', subcategories: [] },
  { name: 'Angebote', href: '/angebote', subcategories: ['Sale', 'Neuheiten', 'Bestseller'] },
  { name: 'Marken', href: '/marken', subcategories: [] },
  { name: 'Lexikon', href: '/lexikon', subcategories: [] },
  { name: 'Blog', href: '/blog', subcategories: [] },
];

export default function Navbar({ isMenuOpen, setIsMenuOpen }) {
  const [activeDropdown, setActiveDropdown] = useState(null);

  return (
    <nav className="bg-primary text-white">
      <div className="container-custom">
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center gap-1">
            {categories.map((category) => (
              <li
                key={category.name}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(category.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={category.href}
                  className="block px-4 py-4 hover:bg-primary-dark transition-colors font-medium"
                >
                  {category.name}
                </Link>
                {category.subcategories.length > 0 && (
                  <div
                    className={`absolute top-full left-0 bg-white text-gray-900 shadow-lg min-w-[200px] py-2 ${
                      activeDropdown === category.name ? 'block' : 'hidden'
                    } group-hover:block`}
                  >
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        href={`${category.href}/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-primary-light">
            {categories.map((category) => (
              <div key={category.name}>
                <Link
                  href={category.href}
                  className="block px-4 py-3 hover:bg-primary-dark transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
                {category.subcategories.length > 0 && (
                  <div className="bg-primary-dark pl-8">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        href={`${category.href}/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block px-4 py-2 hover:bg-primary transition-colors text-sm"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

