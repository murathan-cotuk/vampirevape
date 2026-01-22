'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

export default function NewsletterAnmeldungPage() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState('subscribe'); // 'subscribe' or 'unsubscribe'
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if redirected from unsubscribe link
    if (searchParams.get('unsubscribed') === 'true') {
      setStatus('unsubscribed');
      setMode('unsubscribe');
      setTimeout(() => setStatus(null), 5000);
    }
    // Check for error parameter
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      setMode('unsubscribe');
      setTimeout(() => setError(''), 5000);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setError('');
    setIsLoading(true);

    try {
      const endpoint = mode === 'subscribe' ? '/api/newsletter/subscribe' : '/api/newsletter/unsubscribe';
      const body = mode === 'subscribe' 
        ? { email, firstName, lastName }
        : { email };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || (mode === 'subscribe' ? 'Newsletter-Anmeldung fehlgeschlagen' : 'Newsletter-Abmeldung fehlgeschlagen'));
      }

      setStatus(mode === 'subscribe' ? 'success' : 'unsubscribed');
      setEmail('');
      if (mode === 'subscribe') {
        setFirstName('');
        setLastName('');
      }
      setTimeout(() => setStatus(null), 5000);
    } catch (err) {
      setError(err.message || 'Ein Fehler ist aufgetreten.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container-custom py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center text-primary">
            {mode === 'subscribe' ? 'Newsletter Anmeldung' : 'Newsletter Abmeldung'}
          </h1>
          
          {/* Mode Toggle */}
          <div className="mb-6 flex justify-center gap-4">
            <button
              type="button"
              onClick={() => setMode('subscribe')}
              className={`px-6 py-2 rounded-md font-semibold transition-colors ${
                mode === 'subscribe'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Anmelden
            </button>
            <button
              type="button"
              onClick={() => setMode('unsubscribe')}
              className={`px-6 py-2 rounded-md font-semibold transition-colors ${
                mode === 'unsubscribe'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Abmelden
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-700 mb-6 text-center">
              {mode === 'subscribe' 
                ? 'Melden Sie sich für unseren Newsletter an und verpassen Sie keine Angebote, Neuigkeiten und exklusiven Rabatte!'
                : 'Möchten Sie sich vom Newsletter abmelden? Geben Sie einfach Ihre E-Mail-Adresse ein.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {error}
                </div>
              )}

              {status === 'success' && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
                  Erfolgreich für den Newsletter angemeldet! Vielen Dank für Ihre Anmeldung.
                </div>
              )}

              {status === 'unsubscribed' && (
                <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded text-sm">
                  Erfolgreich vom Newsletter abgemeldet! Sie erhalten keine weiteren Newsletter mehr.
                </div>
              )}

              {mode === 'subscribe' && (
                <div className="flex space-x-3">
                  <div className="w-1/2">
                    <label htmlFor="firstName" className="block text-sm font-semibold mb-1 text-gray-700">
                      Vorname
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Max"
                      className="bg-gray-50 text-gray-900 border-0 rounded-md p-2 w-full focus:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary transition ease-in-out duration-150"
                    />
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="lastName" className="block text-sm font-semibold mb-1 text-gray-700">
                      Nachname
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Mustermann"
                      className="bg-gray-50 text-gray-900 border-0 rounded-md p-2 w-full focus:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary transition ease-in-out duration-150"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-1 text-gray-700">
                  E-Mail-Adresse <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="max.mustermann@example.com"
                  required
                  className="bg-gray-50 text-gray-900 border-0 rounded-md p-2 w-full focus:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary transition ease-in-out duration-150"
                />
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Mit Ihrer Anmeldung stimmen Sie unseren <Link href="/datenschutz" className="text-primary hover:underline">Datenschutzbestimmungen</Link> zu. 
                Sie können sich jederzeit wieder abmelden.
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className={`font-bold py-2 px-4 rounded-md mt-4 transition ease-in-out duration-150 w-full disabled:opacity-50 disabled:cursor-not-allowed ${
                  mode === 'subscribe'
                    ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:bg-indigo-600 hover:to-blue-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {isLoading 
                  ? (mode === 'subscribe' ? 'Wird angemeldet...' : 'Wird abgemeldet...')
                  : (mode === 'subscribe' ? 'Newsletter abonnieren' : 'Newsletter abmelden')
                }
              </button>
            </form>
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-primary">Warum Newsletter abonnieren?</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Exklusive Angebote und Rabatte</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Erste Informationen über neue Produkte</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>5% Rabatt auf Ihre erste Bestellung</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Jederzeit kündbar</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
