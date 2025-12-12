import Link from 'next/link';

export default function CategoryGrid() {
  const categories = [
    { id: 1, name: 'Fruchtig', image: '/images/cat-1.jpg', link: '/kategorien/fruchtig' },
    { id: 2, name: 'Süß', image: '/images/cat-2.jpg', link: '/kategorien/suess' },
    { id: 3, name: 'Menthol', image: '/images/cat-3.jpg', link: '/kategorien/menthol' },
    { id: 4, name: 'Tabak', image: '/images/cat-4.jpg', link: '/kategorien/tabak' },
    { id: 5, name: 'Dessert', image: '/images/cat-5.jpg', link: '/kategorien/dessert' },
    { id: 6, name: 'Getränke', image: '/images/cat-6.jpg', link: '/kategorien/getraenke' },
  ];

  return (
    <section className="container-custom py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Beliebte Kategorien</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.link}
            className="relative aspect-[520/300] rounded-lg overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary to-secondary-dark group-hover:scale-105 transition-transform duration-300" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
              <h3 className="text-white text-xl font-bold text-center">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

