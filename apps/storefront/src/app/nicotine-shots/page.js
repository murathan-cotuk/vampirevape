import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { getCollections } from '@/utils/shopify';
import Link from 'next/link';
import Image from 'next/image';

export async function generateMetadata() {
  return {
    title: 'Nicotine Shots – Vampire Vape',
    description: 'Nicotine Shots für Ihre E-Liquids. Hochwertige Nikotin-Shots in verschiedenen Stärken.',
  };
}

export default async function NicotineShotsPage() {
  let collections = [];
  try {
    const data = await getCollections({ limit: 50 });
    collections = data?.collections?.edges
      ?.map((e) => e.node)
      ?.filter((col) =>
        col.title?.toLowerCase().includes('nicotine') ||
        col.title?.toLowerCase().includes('shot') ||
        col.handle?.toLowerCase().includes('nicotine') ||
        col.handle?.toLowerCase().includes('shot')
      ) || [];
  } catch (_) {}

  return (
    <>
      <Header />
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-8">Nicotine Shots</h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Nicotine Shots ermöglichen es Ihnen, Ihre E-Liquids individuell zu dosieren. 
          Wählen Sie aus verschiedenen Stärken und Volumen.
        </p>

        {collections.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/kategorien/${collection.handle}`}
                className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow"
              >
                {collection.image?.url ? (
                  <div className="aspect-square relative">
                    <Image
                      src={collection.image.url}
                      alt={collection.image.altText || collection.title}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">Kein Bild</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {collection.title}
                  </h3>
                  {collection.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">
              Es sind noch keine Nicotine Shots-Kategorien verfügbar. Bitte fügen Sie in Shopify Collections hinzu.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

