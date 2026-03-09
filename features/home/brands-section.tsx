import Link from 'next/link';
import Image from 'next/image';
import { brandsApi } from '@/lib/api';

const BRANDS_LIMIT = 12;

export async function BrandsSection() {
  let brands: Awaited<ReturnType<typeof brandsApi.list>> = [];
  try {
    brands = await brandsApi.list();
    brands = brands.slice(0, BRANDS_LIMIT);
  } catch {
    brands = [];
  }

  if (brands.length === 0) return null;

  return (
    <section className="container-wide py-12" aria-labelledby="home-brands-heading">
      <h2 id="home-brands-heading" className="heading-section mb-8">
        Branduri partenere
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-8">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/produse?brandId=${brand.id}`}
            className="flex h-16 w-32 items-center justify-center rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-primary-200 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-800"
          >
            {brand.logoUrl ? (
              <Image
                src={brand.logoUrl}
                alt={brand.name}
                width={128}
                height={64}
                className="h-auto max-h-12 w-auto object-contain"
              />
            ) : (
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {brand.name}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
