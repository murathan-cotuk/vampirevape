'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Map Shopify URL to Next.js route
 * Handles both relative (/collections/...) and full URLs (https://...myshopify.com/collections/...)
 */
function mapShopifyUrl(url) {
  if (!url) return '#';
  
  // Remove query parameters and hash
  const cleanUrl = url.split('?')[0].split('#')[0];
  
  // Extract path from full URL if needed
  let path = cleanUrl;
  try {
    const urlObj = new URL(cleanUrl);
    path = urlObj.pathname;
  } catch {
    // If it's not a full URL, use as is
    path = cleanUrl;
  }
  
  // Collection URL: /collections/[handle] → /[handle]
  if (path.startsWith('/collections/')) {
    const handle = path.replace('/collections/', '').split('/')[0]; // Get first part after /collections/
    return `/${handle}`;
  }
  
  // Product URL: /products/[handle] → /produkte/[handle]
  if (path.startsWith('/products/')) {
    const handle = path.replace('/products/', '').split('/')[0];
    return `/produkte/${handle}`;
  }
  
  // Page URL: /pages/[handle] → /[handle]
  if (path.startsWith('/pages/')) {
    const handle = path.replace('/pages/', '').split('/')[0];
    return `/${handle}`;
  }
  
  // Blog URL: /blogs/[handle] → /blog/[handle]
  if (path.startsWith('/blogs/')) {
    const parts = path.split('/');
    const slug = parts[parts.length - 1];
    return `/blog/${slug}`;
  }
  
  // Root URL
  if (path === '/' || path === '') {
    return '/';
  }
  
  // Custom link or external URL - return as is if it's external
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    // External URL - check if it's our Shopify store
    if (cleanUrl.includes('myshopify.com')) {
      // It's a Shopify URL, try to extract the path
      try {
        const urlObj = new URL(cleanUrl);
        return mapShopifyUrl(urlObj.pathname); // Recursively process the pathname
      } catch {
        return url; // Return original if parsing fails
      }
    }
    return url; // External URL, return as is
  }
  
  // Relative URL that doesn't match patterns - return as is
  return path;
}

export default function Navbar({ isMenuOpen, setIsMenuOpen, menu }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const pathname = usePathname();

  // If no menu from Shopify, show empty state or fallback
  const menuItems = menu?.items || [];

  // Check if a menu item is active (current path matches the menu URL)
  const isActive = (url) => {
    const mappedUrl = mapShopifyUrl(url);
    return pathname === mappedUrl || pathname.startsWith(mappedUrl + '/');
  };

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
            <ul className="hidden lg:flex items-center gap-0 justify-center w-full">
              {menuItems.map((item) => (
                <li
                  key={item.id}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(item.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={mapShopifyUrl(item.url)}
                    className={`inline-block px-3 py-4 font-bold text-base relative transition-all duration-200 ${
                      isActive(item.url)
                        ? 'text-[#ffd300] text-[1.2em]'
                        : 'group-hover:text-[#ffd300] group-hover:scale-110'
                    }`}
                  >
                    {item.title}
                    <span className={`absolute bottom-3 left-3 right-3 h-0.5 bg-[#ffd300] transition-all duration-200 ${
                      isActive(item.url) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}></span>
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

