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
    // Fetch menu from Shopify via API route (Admin API requires server-side)
    fetch('/api/shopify-menu')
      .then((res) => res.json())
      .then((data) => {
        setMenu(data.menu);
      })
      .catch((err) => {
        console.error('Failed to fetch menu:', err);
      });
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <AnnouncementBar />
      <TopBar />
      <LogoSearchCart 
        isAccountOpen={isAccountOpen}
        setIsAccountOpen={setIsAccountOpen}
      />
      <Navbar 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        menu={menu}
      />
    </header>
  );
}

