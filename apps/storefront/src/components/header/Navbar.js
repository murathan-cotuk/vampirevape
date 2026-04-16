'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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

/**
 * Build hierarchical URL from menu item
 * Uses menu structure to create SEO-friendly URLs like /parent/child
 */
function buildHierarchicalUrl(menuItem, allMenuItems = [], menu = null) {
  if (!menuItem || !menuItem.url) return null;

  // Extract handle from Shopify collection URL
  const url = menuItem.url;
  let handle = null;

  if (url.includes('/collections/')) {
    const match = url.match(/\/collections\/([^\/\?]+)/);
    if (match) {
      handle = match[1];
    }
  }

  if (!handle) return null;

  // Find parent in menu structure
  const findParent = (item, items) => {
    if (!items || items.length === 0) return null;
    for (const parentItem of items) {
      if (parentItem.items && parentItem.items.length > 0) {
        if (parentItem.items.some(child => child.id === item.id || child.url === item.url)) {
          return parentItem;
        }
        const found = findParent(item, parentItem.items);
        if (found) return parentItem;
      }
    }
    return null;
  };

  const parent = findParent(menuItem, allMenuItems || menu?.items || []);
  
  if (parent && parent.url && parent.url.includes('/collections/')) {
    const parentMatch = parent.url.match(/\/collections\/([^\/\?]+)/);
    if (parentMatch) {
      const parentHandle = parentMatch[1];
      return `/${parentHandle}/${handle}`;
    }
  }

  // No parent, return just the handle
  return `/${handle}`;
}

/**
 * Map Shopify URL to Next.js route
 * Handles hierarchical category URLs: /parent/child
 */
function mapShopifyUrl(url, menuItem = null, menu = null) {
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
  
  // Collection URL: Build hierarchical URL from menu structure
  if (path.startsWith('/collections/')) {
    if (menuItem && menu) {
      const hierarchicalUrl = buildHierarchicalUrl(menuItem, menu.items, menu);
      if (hierarchicalUrl) {
        return hierarchicalUrl;
      }
    }
    // Fallback: use handle directly
    const handle = path.replace('/collections/', '').split('/')[0];
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
        return mapShopifyUrl(urlObj.pathname, menuItem, menu); // Recursively process the pathname
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();

  // If no menu from Shopify, show empty state or fallback
  const menuItems = menu?.items || [];

  // Check if a menu item is active (current path matches the menu URL)
  const isActive = (url, menuItem = null) => {
    const mappedUrl = mapShopifyUrl(url, menuItem, menu);
    return pathname === mappedUrl || pathname.startsWith(mappedUrl + '/');
  };

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart total and count
  useEffect(() => {
    const updateCart = () => {
      const total = getCartTotal();
      const count = getCartCount();
      setCartTotal(total);
      setCartCount(count);
    };

    updateCart();
    window.addEventListener('storage', updateCart);
    window.addEventListener('cartUpdated', updateCart);

    return () => {
      window.removeEventListener('storage', updateCart);
      window.removeEventListener('cartUpdated', updateCart);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-primary text-white shadow-md relative">
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Left: Logo (only visible when scrolled) */}
          {isScrolled && (
            <Link href="/" className="flex-shrink-0 lg:block hidden">
              <Image
                src="https://cdn.shopify.com/s/files/1/0969/5084/5726/files/Vlad_Logo_big.png?v=1767097230"
                alt="Vampire Vape Logo"
                width={100}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
          )}

          {/* Center: Menu */}
          <div className="flex items-center flex-1 justify-center">
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
            <ul className="hidden lg:flex items-center justify-center w-full relative">
              {menuItems.map((item) => (
                <li
                  key={item.id}
                  className=""
                  onMouseEnter={() => {
                    if (item.items && item.items.length > 0) setActiveDropdown(item.id);
                  }}
                >
                  <Link
                    href={mapShopifyUrl(item.url, item, menu)}
                    className={`inline-flex items-center px-4 py-4 font-semibold text-[15px] tracking-wide border-b-2 transition-colors duration-200 ${
                      isActive(item.url, item)
                        ? 'text-[#ffd300] border-[#ffd300]'
                        : 'text-white border-transparent hover:text-[#ffd300] hover:border-[#ffd300]'
                    }`}
                  >
                    {item.title}
                  </Link>

                  <AnimatePresence>
                    {item.items && item.items.length > 0 && activeDropdown === item.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="absolute top-full left-0 right-0 z-[1000] w-full"
                        onMouseEnter={() => setActiveDropdown(item.id)}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <div className="rounded-b-2xl border border-gray-200 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.18)] overflow-hidden">
                          <div className="h-1 w-full bg-gradient-to-r from-primary via-[#ffd300] to-primary" />

                          <div className="px-8 py-7">
                            <div className="mb-5 flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                                {item.title}
                              </span>
                              <Link
                                href={mapShopifyUrl(item.url, item, menu)}
                                className="text-sm font-semibold text-primary hover:text-[#ffd300] transition-colors"
                              >
                                Alle ansehen
                              </Link>
                            </div>

                            <div className={`grid gap-x-8 gap-y-6 ${
                              item.items.length <= 2
                                ? 'grid-cols-2'
                                : item.items.length === 3
                                  ? 'grid-cols-3'
                                  : 'grid-cols-4'
                            }`}>
                              {item.items.map((subItem) => (
                                <div key={subItem.id} className="min-w-0">
                                  <Link
                                    href={mapShopifyUrl(subItem.url, subItem, menu)}
                                    className="mb-3 block border-b border-gray-200 pb-2 text-[15px] font-bold text-gray-900 hover:text-primary transition-colors"
                                  >
                                    {subItem.title}
                                  </Link>

                                  {subItem.items && subItem.items.length > 0 && (
                                    <ul className="space-y-1.5">
                                      {subItem.items.slice(0, 8).map((subSubItem) => (
                                        <li key={subSubItem.id}>
                                          <Link
                                            href={mapShopifyUrl(subSubItem.url, subSubItem, menu)}
                                            className="block rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                                          >
                                            {subSubItem.title}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          ) : (
            <div className="hidden lg:flex items-center px-4 py-4 text-sm text-gray-300">
              Menü lädt...
            </div>
          )}
          </div>

          {/* Right: Cart (only visible when scrolled) */}
          {isScrolled && (
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('openCartSidebar'))}
              className="flex-shrink-0 lg:flex items-center gap-2 hidden"
            >
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-white text-primary text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-0.5 border-2 border-primary shadow-sm z-10">
                  {cartCount}
                </span>
              </div>
              <span className={`text-sm font-medium ${cartTotal > 0 ? 'text-white' : 'text-white/70'}`}>
                {formatPrice(cartTotal)}
              </span>
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-primary-light">
            {menuItems.length > 0 ? (
              menuItems.map((item) => (
                <div key={item.id}>
                  <Link
                    href={mapShopifyUrl(item.url, item, menu)}
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
                          href={mapShopifyUrl(subItem.url, subItem, menu)}
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

