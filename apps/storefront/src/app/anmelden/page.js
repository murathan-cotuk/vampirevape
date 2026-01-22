'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/shopify/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Anmeldung fehlgeschlagen');
      }

      // Save customer ID to localStorage
      if (data.customerId) {
        localStorage.setItem('shopify_customer_id', data.customerId);
        window.dispatchEvent(new Event('authChange'));
      }

      router.push('/konto');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container-custom py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">Anmelden</h2>
            <form onSubmit={handleLogin} className="flex flex-col">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {error}
                </div>
              )}
              <input
                placeholder="E-Mail-Adresse"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-50 text-gray-900 border-0 rounded-md p-2 mb-3 focus:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary transition ease-in-out duration-150"
              />
              <div className="relative mb-3">
                <input
                  placeholder="Passwort"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-50 text-gray-900 border-0 rounded-md p-2 w-full pr-10 focus:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary transition ease-in-out duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.97 9.97 0 015 12c0 1.657.53 3.19 1.43 4.443m-2.14 1.557a10.05 10.05 0 01-1.29-5.5c0-4.478 2.943-8.268 7-9.543m11.086 9.543c-.5 1.5-1.5 2.8-2.8 3.7m-2.3 2.3c-1.5.5-3.1.8-4.9.8-4.478 0-8.268-2.943-9.543-7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-white font-semibold py-2 px-4 rounded-md mt-2 hover:bg-primary-dark transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
              </button>
              <div className="text-center mt-4">
                <Link href="/passwort-vergessen" className="text-sm text-primary hover:underline">
                  Passwort vergessen?
                </Link>
              </div>
              <p className="text-gray-600 text-sm mt-4 text-center">
                Noch kein Konto?{' '}
                <Link href="/registrieren" className="text-primary hover:underline">
                  Jetzt registrieren
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
