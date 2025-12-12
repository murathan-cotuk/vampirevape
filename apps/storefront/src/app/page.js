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

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSlider />
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

