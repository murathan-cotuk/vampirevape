import { redirect } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

export default function AccountPage() {
  // TODO: Check authentication
  // if (!isAuthenticated) {
  //   redirect('/anmelden');
  // }

  return (
    <>
      <Header />
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-8">Mein Konto</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/konto/profil"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-bold mb-2">Persönliches Profil</h2>
            <p className="text-gray-600">Ihre Kontoinformationen verwalten</p>
          </a>
          <a
            href="/konto/bestellungen"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-bold mb-2">Bestellungen</h2>
            <p className="text-gray-600">Ihre Bestellhistorie ansehen</p>
          </a>
          <a
            href="/konto/adressen"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-bold mb-2">Adressen</h2>
            <p className="text-gray-600">Liefer- und Rechnungsadressen</p>
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
}

