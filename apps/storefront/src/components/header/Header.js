'use client';

import { useState, useEffect } from 'react';
import AnnouncementBar from './AnnouncementBar';
import TopBar from './TopBar';
import LogoSearchCart from './LogoSearchCart';
import Navbar from './Navbar';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    // Fetch menu from Shopify via API route (Storefront API)
    // Try main-menu-1 first (Shopify default), fallback to main-menu
    fetch('/api/shopify-menu?handle=main-menu-1')
      .then((res) => res.json())
      .then((data) => {
        if (data.menu) {
          setMenu(data.menu);
        } else {
          // Fallback to main-menu if main-menu-1 doesn't exist
          fetch('/api/shopify-menu?handle=main-menu')
            .then((res) => res.json())
            .then((fallbackData) => {
              setMenu(fallbackData.menu);
            })
            .catch((err) => {
              console.error('Failed to fetch fallback menu:', err);
            });
        }
      })
      .catch((err) => {
        console.error('Failed to fetch menu:', err);
      });
  }, []);

  return (
    <>
      <header className="bg-white shadow-md">
        <AnnouncementBar />
        <TopBar />
        <LogoSearchCart 
          isAccountOpen={isAccountOpen}
          setIsAccountOpen={setIsAccountOpen}
        />
      </header>
      <Navbar 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        menu={menu}
      />
    </>
  );
}

