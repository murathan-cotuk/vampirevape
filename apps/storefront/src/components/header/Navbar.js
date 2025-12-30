'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * Map Shopify URL to Next.js route
 */
function mapShopifyUrl(url) {
  if (!url) return '#';
  
  // Collection URL: /collections/[handle] → /kategorien/[handle]
  if (url.startsWith('/collections/')) {
    const handle = url.replace('/collections/', '');
    return `/kategorien/${handle}`;
  }
  
  // Product URL: /products/[handle] → /produkte/[handle]
  if (url.startsWith('/products/')) {
    const handle = url.replace('/products/', '');
    return `/produkte/${handle}`;
  }
  
  // Page URL: /pages/[handle] → /[handle]
  if (url.startsWith('/pages/')) {
    const handle = url.replace('/pages/', '');
    return `/${handle}`;
  }
  
  // Blog URL: /blogs/[handle] → /blog/[handle]
  if (url.startsWith('/blogs/')) {
    const parts = url.split('/');
    const slug = parts[parts.length - 1];
    return `/blog/${slug}`;
  }
  
  // Custom link or external URL
  return url;
}

export default function Navbar({ isMenuOpen, setIsMenuOpen, menu }) {
  const [activeDropdown, setActiveDropdown] = useState(null);

  // If no menu from Shopify, show empty state or fallback
  const menuItems = menu?.items || [];

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
                  key={item.id}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(item.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={mapShopifyUrl(item.url)}
                    className="block px-4 py-4 hover:bg-primary-dark transition-colors font-medium"
                  >
                    {item.title}
                  </Link>
                  {item.items && item.items.length > 0 && (
                    <div
                      className={`absolute top-full left-0 bg-white text-gray-900 shadow-lg min-w-[200px] py-2 ${
                        activeDropdown === item.id ? 'block' : 'hidden'
                      } group-hover:block`}
                    >
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.id}
                          href={mapShopifyUrl(subItem.url)}
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
                <div key={item.id}>
                  <Link
                    href={mapShopifyUrl(item.url)}
                    className="block px-4 py-3 hover:bg-primary-dark transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                  {item.items && item.items.length > 0 && (
                    <div className="bg-primary-dark pl-8">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.id}
                          href={mapShopifyUrl(subItem.url)}
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

