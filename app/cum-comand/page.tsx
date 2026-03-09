import type { Metadata } from 'next';
import Link from 'next/link';
import { CategoryBreadcrumbs } from '@/features/categories/category-breadcrumbs';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Cum comand',
  description: `Pași pentru a plasa o comandă la ${siteConfig.name}: navigare, coș, livrare și plată.`,
  openGraph: {
    title: 'Cum comand',
    description: `Ghid comenzi – ${siteConfig.name}.`,
  },
};

const steps = [
  {
    title: 'Alege produsele',
    text: 'Navighează pe site după categorii sau folosește bara de căutare. Adaugă în coș produsele dorite, selectând cantitatea și variantele (dacă există).',
  },
  {
    title: 'Verifică coșul',
    text: 'Deschide coșul și verifică produsele, cantitățile și prețurile. Poți șterge articole sau modifica cantitățile. Apoi apasă „Finalizează comanda”.',
  },
  {
    title: 'Date de livrare și facturare',
    text: 'Introdu adresa de livrare și, dacă este cazul, datele de facturare. Poți alege livrare la domiciliu sau ridicare din magazin, dacă este disponibilă.',
  },
  {
    title: 'Alege metoda de plată',
    text: 'Selectează plata cu cardul, ramburs, transfer bancar sau în rate (unde este ofertat). Urmează instrucțiunile pentru a finaliza plata.',
  },
  {
    title: 'Confirmarea comenzii',
    text: 'După ce comanda este primită, primești un email de confirmare cu detalii despre livrare și factură. Poți urmări comanda din contul tău.',
  },
];

export default function CumComandPage() {
  const breadcrumbItems = [
    { name: 'Acasă', slug: '' },
    { name: 'Cum comand', slug: '' },
  ];

  return (
    <div className="container-wide py-8">
      <CategoryBreadcrumbs
        items={breadcrumbItems}
        rootLabel="Acasă"
        rootHref="/"
        className="mb-6"
      />
      <h1 className="heading-page mb-8">Cum comand</h1>

      <div className="max-w-3xl space-y-8">
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Comandarea este simplă: alege produsele, completează datele și finalizează plata. Iată pașii în detaliu.
        </p>

        <ol className="space-y-6">
          {steps.map((step, i) => (
            <li
              key={i}
              className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 font-heading font-bold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
                aria-hidden
              >
                {i + 1}
              </span>
              <div>
                <h2 className="font-heading text-lg font-semibold text-neutral-900 dark:text-white">
                  {step.title}
                </h2>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="text-neutral-600 dark:text-neutral-400">
          Ai nevoie de ajutor? Consultă{' '}
          <Link href="/faq" className="text-primary-600 underline hover:no-underline dark:text-primary-400">
            întrebările frecvente
          </Link>
          {' '}sau{' '}
          <Link href="/contact" className="text-primary-600 underline hover:no-underline dark:text-primary-400">
            contactează-ne
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
