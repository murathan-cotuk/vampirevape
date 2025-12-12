import Link from 'next/link';

export default function FlavoursGrid() {
  const flavours = [
    { id: 1, name: 'Erdbeere', image: '/images/flavour-1.jpg', link: '/aromen/erdbeere' },
    { id: 2, name: 'Vanille', image: '/images/flavour-2.jpg', link: '/aromen/vanille' },
    { id: 3, name: 'Menthol', image: '/images/flavour-3.jpg', link: '/aromen/menthol' },
    { id: 4, name: 'Tobacco', image: '/images/flavour-4.jpg', link: '/aromen/tobacco' },
  ];

  return (
    <section className="container-custom py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Beliebte Aromen</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {flavours.map((flavour) => (
          <Link
            key={flavour.id}
            href={flavour.link}
            className="relative aspect-[400/500] rounded-lg overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-light to-primary-dark group-hover:scale-105 transition-transform duration-300" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
              <h3 className="text-white text-xl font-bold text-center">{flavour.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

