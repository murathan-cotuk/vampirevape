import Link from 'next/link';
import Image from 'next/image';

const isExternalLink = (href) => typeof href === 'string' && /^https?:\/\//i.test(href);

export default function BannerSection({ variant = 'double', size = 'small', banners = [] }) {
  const heightClass = size === 'small' ? 'h-[200px]' : 'h-[1000px]';

  // Shopify metafield boşsa fallback göster
  const fallbackBanners = [
    {
      id: 1,
      image: 'https://cdn.shopify.com/s/files/1/0969/5084/5726/files/DOJO_Banner_1.png?v=1767174504',
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

  const bannersToRender = Array.isArray(banners) && banners.length ? banners : fallbackBanners;

  return (
    <div className={`container-custom py-8 ${variant === 'double' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}`}>
      {bannersToRender.map((banner) => {
        const href = banner.link || '#';

        const content = (
          <div className={`relative ${heightClass} rounded-lg overflow-hidden group`}>
            {banner.image ? (
              <img
                src={banner.image}
                alt={banner.title || 'Banner'}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-dark/80 z-10 group-hover:from-primary/90 group-hover:to-primary-dark/90 transition-all" />
            <div className="relative z-20 h-full flex items-center justify-center px-4 text-center">
              {banner.title ? (
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  {banner.title}
                </h3>
              ) : null}
            </div>
          </div>
        );

        if (isExternalLink(href)) {
          return (
            <a key={banner.id} href={href} className="block" target="_blank" rel="noreferrer">
              {content}
            </a>
          );
        }

        return (
          <Link key={banner.id} href={href} className="block">
            {content}
          </Link>
        );
      })}
    </div>
  );
}

