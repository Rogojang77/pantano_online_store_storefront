import Link from 'next/link';
import { categoriesApi } from '@/lib/api';
import { Button } from '@/components/ui';
import { CategoryBreadcrumbs } from '@/features/categories/category-breadcrumbs';

export default async function CategoriesIndexPage() {
  let roots: { id: string; name: string; slug: string }[] = [];
  try {
    roots = await categoriesApi.roots();
  } catch {
    // ignore
  }

  return (
    <div className="container-wide py-12">
      <CategoryBreadcrumbs
        items={[{ name: 'Categorii', slug: '' }]}
        className="mb-6"
      />
      <h1 className="heading-page mb-8">Categorii</h1>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roots.map((cat) => (
          <li key={cat.id}>
            <Button asChild variant="outline" size="lg" className="h-auto w-full justify-start py-4">
              <Link href={`/categorii/${cat.slug}`}>{cat.name}</Link>
            </Button>
          </li>
        ))}
      </ul>
      {roots.length === 0 && (
        <p className="text-neutral-500">Nicio categorie disponibilă.</p>
      )}
    </div>
  );
}
