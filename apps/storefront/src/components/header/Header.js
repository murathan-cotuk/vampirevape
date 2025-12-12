'use client';

import { useState } from 'react';
import AnnouncementBar from './AnnouncementBar';
import TopBar from './TopBar';
import LogoSearchCart from './LogoSearchCart';
import Navbar from './Navbar';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

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
      />
    </header>
  );
}

