'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Shopify Customer Account API authentication URL
  // This will be constructed dynamically based on your store
  const shopifyStoreDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'vampirevape-2.myshopify.com';
  
  // Extract store ID from domain (if needed) or use the provided client_id
  const handleRegister = () => {
    setIsLoading(true);
    
    // Construct Shopify authentication URL for registration
    // The URL structure: https://shopify.com/authentication/{store_id}/register
    // We'll redirect to Shopify's authentication page
    const authUrl = `https://shopify.com/authentication/96950845726/register?client_id=588c7463-8c31-4ea9-8a58-3294fbd41218&locale=de&redirect_uri=${encodeURIComponent('/authentication/96950845726/oauth/authorize?client_id=588c7463-8c31-4ea9-8a58-3294fbd41218&locale=de&nonce=' + Date.now() + '&redirect_uri=' + encodeURIComponent(window.location.origin + '/konto') + '&response_type=code&scope=openid+email+customer-account-api%3Afull&state=' + Date.now())}`;
    
    window.location.href = authUrl;
  };

  return (
    <>
      <Header />
      <div className="container-custom py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center text-primary">Registrieren</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-700 mb-6">
              Erstellen Sie ein Konto, um schneller zu bestellen und Ihre Bestellungen zu verfolgen.
            </p>
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="btn-primary w-full py-4 text-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Wird weitergeleitet...' : 'Mit Shopify registrieren'}
            </button>
            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-gray-600 mb-2">Bereits ein Konto?</p>
              <Link href="/anmelden" className="btn-outline inline-block">
                Jetzt anmelden
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}


