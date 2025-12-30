'use client';

import { useState, useEffect } from 'react';
import AnnouncementBar from './AnnouncementBar';
import TopBar from './TopBar';
import LogoSearchCart from './LogoSearchCart';
import Navbar from './Navbar';
import { getCollections } from '@/utils/shopify';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    // Fetch collections from Shopify to build dynamic menu
    getCollections({ limit: 50 })
      .then((data) => {
        const collectionsList = data?.collections?.edges?.map((e) => e.node) || [];
        setCollections(collectionsList);
      })
      .catch((err) => {
        console.error('Failed to fetch collections:', err);
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
        collections={collections}
      />
    </header>
  );
}

