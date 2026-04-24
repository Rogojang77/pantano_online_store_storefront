import Link from 'next/link';
import Image from 'next/image';
import {
  Box,
  type LucideIcon,
  Hammer,
  Wrench,
  Drill,
  PaintBucket,
  Package,
  Lightbulb,
  Leaf,
  Droplets,
  Snowflake,
  Grid3X3,
  ShowerHead,
  BrickWall,
  DoorOpen,
  Palette,
  CookingPot,
  PawPrint,
  SunMedium,
  TreePine,
  Sparkles,
  ChefHat,
} from 'lucide-react';
import { getMegaMenuData } from '@/lib/api/categories';
import type { MegaMenuCategory } from '@/types/category';
import { resolveBackendMediaUrl } from '@/lib/resolve-backend-media-url';

const HOMEPAGE_CATEGORY_ICON_BY_SLUG: Record<string, LucideIcon> = {
  'baie-sanitare': ShowerHead,
  'materiale-de-constructii': BrickWall,
  'lemn-ferestre-usi': DoorOpen,
  parchet: Grid3X3,
  'gresie-faianta-pardoseli': Grid3X3,
  feronerie: Wrench,
  'vopsea-tapet': PaintBucket,
  gradina: Leaf,
  'incalzire-climatizare-ventilatie': Snowflake,
  'decoratiuni-interioare-tablouri': Palette,
  bucatarie: CookingPot,
  'electrice-corpuri-de-iluminat': Lightbulb,
  'scule-masini-unelte-rafturi': Hammer,
  'petshop-online': PawPrint,
  'sisteme-fotovoltaice-solare': SunMedium,
  'brazi-si-decoratiuni-de-craciun': TreePine,
  'curatenie-menaj': Sparkles,
  'echipamente-horeca': ChefHat,
  'stiluri-de-amenajari-interioare-hornbach': Palette,
};

const HOMEPAGE_CATEGORY_ICON_BY_NAME: Record<string, LucideIcon> = {
  'scule si unelte': Hammer,
  'materiale de constructii': Package,
  instalatii: Droplets,
  finisaje: PaintBucket,
  'climatizare si ventilatie': Snowflake,
  'electrice si iluminat': Lightbulb,
  gradina: Leaf,
};

function normalizeCategoryKey(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ');
}

function resolveHomepageCategoryIcon(category: MegaMenuCategory): LucideIcon | null {
  const slugIcon = HOMEPAGE_CATEGORY_ICON_BY_SLUG[category.slug];
  if (slugIcon) return slugIcon;

  const normalizedName = normalizeCategoryKey(category.name);
  return HOMEPAGE_CATEGORY_ICON_BY_NAME[normalizedName] ?? null;
}


function CategoryCard({ category }: { category: MegaMenuCategory }) {
  const href = `/categorii/${category.slug}`;
  const CategoryIcon = resolveHomepageCategoryIcon(category);
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-6 shadow-card transition hover:border-primary-200 hover:shadow-card-hover dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-800"
    >
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-700">
        {category.imageUrl ? (
          <Image
            src={resolveBackendMediaUrl(category.imageUrl)}
            alt=""
            fill
            className="object-contain transition group-hover:scale-105"
            sizes="64px"
          />
        ) : CategoryIcon ? (
          <CategoryIcon className="h-8 w-8 text-neutral-500 dark:text-neutral-400" aria-hidden />
        ) : (
          <Box className="h-8 w-8 text-neutral-500 dark:text-neutral-400" aria-hidden />
        )}
      </div>
      <span className="text-center font-medium text-neutral-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
        {category.name}
      </span>
    </Link>
  );
}

export async function CategoriesSection() {
  let categories: MegaMenuCategory[] = [];
  try {
    const data = await getMegaMenuData();
    categories = data.categories ?? [];
  } catch {
    categories = [];
  }

  if (categories.length === 0) return null;

  return (
    <section className="container-wide py-12" aria-labelledby="home-categories-heading">
      <h2 id="home-categories-heading" className="heading-section mb-8">
        Categorii
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </section>
  );
}
