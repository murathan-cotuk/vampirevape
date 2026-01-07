'use client';

import { useState, useEffect } from 'react';
import Loader from './Loader';

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      // Add small delay for smooth transition
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      // Also check after a timeout in case load event doesn't fire
      const timeout = setTimeout(handleLoad, 2000);
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(timeout);
      };
    }
  }, []);

  if (!isLoading) return null;

  return <Loader />;
}

