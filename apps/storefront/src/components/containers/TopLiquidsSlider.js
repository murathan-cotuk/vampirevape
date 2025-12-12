'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useShopifyProducts } from '@/utils/shopify';

export default function TopLiquidsSlider() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch top liquids from Shopify
    // const fetchProducts = async () => {
    //   const data = await useShopifyProducts({ collection: 'top-liquids', limit: 10 });
    //   setProducts(data);
    //   setLoading(false);
    // };
    // fetchProducts();
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="container-custom py-12">Lädt...</div>;
  }

  return (
    <section className="container-custom py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Top Liquids</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow">
            <div className="aspect-square bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Produktbild
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                Produktname {item}
              </h3>
              <p className="text-primary font-bold text-lg">19,99 €</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

