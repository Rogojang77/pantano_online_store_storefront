import type { Metadata } from 'next';
import Link from 'next/link';
import { CategoryBreadcrumbs } from '@/features/categories/category-breadcrumbs';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Cum plătesc',
  description: `Plată online cu cardul la ${siteConfig.name} — sigură și procesată prin parteneri certificați.`,
  openGraph: {
    title: 'Cum plătesc',
    description: `Plăți online – ${siteConfig.name}.`,
  },
};

export default function CumPlatescPage() {
  const breadcrumbItems = [
    { name: 'Acasă', slug: '' },
    { name: 'Cum plătesc', slug: '' },
  ];

  return (
    <div className="container-wide py-8">
      <CategoryBreadcrumbs
        items={breadcrumbItems}
        rootLabel="Acasă"
        rootHref="/"
        className="mb-6"
      />
      <h1 className="heading-page mb-8">Cum plătesc</h1>

      <div className="max-w-3xl space-y-8">
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Acceptăm doar <strong className="text-neutral-900 dark:text-white">plată online cu cardul</strong> (debit sau
          credit, ex. Visa, Mastercard). Nu oferim plată la livrare (ramburs) sau transfer bancar pentru comenzi plasate
          pe site.
        </p>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="font-heading text-lg font-semibold text-neutral-900 dark:text-white">
            Card (online)
          </h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            După confirmarea comenzii vei fi redirecționat către procesatorul de plăți. Tranzacția este criptată și
            procesată prin parteneri certificați (PCI-DSS). Nu stocăm datele complete ale cardului pe serverele noastre.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800/50">
          <h2 className="font-heading text-lg font-semibold text-neutral-900 dark:text-white">
            Facturare
          </h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            La cerere, emitem factură fiscală. Poți introduce CUI și datele de facturare la finalizarea comenzii sau ne
            poți contacta după livrare.
          </p>
        </div>

        <p className="text-neutral-600 dark:text-neutral-400">
          Întrebări despre plăți? Vezi{' '}
          <Link href="/faq" className="text-primary-600 underline hover:no-underline dark:text-primary-400">
            FAQ
          </Link>
          {' '}sau{' '}
          <Link href="/contact" className="text-primary-600 underline hover:no-underline dark:text-primary-400">
            formularul de contact
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
