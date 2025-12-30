'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

/**
 * Build menu structure from collections
 * Groups collections by category prefix or name patterns
 */
function buildMenuFromCollections(collections) {
  const menuItems = [];

  // Define menu structure with collection filters
  const menuStructure = [
    {
      name: 'E-Liquids',
      href: '/e-liquids',
      filters: ['liquid', 'e-liquid', 'eliquid'],
      subcategories: [],
    },
    {
      name: 'Hardware',
      href: '/hardware',
      filters: ['hardware', 'zigarette', 'verdampfer', 'akku'],
      subcategories: [],
    },
    {
      name: 'Aromen',
      href: '/aromen',
      filters: ['aroma'],
      subcategories: [],
    },
    {
      name: 'Nicotine Shots',
      href: '/nicotine-shots',
      filters: ['nicotine', 'shot'],
      subcategories: [],
    },
    {
      name: 'Bundles',
      href: '/bundles',
      filters: ['bundle', 'set'],
      subcategories: [],
    },
    {
      name: 'Angebote',
      href: '/angebote',
      filters: ['sale', 'angebot', 'rabatt'],
      subcategories: [],
    },
    {
      name: 'Marken',
      href: '/marken',
      filters: [],
      subcategories: [],
    },
    {
      name: 'Lexikon',
      href: '/lexikon',
      filters: [],
      subcategories: [],
    },
    {
      name: 'Blog',
      href: '/blog',
      filters: [],
      subcategories: [],
    },
  ];

  // Map collections to menu items
  menuStructure.forEach((menuItem) => {
    if (menuItem.filters.length > 0 && collections.length > 0) {
      const matchingCollections = collections.filter((col) =>
        menuItem.filters.some((filter) =>
          col.title?.toLowerCase().includes(filter.toLowerCase()) ||
          col.handle?.toLowerCase().includes(filter.toLowerCase())
        )
      );

      menuItem.subcategories = matchingCollections.map((col) => ({
        id: col.id,
        title: col.title,
        url: `/kategorien/${col.handle}`,
        type: 'collection',
      }));
    }

    menuItems.push(menuItem);
  });

  return menuItems;
}

export default function Navbar({ isMenuOpen, setIsMenuOpen, collections = [] }) {
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Build menu from collections
  const menuItems = useMemo(() => {
    return buildMenuFromCollections(collections);
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
          {menuItems.length > 0 ? (
            <ul className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => (
                <li
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="block px-4 py-4 hover:bg-primary-dark transition-colors font-medium"
                  >
                    {item.name}
                  </Link>
                  {item.subcategories && item.subcategories.length > 0 && (
                    <div
                      className={`absolute top-full left-0 bg-white text-gray-900 shadow-lg min-w-[200px] py-2 ${
                        activeDropdown === item.name ? 'block' : 'hidden'
                      } group-hover:block`}
                    >
                      {item.subcategories.map((subItem) => (
                        <Link
                          key={subItem.id || subItem.title}
                          href={subItem.url}
                          className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="hidden lg:flex items-center px-4 py-4 text-sm text-gray-300">
              Menü lädt...
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-primary-light">
            {menuItems.length > 0 ? (
              menuItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="block px-4 py-3 hover:bg-primary-dark transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.subcategories && item.subcategories.length > 0 && (
                    <div className="bg-primary-dark pl-8">
                      {item.subcategories.map((subItem) => (
                        <Link
                          key={subItem.id || subItem.title}
                          href={subItem.url}
                          className="block px-4 py-2 hover:bg-primary transition-colors text-sm"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-300">
                Menü lädt...
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

