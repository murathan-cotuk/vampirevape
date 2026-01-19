'use client';

import { useState, useEffect } from 'react';
import FooterLinks from './FooterLinks';
import FooterBottom from './FooterBottom';
import NewsletterSignup from './NewsletterSignup';
import SocialLinks from './SocialLinks';
import Link from 'next/link';

/**
 * Map Shopify URL to Next.js route
 */
function mapShopifyUrl(url) {
  if (!url) return '#';
  
  const cleanUrl = url.split('?')[0].split('#')[0];
  let path = cleanUrl;
  
  try {
    const urlObj = new URL(cleanUrl);
    path = urlObj.pathname;
  } catch {
    path = cleanUrl;
  }
  
  if (path.startsWith('/collections/')) {
    const handle = path.replace('/collections/', '').split('/')[0];
    return `/${handle}`;
  }
  
  if (path.startsWith('/products/')) {
    const handle = path.replace('/products/', '').split('/')[0];
    return `/produkte/${handle}`;
  }
  
  if (path.startsWith('/pages/')) {
    const handle = path.replace('/pages/', '').split('/')[0];
    return `/${handle}`;
  }
  
  if (path.startsWith('/blogs/')) {
    const parts = path.split('/');
    const slug = parts[parts.length - 1];
    return `/blog/${slug}`;
  }
  
  if (path === '/' || path === '') {
    return '/';
  }
  
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    if (cleanUrl.includes('myshopify.com')) {
      try {
        const urlObj = new URL(cleanUrl);
        return mapShopifyUrl(urlObj.pathname);
      } catch {
        return url;
      }
    }
    return url;
  }
  
  return path;
}

/**
 * Render menu items recursively
 */
function renderMenuItems(items) {
  if (!items || items.length === 0) return null;
  
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={mapShopifyUrl(item.url)}
            className="text-gray-100 hover:text-gray-300 transition-colors"
          >
            {item.title}
          </Link>
          {item.items && item.items.length > 0 && (
            <ul className="ml-4 mt-2 space-y-1">
              {item.items.map((subItem) => (
                <li key={subItem.id} className="flex items-start">
                  <span className="text-white mr-2">•</span>
                  <Link
                    href={mapShopifyUrl(subItem.url)}
                    className="text-white hover:text-gray-300 transition-colors text-sm"
                  >
                    {subItem.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  const [footerMenu, setFooterMenu] = useState(null);

  useEffect(() => {
    // Fetch footer menu from Shopify
    fetch('/api/shopify-menu?handle=footer-1')
      .then((res) => res.json())
      .then((data) => {
        if (data.menu) {
          setFooterMenu(data.menu);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch footer menu:', err);
      });
  }, []);

  const menuItems = footerMenu?.items || [];

  return (
    <footer className="bg-[#16191d] text-white mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Footer Menu from Shopify */}
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <div key={item.id}>
                <h3 className="text-lg font-semibold mb-4">{item.title}</h3>
                {renderMenuItems(item.items)}
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center text-gray-400">
              Footer-Menü wird geladen...
            </div>
          )}
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
}
