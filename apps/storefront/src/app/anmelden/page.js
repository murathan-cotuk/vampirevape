'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement login logic
  };

  return (
    <>
      <Header />
      <div className="container-custom py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Anmelden</h1>
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <label className="block font-semibold mb-2">E-Mail-Adresse</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div className="mb-6">
              <label className="block font-semibold mb-2">Passwort</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <button type="submit" className="btn-primary w-full py-4 text-lg mb-4">
              Anmelden
            </button>
            <div className="text-center">
              <Link href="/passwort-vergessen" className="text-primary hover:underline">
                Passwort vergessen?
              </Link>
            </div>
            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-gray-600 mb-2">Noch kein Konto?</p>
              <Link href="/registrieren" className="btn-outline inline-block">
                Jetzt registrieren
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

