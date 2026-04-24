import Link from 'next/link';
import Image from 'next/image';
import { categoriesApi } from '@/lib/api';
import { Button } from '@/components/ui';
import { CategoryBreadcrumbs } from '@/features/categories/category-breadcrumbs';
import { resolveBackendMediaUrl } from '@/lib/resolve-backend-media-url';

export const dynamic = 'force-dynamic';

export default async function CategoriesIndexPage() {
  let roots: {
    id: string;
    name: string;
    slug: string;
    children: { id: string; name: string; slug: string; imageUrl?: string | null }[];
  }[] = [];
  try {
    const allCategories = await categoriesApi.tree();
    const childrenByParentId = new Map<string, { id: string; name: string; slug: string; imageUrl?: string | null }[]>();

    for (const category of allCategories) {
      if (!category.parentId) continue;
      const siblings = childrenByParentId.get(category.parentId) ?? [];
      siblings.push({ id: category.id, name: category.name, slug: category.slug, imageUrl: category.imageUrl });
      childrenByParentId.set(category.parentId, siblings);
    }

    roots = allCategories
      .filter((category) => !category.parentId)
      .map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        children: (childrenByParentId.get(category.id) ?? []).sort((a, b) => a.name.localeCompare(b.name, 'ro')),
      }));
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
      <ul className="space-y-4">
        {roots.map((cat) => (
          <li key={cat.id}>
            <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
              <Button asChild variant="outline" size="lg" className="h-auto w-full justify-start py-4">
                <Link href={`/categorii/${cat.slug}`}>{cat.name}</Link>
              </Button>
              {cat.children.length > 0 && (
                <ul className="mt-3 flex gap-3 overflow-x-auto pb-2">
                  {cat.children.map((child) => (
                    <li key={child.id} className="shrink-0">
                      <Link
                        href={`/categorii/${child.slug}`}
                        className="block w-36 overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:border-primary-300 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-primary-700"
                      >
                        {child.imageUrl ? (
                          <div className="relative h-24 w-full bg-neutral-100 dark:bg-neutral-800">
                            <Image
                              src={resolveBackendMediaUrl(child.imageUrl)}
                              alt={child.name}
                              fill
                              sizes="144px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-24 w-full bg-neutral-100 dark:bg-neutral-800" />
                        )}
                        <span className="line-clamp-2 block px-3 py-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                          {child.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
      {roots.length === 0 && (
        <p className="text-neutral-500">Nicio categorie disponibilă.</p>
      )}
    </div>
  );
}
