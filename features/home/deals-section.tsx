import Link from 'next/link';
import { Flame } from 'lucide-react';
import { Button } from '@/components/ui';
import { promotionsApi } from '@/lib/api';

/**
 * Promotions / weekly deals section backed by /promotions/active.
 */
export async function DealsSection() {
  const promotions = await promotionsApi.active(4).catch(() => []);

  if (promotions.length === 0) {
    return (
      <section className="container-wide py-12" aria-labelledby="home-deals-heading">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-10 text-center dark:border-neutral-700 dark:bg-neutral-800/50">
          <div className="flex items-center gap-2">
            <Flame className="h-8 w-8 text-primary-500" aria-hidden />
            <h2 id="home-deals-heading" className="heading-section m-0">
              Oferte săptămânii
            </h2>
          </div>
          <p className="max-w-md text-neutral-600 dark:text-neutral-400">
            Reduceri și oferte speciale – revino curând pentru promoții actualizate.
          </p>
          <Button asChild>
            <Link href="/categorii">Vezi categoriile</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container-wide py-12" aria-labelledby="home-deals-heading">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-8 dark:border-neutral-700 dark:bg-neutral-800/50">
        <div className="flex items-center gap-2">
          <Flame className="h-8 w-8 text-primary-500" aria-hidden />
          <h2 id="home-deals-heading" className="heading-section m-0">
            Oferte săptămânii
          </h2>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900/40"
            >
              <p className="text-xs uppercase tracking-wide text-primary-600 dark:text-primary-400">
                {promotion.type === 'PERCENTAGE' ? `-${promotion.value}%` : `${promotion.value} RON`}
              </p>
              <h3 className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">
                {promotion.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-neutral-600 dark:text-neutral-400">
                {promotion.description ?? `Cod: ${promotion.code}`}
              </p>
              <p className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                Valabil până la {new Date(promotion.validTo).toLocaleDateString('ro-RO')}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button asChild>
            <Link href="/categorii">Vezi categoriile</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
