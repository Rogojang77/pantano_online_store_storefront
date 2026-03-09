import Link from 'next/link';
import Image from 'next/image';
import { Box } from 'lucide-react';
import { getMegaMenuData } from '@/lib/api/categories';
import type { MegaMenuCategory } from '@/types/category';

function CategoryCard({ category }: { category: MegaMenuCategory }) {
  const href = `/categorii/${category.slug}`;
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-6 shadow-card transition hover:border-primary-200 hover:shadow-card-hover dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-800"
    >
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-700">
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt=""
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="64px"
          />
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
