'use client';

import { useState, useEffect } from 'react';

export default function TrustedShopsReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // TODO: Integrate Trusted Shops API
    // Fetch reviews from Trusted Shops
    setReviews([
      { id: 1, author: 'Max M.', rating: 5, text: 'Schnelle Lieferung, tolle Qualität!' },
      { id: 2, author: 'Sarah K.', rating: 5, text: 'Sehr zufrieden mit den Produkten.' },
      { id: 3, author: 'Tom B.', rating: 5, text: 'Bester Service, gerne wieder!' },
    ]);
  }, []);

  return (
    <section className="bg-gray-100 py-12">
      <div className="container-custom">
        <h2 className="text-3xl font-bold mb-8 text-center">Kundenbewertungen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">{review.text}</p>
              <p className="text-sm text-gray-500">— {review.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

