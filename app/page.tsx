import { CmsBlockRenderer } from '@/components/cms/block-renderer';
import { getBlocksByPlacement } from '@/lib/api/cms';
import { CategoriesSection } from '@/features/home/categories-section';
import { FeaturedProductsSection } from '@/features/home/featured-products-section';
import { DealsSection } from '@/features/home/deals-section';
import { TrustSection } from '@/features/home/trust-section';
import { BrandsSection } from '@/features/home/brands-section';
import { NewsletterSection } from '@/features/home/newsletter-section';

export const dynamic = 'force-dynamic';
export default async function HomePage() {
  const homeBlocks = await getBlocksByPlacement('home');

  return (
    <>
      {homeBlocks.map((block) => (
        <CmsBlockRenderer key={block.id} block={block} />
      ))}
      <CategoriesSection />
      <FeaturedProductsSection />
      <DealsSection />
      <TrustSection />
      <BrandsSection />
      <NewsletterSection />
    </>
  );
}
