import type { Metadata } from 'next';
import Link from 'next/link';
import { CategoryBreadcrumbs } from '@/features/categories/category-breadcrumbs';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Politica de retur',
  description: `Condiții și pași pentru returul produselor comandate de pe ${siteConfig.name}.`,
  openGraph: {
    title: 'Politica de retur',
    description: `Retururi – ${siteConfig.name}.`,
  },
};

const returnSections = [
  {
    title: '1. Dreptul de retragere',
    paragraphs: [
      'Dacă ai calitatea de consumator, ai dreptul să te retragi din contract în termen de 14 zile calendaristice de la primirea produsului, fără a invoca un motiv.',
      'Pentru exercitarea dreptului, este suficient să ne transmiți o declarație neechivocă (prin formular, email sau telefon) înainte de expirarea termenului.',
    ],
  },
  {
    title: '2. Condiții de acceptare a returului',
    paragraphs: [
      'Produsele returnate trebuie predate în aceeași stare în care au fost livrate, cu ambalajul original (dacă există), accesorii și documente aferente.',
      'Ne rezervăm dreptul de a diminua valoarea rambursată dacă produsul prezintă urme de uzură excesivă, deteriorări sau lipsuri.',
    ],
  },
  {
    title: '3. Excepții de la retur',
    paragraphs: [
      'Conform legislației, anumite categorii pot fi exceptate de la retragere: produse personalizate, produse care se pot deteriora rapid, produse sigilate desigilate din motive de protecție a sănătății/igienă.',
      'Dacă un produs intră într-o categorie exceptată, acest lucru este menționat în descrierea lui.',
    ],
  },
  {
    title: '4. Costuri de retur și rambursare',
    paragraphs: [
      'Costul transportului pentru retur este, de regulă, suportat de client, cu excepția situațiilor în care produsul este neconform sau s-a livrat eronat.',
      'Rambursarea contravalorii produselor eligibile se face în cel mult 14 zile de la primirea notificării de retragere, dar putem amâna plata până la recepția produselor returnate sau dovada expedierii.',
    ],
  },
  {
    title: '5. Cum inițiezi un retur',
    paragraphs: [
      `Completează ${siteConfig.url}/formular-retur și menționează numărul comenzii, produsele returnate și motivul (opțional).`,
      'După înregistrare, vei primi instrucțiuni pentru expediere și pașii următori pentru soluționare.',
    ],
  },
];

export default function PoliticaDeReturPage() {
  const breadcrumbItems = [
    { name: 'Acasă', slug: '' },
    { name: 'Politica de retur', slug: '' },
  ];

  return (
    <div className="container-wide py-8">
      <CategoryBreadcrumbs
        items={breadcrumbItems}
        rootLabel="Acasă"
        rootHref="/"
        className="mb-6"
      />
      <h1 className="heading-page mb-8">Politica de retur</h1>

      <div className="mx-auto max-w-4xl space-y-6">
        {returnSections.map((section) => (
          <section
            key={section.title}
            className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white">
              {section.title}
            </h2>
            <div className="mt-3 space-y-3 text-neutral-600 dark:text-neutral-400">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}

        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Pentru trimiterea unei cereri, accesează{' '}
          <Link href="/formular-retur" className="text-primary-600 underline hover:no-underline dark:text-primary-400">
            formularul de retragere/retur
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
