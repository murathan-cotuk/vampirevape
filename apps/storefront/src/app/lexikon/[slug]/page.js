import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

export async function generateMetadata({ params }) {
  const { slug } = params;
  // TODO: Fetch from Strapi
  return {
    title: `Lexikon - Vampire Vape`,
    description: 'Lexikon Eintrag Beschreibung',
  };
}

export default function LexikonEntryPage({ params }) {
  const { slug } = params;
  // TODO: Fetch lexikon entry from Strapi

  return (
    <>
      <Header />
      <article className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-6">Lexikon: {slug}</h1>
        <div className="prose max-w-none">
          <p>Lexikon content will be loaded from Strapi CMS...</p>
        </div>
      </article>
      <Footer />
    </>
  );
}

