'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchResults({ query, isOpen, onClose }) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Doofinder API call
    const doofinderSearch = async () => {
      try {
        // Replace with your Doofinder hash and zone
        const hash = process.env.NEXT_PUBLIC_DOOFINDER_HASH || '';
        const zone = process.env.NEXT_PUBLIC_DOOFINDER_ZONE || 'eu1';
        
        if (!hash) {
          // Fallback to local search if Doofinder not configured
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `https://${zone}-search.doofinder.com/5/search?hash=${hash}&query=${encodeURIComponent(query)}&page=1&rpp=5`
        );
        
        const data = await response.json();
        
        if (data.results) {
          setResults(data.results.map(item => ({
            id: item.id,
            title: item.title,
            link: item.link,
            image: item.image_link,
            price: item.price,
          })));
        }
      } catch (error) {
        console.error('Doofinder search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(doofinderSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || (!query || query.length < 2)) {
    return null;
  }

  return (
    <div 
      ref={searchRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border-2 border-gray-200 z-[100] max-h-96 overflow-y-auto"
    >
      {isLoading ? (
        <div className="p-4 text-center text-gray-600">Suche...</div>
      ) : results.length > 0 ? (
        <div className="py-2">
          {results.map((item) => (
            <Link
              key={item.id}
              href={item.link || '#'}
              onClick={onClose}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              {item.image && (
                <div className="w-16 h-16 relative flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover rounded"
                    sizes="64px"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900 truncate">{item.title}</h3>
                {item.price && (
                  <p className="text-primary font-bold text-sm mt-1">
                    {new Intl.NumberFormat('de-DE', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(item.price)}
                  </p>
                )}
              </div>
            </Link>
          ))}
          <Link
            href={`/suche?q=${encodeURIComponent(query)}`}
            onClick={onClose}
            className="block p-4 text-center text-primary font-semibold hover:bg-gray-50 border-t"
          >
            Alle Ergebnisse anzeigen
          </Link>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-600">
          Keine Ergebnisse gefunden
        </div>
      )}
    </div>
  );
}

