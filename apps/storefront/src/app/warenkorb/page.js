import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

export default function CartPage() {
  return (
    <>
      <Header />
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-8">Warenkorb</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600">Ihr Warenkorb ist leer.</p>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Zusammenfassung</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Zwischensumme</span>
                  <span>0,00 €</span>
                </div>
                <div className="flex justify-between">
                  <span>Versand</span>
                  <span>Kostenlos</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Gesamt</span>
                  <span>0,00 €</span>
                </div>
              </div>
              <button className="btn-primary w-full py-4 text-lg">
                Zur Kasse
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

