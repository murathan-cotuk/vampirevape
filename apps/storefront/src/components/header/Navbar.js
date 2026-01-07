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
            <ul className="hidden lg:flex items-center gap-0 justify-center w-full">
              {menuItems.map((item) => (
                <li
                  key={item.id}
                  className="relative group"
                  onMouseEnter={() => {
                    if (item.items && item.items.length > 0) {
                      setActiveDropdown(item.id);
                    }
                  }}
                  onMouseLeave={() => {
                    // Don't close immediately - let megamenu handle it
                  }}
                >
                  <Link
                    href={mapShopifyUrl(item.url, item, menu)}
                    className={`inline-block px-3 py-4 font-bold text-base relative transition-all duration-200 ${
                      isActive(item.url, item)
                        ? 'text-[#ffd300] text-[1.2em]'
                        : 'group-hover:text-[#ffd300] group-hover:scale-110'
                    }`}
                  >
                    {item.title}
                    <span className={`absolute bottom-3 left-3 right-3 h-0.5 bg-[#ffd300] transition-all duration-200 ${
                      isActive(item.url, item) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}></span>
                  </Link>
                  <AnimatePresence>
                    {item.items && item.items.length > 0 && activeDropdown === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ 
                          duration: 0.5,
                          ease: [0.16, 1, 0.3, 1] // Smooth, liquid-like easing
                        }}
                        className="absolute top-full left-0 w-screen overflow-hidden"
                        style={{ 
                          left: 0,
                          right: 0,
                          marginLeft: 'calc(-50vw + 50%)',
                          zIndex: 1000
                        }}
                        onMouseEnter={() => setActiveDropdown(item.id)}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        {/* Backdrop - Solid white background with strong shadow */}
                        <div 
                          className="absolute inset-0 bg-white border-t-4 border-primary" 
                          style={{ 
                            boxShadow: '0 20px 60px -10px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        
                        {/* Content Container - Same width as navbar */}
                        <div className="relative py-8 px-12 container-custom mx-auto">
                          {/* Top decorative gradient */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-[#ffd300] to-primary" />
                          
                          {/* Main Content Grid - Responsive columns based on item count */}
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className={`grid gap-x-16 gap-y-8 ${
                              item.items.length === 1 ? 'grid-cols-1' :
                              item.items.length === 2 ? 'grid-cols-2' :
                              item.items.length === 3 ? 'grid-cols-3' :
                              item.items.length === 4 ? 'grid-cols-4' :
                              'grid-cols-5'
                            }`}
                          >
                            {item.items.map((subItem, subIndex) => (
                              <motion.div
                                key={subItem.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ 
                                  delay: 0.2 + subIndex * 0.05,
                                  duration: 0.4,
                                  ease: [0.16, 1, 0.3, 1]
                                }}
                                className="space-y-4 group/sub"
                              >
                                {/* Main Category Link */}
                                <Link
                                  href={mapShopifyUrl(subItem.url, subItem, menu)}
                                  className="block relative group/link"
                                >
                                  <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-gray-300 group-hover/link:border-primary transition-colors">
                                    <span className="font-bold text-lg text-gray-800 group-hover/link:text-primary transition-colors duration-200">
                                      {subItem.title}
                                    </span>
                                    <motion.svg
                                      initial={{ opacity: 0, x: -5 }}
                                      whileHover={{ opacity: 1, x: 0 }}
                                      className="w-4 h-4 text-primary opacity-0 group-hover/link:opacity-100 transition-opacity"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </motion.svg>
                                  </div>
                                </Link>
                                
                                {/* Subcategories */}
                                {subItem.items && subItem.items.length > 0 && (
                                  <ul className="space-y-2">
                                    {subItem.items.map((subSubItem, subSubIndex) => (
                                      <motion.li
                                        key={subSubItem.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ 
                                          delay: 0.25 + subIndex * 0.05 + subSubIndex * 0.03,
                                          duration: 0.35,
                                          ease: [0.16, 1, 0.3, 1]
                                        }}
                                      >
                                        <Link
                                          href={mapShopifyUrl(subSubItem.url, subSubItem, menu)}
                                          className="group/item relative flex items-center gap-2 py-2.5 px-3 -mx-3 rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-primary/8 hover:to-[#ffd300]/8 hover:shadow-sm"
                                        >
                                          <motion.div
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-primary to-[#ffd300] rounded-r-full opacity-0 group-hover/item:opacity-100 group-hover/item:h-5 transition-all duration-200"
                                          />
                                          <span className="text-sm font-medium text-gray-800 group-hover/item:text-primary group-hover/item:font-bold transition-all duration-200 relative z-10">
                                            {subSubItem.title}
                                          </span>
                                          <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            whileHover={{ scale: 1, opacity: 1 }}
                                            className="w-1.5 h-1.5 rounded-full bg-[#ffd300] opacity-0 group-hover/item:opacity-100 transition-opacity"
                                          />
                                        </Link>
                                        
                                        {/* Third level items */}
                                        {subSubItem.items && subSubItem.items.length > 0 && (
                                          <motion.ul
                                            initial={{ opacity: 0, height: 0 }}
                                            whileHover={{ opacity: 1, height: 'auto' }}
                                            className="ml-6 mt-2 space-y-1.5 border-l-2 border-gray-100 pl-4"
                                          >
                                            {subSubItem.items.map((subSubSubItem) => (
                                              <motion.li
                                                key={subSubSubItem.id}
                                                whileHover={{ x: 4 }}
                                                transition={{ duration: 0.15 }}
                                              >
                                                <Link
                                                  href={mapShopifyUrl(subSubSubItem.url, subSubSubItem, menu)}
                                                  className="block text-xs text-gray-600 hover:text-primary hover:font-semibold transition-all duration-200 py-1.5 px-2 rounded hover:bg-gray-100"
                                                >
                                                  {subSubSubItem.title}
                                                </Link>
                                              </motion.li>
                                            ))}
                                          </motion.ul>
                                        )}
                                      </motion.li>
                                    ))}
                                  </ul>
                                )}
                              </motion.div>
                            ))}
                          </motion.div>
                          
                          {/* Bottom decorative element */}
                          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
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

