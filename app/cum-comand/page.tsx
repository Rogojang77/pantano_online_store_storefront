import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionNavigator } from '@/components/content/section-navigator';
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
    title: 'Plată online',
    text: 'Plata se face exclusiv online cu cardul. După confirmarea comenzii vei fi redirecționat către procesatorul de plăți securizat.',
  },
  {
    title: 'Confirmarea comenzii',
    text: 'După ce comanda este primită, primești un email de confirmare cu detalii despre livrare și factură. Poți urmări comanda din contul tău.',
  },
];

const navItems = [
  { id: 'prezentare', title: 'Pe scurt' },
  ...steps.map((step, i) => ({ id: `pas-${i + 1}`, title: `${i + 1}. ${step.title}` })),
  { id: 'ajutor', title: 'Ai nevoie de ajutor?' },
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

      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        <SectionNavigator items={navItems} title="Cum comand" />

        <div className="space-y-8">
          <section id="prezentare" className="scroll-mt-24 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white">Pe scurt</h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">
              Comandarea este simplă: alegi produsele, verifici coșul, completezi datele de livrare și facturare, selectezi opțiunea disponibilă și finalizezi plata online. Mai jos găsești pașii explicați clar, în ordinea în care îi vei parcurge pe site.
            </p>
          </section>

          <ol className="space-y-6">
          {steps.map((step, i) => (
            <li
              key={i}
              id={`pas-${i + 1}`}
              className="scroll-mt-24 flex gap-4 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
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

          <section id="ajutor" className="scroll-mt-24 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800/50">
            <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white">Ai nevoie de ajutor?</h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">
              Dacă ai întrebări despre produse, disponibilitate, livrare sau plata comenzii, consultă{' '}
              <Link href="/faq" className="text-primary-600 underline hover:no-underline dark:text-primary-400">
                întrebările frecvente
              </Link>
              {' '}sau{' '}
              <Link href="/contact" className="text-primary-600 underline hover:no-underline dark:text-primary-400">
                contactează-ne
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
