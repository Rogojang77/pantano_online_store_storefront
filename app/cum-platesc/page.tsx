import type { Metadata } from 'next';
import Link from 'next/link';
import { CategoryBreadcrumbs } from '@/features/categories/category-breadcrumbs';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Cum plătesc',
  description: `Metode de plată la ${siteConfig.name}: card, ramburs, transfer bancar, rate.`,
  openGraph: {
    title: 'Cum plătesc',
    description: `Plăți – ${siteConfig.name}.`,
  },
};

const paymentMethods = [
  {
    title: 'Card (online)',
    description: 'Plătești în siguranță cu cardul (Visa, Mastercard etc.) direct pe site. Tranzacția este procesată prin parteneri certificati PCI-DSS.',
  },
  {
    title: 'Card la livrare',
    description: 'Poți plăti cu cardul la livrare, dacă curierul dispune de terminal. Verifică la finalizarea comenzii dacă opțiunea este disponibilă în zona ta.',
  },
  {
    title: 'Ramburs',
    description: 'Plătești numerar curierului la predarea coletului. Poate fi aplicată o taxă suplimentară pentru ramburs; suma exactă o vezi în coș.',
  },
  {
    title: 'Transfer bancar',
    description: 'Primești datele pentru transfer (IBAN, sumă, referință) în emailul de confirmare. Comanda este procesată după ce primim confirmarea plății.',
  },
  {
    title: 'Plată în rate',
    description: 'Pentru anumite produse și sume, oferim posibilitatea de plată în rate, prin parteneri financiari. Condițiile sunt afișate la produs și la finalizarea comenzii.',
  },
];

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
          Oferim mai multe metode de plată pentru a-ți face cumpărăturile simple și sigure.
        </p>

        <ul className="space-y-6">
          {paymentMethods.map((method, i) => (
            <li
              key={i}
              className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <h2 className="font-heading text-lg font-semibold text-neutral-900 dark:text-white">
                {method.title}
              </h2>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">{method.description}</p>
            </li>
          ))}
        </ul>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800/50">
          <h2 className="font-heading text-lg font-semibold text-neutral-900 dark:text-white">
            Facturare
          </h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            La cerere, emitem factură fiscală. Poți introduce CUI și datele de facturare la finalizarea comenzii sau ne poți contacta după livrare.
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
