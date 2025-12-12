'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Integrate with Mailchimp API
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ihre E-Mail-Adresse"
          required
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Abonnieren
        </button>
      </div>
      {status === 'success' && (
        <p className="text-green-400 text-sm mt-2">Erfolgreich angemeldet!</p>
      )}
    </form>
  );
}

