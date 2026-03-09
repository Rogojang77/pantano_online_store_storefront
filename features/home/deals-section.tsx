import Link from 'next/link';
import { Flame } from 'lucide-react';
import { Button } from '@/components/ui';

/**
 * Placeholder for Promotions / Weekly deals.
 * Phase 3: wire to GET /promotions/active or CMS deals block.
 */
export function DealsSection() {
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
          <Link href="/produse">Vezi produsele</Link>
        </Button>
      </div>
    </section>
  );
}
