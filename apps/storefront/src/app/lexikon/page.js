import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

export default function LexikonPage() {
  return (
    <>
      <Header />
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-8">Lexikon</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* TODO: Fetch from Strapi */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold mb-2">Lexikon Eintrag {item}</h2>
              <p className="text-gray-600">Beschreibung...</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

