'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

export default function AccountPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const customerId = localStorage.getItem('shopify_customer_id');
    
    if (!customerId) {
      router.push('/anmelden');
      return;
    }

    setIsAuthenticated(true);
    
    // Fetch customer data
    fetch(`/api/shopify/customer?id=${customerId}`)
      .then(res => res.json())
      .then(data => {
        if (data.customer) {
          setCustomer(data.customer);
        }
      })
      .catch(err => console.error('Error fetching customer:', err));
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-8">Mein Konto</h1>
        {customer && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">
              <span className="font-semibold">Willkommen,</span> {customer.first_name || customer.email}
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/konto/profil"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-bold mb-2">Persönliches Profil</h2>
            <p className="text-gray-600">Ihre Kontoinformationen verwalten</p>
          </a>
          <a
            href="/konto/bestellungen"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-bold mb-2">Bestellungen</h2>
            <p className="text-gray-600">Ihre Bestellhistorie ansehen</p>
          </a>
          <a
            href="/konto/adressen"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-bold mb-2">Adressen</h2>
            <p className="text-gray-600">Liefer- und Rechnungsadressen</p>
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
}

