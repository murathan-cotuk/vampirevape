import Link from 'next/link';

export default function ImageGrid({ columns = 3 }) {
  const images = [
    { id: 1, image: '/images/grid-1.jpg', link: '/kategorie-1', title: 'Kategorie 1' },
    { id: 2, image: '/images/grid-2.jpg', link: '/kategorie-2', title: 'Kategorie 2' },
    { id: 3, image: '/images/grid-3.jpg', link: '/kategorie-3', title: 'Kategorie 3' },
  ];

  const gridCols = {
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className="container-custom py-12">
      <div className={`grid ${gridCols[columns] || gridCols[3]} gap-4`}>
        {images.map((item) => (
          <Link
            key={item.id}
            href={item.link}
            className="relative aspect-[520/300] rounded-lg overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark group-hover:scale-105 transition-transform duration-300" />
            <div className="relative z-10 h-full flex items-center justify-center">
              <h3 className="text-white text-xl font-bold">{item.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

