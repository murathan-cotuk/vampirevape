'use client';

export default function NewProductsSlider() {
  return (
    <section className="container-custom py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Unsere Neuheiten</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow">
            <div className="aspect-square bg-gray-200 relative">
              <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                NEU
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Neuheit Bild
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                Neuheit {item}
              </h3>
              <p className="text-primary font-bold text-lg">24,99 €</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

