import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import BlogPostsSlider from '@/components/containers/BlogPostsSlider';

export default function BlogPage() {
  return (
    <>
      <Header />
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <BlogPostsSlider />
      </div>
      <Footer />
    </>
  );
}

