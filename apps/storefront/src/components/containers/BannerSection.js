import Link from 'next/link';
import Image from 'next/image';

export default function BannerSection({ variant = 'double', size = 'small' }) {
  const heightClass = size === 'small' ? 'h-[200px]' : 'h-[1000px]';
  
  const banners = [
    {
      id: 1,
      image: '/images/banner-1.jpg',
      title: 'Neue Liquids',
      link: '/e-liquids/neu',
    },
    {
      id: 2,
      image: '/images/banner-2.jpg',
      title: 'Hardware Sale',
      link: '/hardware/sale',
    },
  ];

  return (
    <div className={`container-custom py-8 ${variant === 'double' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}`}>
      {banners.map((banner) => (
        <Link
          key={banner.id}
          href={banner.link}
          className={`relative ${heightClass} rounded-lg overflow-hidden group`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-dark/80 z-10 group-hover:from-primary/90 group-hover:to-primary-dark/90 transition-all" />
          <div className="relative z-20 h-full flex items-center justify-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              {banner.title}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}

