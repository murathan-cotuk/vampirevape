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
    const customerToken = localStorage.getItem('shopify_customer_token');
    const tokenExpiresAt = localStorage.getItem('shopify_customer_token_expires_at');

    if (customerToken && tokenExpiresAt && new Date(tokenExpiresAt).getTime() <= Date.now()) {
      localStorage.removeItem('shopify_customer_token');
      localStorage.removeItem('shopify_customer_token_expires_at');
    }

    const freshToken = localStorage.getItem('shopify_customer_token');
    if (!freshToken && !customerId) {
      router.push('/anmelden');
      return;
    }

    setIsAuthenticated(true);

    const loadCustomer = async () => {
      try {
        if (freshToken) {
          const tokenRes = await fetch(`/api/shopify/customer?token=${encodeURIComponent(freshToken)}`);
          const tokenData = await tokenRes.json();
          if (tokenRes.ok && tokenData.customer) {
            setCustomer(tokenData.customer);
            return;
          }
        }

        if (customerId) {
          const idRes = await fetch(`/api/shopify/customer?id=${customerId}`);
          const idData = await idRes.json();
          if (idRes.ok && idData.customer) {
            setCustomer(idData.customer);
            return;
          }
        }

        router.push('/anmelden');
      } catch (err) {
        console.error('Error fetching customer:', err);
        router.push('/anmelden');
      }
    };

    loadCustomer();
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
          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">Willkommen,</span> {customer.first_name || customer.email}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Newsletter-Status:</span>{' '}
              <span className={customer.newsletter_status === 'SUBSCRIBED' ? 'text-green-700' : 'text-gray-700'}>
                {customer.newsletter_status || 'UNKNOWN'}
              </span>
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

