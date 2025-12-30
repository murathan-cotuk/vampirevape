'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

const categories = [
  { name: 'E-Liquids', href: '/e-liquids', subcategories: ['Alle Liquids', 'Top Liquids', 'Neue Liquids', 'Aromen'] },
  { name: 'Hardware', href: '/hardware', subcategories: ['E-Zigaretten', 'Verdampfer', 'Akkus', 'Zubehör'] },
  { name: 'Aromen', href: '/aromen', collectionFilter: 'aroma', subcategories: [] }, // Dynamic collections will be added
  { name: 'Nicotine Shots', href: '/nicotine-shots', subcategories: [] },
  { name: 'Bundles', href: '/bundles', subcategories: [] },
  { name: 'Angebote', href: '/angebote', subcategories: ['Sale', 'Neuheiten', 'Bestseller'] },
  { name: 'Marken', href: '/marken', subcategories: [] },
  { name: 'Lexikon', href: '/lexikon', subcategories: [] },
  { name: 'Blog', href: '/blog', subcategories: [] },
];

export default function Navbar({ isMenuOpen, setIsMenuOpen, collections = [] }) {
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Map collections to menu items
  const menuCategories = useMemo(() => {
    return categories.map((category) => {
      if (category.collectionFilter && collections.length > 0) {
        // Filter collections by name containing the filter term (case-insensitive)
        const filteredCollections = collections.filter((col) =>
          col.title?.toLowerCase().includes(category.collectionFilter.toLowerCase()) ||
          col.handle?.toLowerCase().includes(category.collectionFilter.toLowerCase())
        );
        
        // Convert collections to subcategories format
        const collectionSubcategories = filteredCollections.map((col) => ({
          name: col.title,
          href: `/kategorien/${col.handle}`,
          isCollection: true,
        }));

        return {
          ...category,
          subcategories: collectionSubcategories,
        };
      }
      return category;
    });
  }, [collections]);

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
            {menuCategories.map((category) => (
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
                {category.subcategories && category.subcategories.length > 0 && (
                  <div
                    className={`absolute top-full left-0 bg-white text-gray-900 shadow-lg min-w-[200px] py-2 ${
                      activeDropdown === category.name ? 'block' : 'hidden'
                    } group-hover:block`}
                  >
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.name || sub}
                        href={typeof sub === 'object' && sub.href ? sub.href : `${category.href}/${(sub.name || sub).toLowerCase().replace(/\s+/g, '-')}`}
                        className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        {typeof sub === 'object' ? sub.name : sub}
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
            {menuCategories.map((category) => (
              <div key={category.name}>
                <Link
                  href={category.href}
                  className="block px-4 py-3 hover:bg-primary-dark transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="bg-primary-dark pl-8">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={typeof sub === 'object' ? sub.name || sub.href : sub}
                        href={typeof sub === 'object' && sub.href ? sub.href : `${category.href}/${(sub.name || sub).toLowerCase().replace(/\s+/g, '-')}`}
                        className="block px-4 py-2 hover:bg-primary transition-colors text-sm"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {typeof sub === 'object' ? sub.name : sub}
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

