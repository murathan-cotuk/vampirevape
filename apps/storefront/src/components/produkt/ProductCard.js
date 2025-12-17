import Link from 'next/link';
import Image from 'next/image';

function formatPrice(amount, currencyCode) {
  try {
    const value = Number(amount || 0);
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currencyCode || 'EUR',
    }).format(value);
  } catch {
    return `${amount} ${currencyCode || 'EUR'}`;
  }
}

export default function ProductCard({ product }) {
  const image = product?.images?.edges?.[0]?.node;
  const price = product?.priceRange?.minVariantPrice;

  return (
    <Link
      href={`/produkte/${product.handle}`}
      className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow"
    >
      <div className="aspect-square bg-gray-100 relative">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Kein Bild
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {product.title}
        </h3>
        <p className="text-primary font-bold text-lg">
          {formatPrice(price?.amount, price?.currencyCode)}
        </p>
      </div>
    </Link>
  );
}


