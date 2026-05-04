import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionNavigator } from '@/components/content/section-navigator';
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

const navItems = [
  { id: 'metode-plata', title: 'Metode de plată' },
  { id: 'securitate', title: 'Securitatea plății' },
  { id: 'facturare', title: 'Facturare' },
  { id: 'ajutor-plata', title: 'Întrebări și suport' },
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

      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        <SectionNavigator items={navItems} title="Cum plătesc" />

        <div className="space-y-6">
          <section id="metode-plata" className="scroll-mt-24 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white">Metode de plată</h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">
              Acceptăm doar <strong className="text-neutral-900 dark:text-white">plată online cu cardul</strong> (debit sau credit, de exemplu Visa sau Mastercard). Pentru comenzile plasate pe site nu sunt disponibile, în prezent, rambursul la livrare sau transferul bancar standard.
            </p>
          </section>

          <section id="securitate" className="scroll-mt-24 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white">Securitatea plății</h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">
              După confirmarea comenzii vei fi redirecționat către pagina securizată a procesatorului de plăți. Tranzacția este criptată și procesată prin parteneri certificați. Datele complete ale cardului nu sunt stocate pe serverele noastre.
            </p>
          </section>

          <section id="facturare" className="scroll-mt-24 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800/50">
            <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white">Facturare</h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">
              Factura fiscală se emite pentru comenzile plasate prin site. Dacă dorești facturare pe firmă, poți introduce CUI și datele de facturare în checkout. Pentru corecții sau întrebări privind documentele fiscale ne poți contacta după plasarea comenzii.
            </p>
          </section>

          <section id="ajutor-plata" className="scroll-mt-24 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white">Întrebări și suport</h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">
              Dacă întâmpini dificultăți la plată sau ai întrebări despre confirmarea tranzacției, consultă{' '}
              <Link href="/faq" className="text-primary-600 underline hover:no-underline dark:text-primary-400">
                FAQ
              </Link>
              {' '}sau trimite-ne un mesaj prin{' '}
              <Link href="/contact" className="text-primary-600 underline hover:no-underline dark:text-primary-400">
                formularul de contact
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
