import Link from 'next/link';
import Image from 'next/image';

export default function AwardWinningLiquids() {
  return (
    <section className="container-custom py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Preisgekrönte Liquids</h2>
          <p className="text-gray-700 mb-6">
            Unsere Premium E-Liquids wurden mehrfach ausgezeichnet und überzeugen durch 
            außergewöhnliche Qualität und einzigartige Aromen. Entdecken Sie unsere 
            preisgekrönten Sorten und erleben Sie den Unterschied.
          </p>
          <Link href="/e-liquids/preisgekroent" className="btn-primary inline-block">
            Jetzt entdecken
          </Link>
        </div>
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary to-primary-dark">
          <div className="absolute inset-0 flex items-center justify-center text-white text-xl">
            Auszeichnungen
          </div>
        </div>
      </div>
    </section>
  );
}

