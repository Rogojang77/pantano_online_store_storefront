import type { Metadata } from 'next';
import Link from 'next/link';
import { CategoryBreadcrumbs } from '@/features/categories/category-breadcrumbs';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Politica privind cookie-urile',
  description: `Află ce cookie-uri folosim pe ${siteConfig.name}, în ce scop și cum îți poți modifica acordul.`,
  openGraph: {
    title: 'Politica privind cookie-urile',
    description: `Cookie-uri și preferințe de consimțământ – ${siteConfig.name}.`,
  },
};

const cookieSections = [
  {
    title: '1. Ce sunt cookie-urile',
    paragraphs: [
      'Cookie-urile sunt fișiere de mici dimensiuni stocate pe dispozitivul tău atunci când vizitezi un site. Ele permit funcționarea corectă a paginilor și pot reține preferințe de utilizare.',
    ],
  },
  {
    title: '2. Ce categorii de cookie-uri folosim',
    paragraphs: [
      'Necesare: esențiale pentru funcționarea site-ului (securitate, sesiune, coș de cumpărături, preferințe de bază). Acestea nu pot fi dezactivate din panoul de preferințe.',
      'Preferințe: rețin setări opționale care îmbunătățesc experiența de utilizare.',
      'Analitice: ne ajută să înțelegem modul de utilizare a site-ului pentru optimizare.',
      'Marketing: permit măsurarea performanței campaniilor și personalizarea ofertelor.',
    ],
  },
  {
    title: '3. Temeiul legal',
    paragraphs: [
      'Cookie-urile necesare sunt utilizate în baza interesului legitim de a asigura funcționarea magazinului.',
      'Cookie-urile opționale (preferințe, analitice, marketing) sunt utilizate doar pe baza consimțământului tău explicit.',
    ],
  },
  {
    title: '4. Durata de stocare',
    paragraphs: [
      'Durata de stocare diferă în funcție de categorie și scop. Preferințele tale de consimțământ pot fi păstrate pentru o perioadă limitată, apoi ți se poate solicita reconfirmarea.',
    ],
  },
  {
    title: '5. Cum îți modifici acordul',
    paragraphs: [
      'Poți modifica oricând opțiunile din butonul „Setări cookie-uri” disponibil în subsolul site-ului.',
      'De asemenea, poți șterge cookie-urile din setările browserului, însă unele funcționalități esențiale pot fi afectate.',
    ],
  },
];

export default function CookieUriPage() {
  const breadcrumbItems = [{ name: 'Acasă', slug: '' }, { name: 'Cookie-uri', slug: '' }];

  return (
    <div className="container-wide py-8">
      <CategoryBreadcrumbs
        items={breadcrumbItems}
        rootLabel="Acasă"
        rootHref="/"
        className="mb-6"
      />
      <h1 className="heading-page mb-8">Politica privind cookie-urile</h1>

      <div className="mx-auto max-w-4xl space-y-6">
        {cookieSections.map((section) => (
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
          Pentru detalii despre prelucrarea datelor personale, citește{' '}
          <Link
            href="/confidentialitate"
            className="text-primary-600 underline hover:no-underline dark:text-primary-400"
          >
            politica de confidențialitate
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
