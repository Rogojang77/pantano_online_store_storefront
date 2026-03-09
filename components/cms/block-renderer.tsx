import type { CmsBlock } from '@/types/api';
import { HeroBlock } from '@/components/cms/hero-block';
import { PromoGridBlock } from '@/components/cms/promo-grid-block';
import { BannerBlock } from '@/components/cms/banner-block';

interface CmsBlockRendererProps {
  block: CmsBlock;
}

export function CmsBlockRenderer({ block }: CmsBlockRendererProps) {
  switch (block.type) {
    case 'hero':
      return <HeroBlock block={block} />;
    case 'promo_grid':
      return <PromoGridBlock block={block} />;
    case 'banner':
      return <BannerBlock block={block} />;
    default:
      return null;
  }
}
