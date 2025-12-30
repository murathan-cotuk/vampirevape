import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

export async function generateMetadata({ params }) {
  const { slug } = params;
  return {
    title: `Blog Post - Vampire Vape`,
    description: 'Blog Post Beschreibung',
  };
}

export default function BlogPostPage({ params }) {
  const { slug } = params;
  // TODO: Fetch blog post from Shopify Pages or Markdown

  return (
    <>
      <Header />
      <article className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-6">Blog Post: {slug}</h1>
        <div className="prose max-w-none">
          <p>Blog content will be loaded from Shopify Pages or Markdown files...</p>
        </div>
      </article>
      <Footer />
    </>
  );
}

