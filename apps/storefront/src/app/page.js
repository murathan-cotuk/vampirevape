import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import HeroSlider from '@/components/containers/HeroSlider';
import BannerSection from '@/components/containers/BannerSection';
import TopLiquidsSlider from '@/components/containers/TopLiquidsSlider';
import ImageGrid from '@/components/containers/ImageGrid';
import CategoryGrid from '@/components/containers/CategoryGrid';
import TrustedShopsReviews from '@/components/containers/TrustedShopsReviews';
import AwardWinningLiquids from '@/components/containers/AwardWinningLiquids';
import FlavoursGrid from '@/components/containers/FlavoursGrid';
import TopHardwareSlider from '@/components/containers/TopHardwareSlider';
import NewProductsSlider from '@/components/containers/NewProductsSlider';
import BlogPostsSlider from '@/components/containers/BlogPostsSlider';
import TextField from '@/components/containers/TextField';
import PaymentMethods from '@/components/containers/PaymentMethods';
import { getHeroSlides } from '@/utils/shopify';

// Force dynamic rendering since we fetch from Shopify API
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch hero slides from Shopify
  let heroSlides = [];
  try {
    heroSlides = await getHeroSlides();
  } catch (error) {
    console.error('Failed to load hero slides:', error);
  }

  return (
    <>
      <Header />
      <main>
        <HeroSlider slides={heroSlides} />
        <BannerSection variant="double" size="small" />
        <BannerSection variant="double" size="large" />
        <TopLiquidsSlider />
        <ImageGrid columns={3} />
        <CategoryGrid />
        <TrustedShopsReviews />
        <AwardWinningLiquids />
        <FlavoursGrid />
        <TopHardwareSlider />
        <NewProductsSlider />
        <BlogPostsSlider />
        <TextField />
        <PaymentMethods />
      </main>
      <Footer />
    </>
  );
}

