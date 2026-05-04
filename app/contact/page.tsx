import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionNavigator } from '@/components/content/section-navigator';
import { CategoryBreadcrumbs } from '@/features/categories/category-breadcrumbs';
import { ContactInfo } from '@/features/contact/contact-info';
import { ContactMap } from '@/features/contact/contact-map';
import { ContactForm } from '@/features/contact/contact-form';
import { getContactInfo } from '@/lib/api/contact';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Contactați-ne pentru informații despre produse, livrări și program. ${siteConfig.name} – ${siteConfig.description}`,
  openGraph: {
    title: 'Contact',
    description: `Contact și program de lucru – ${siteConfig.name}.`,
  },
};

const navItems = [
  { id: 'date-contact', title: 'Date de contact' },
  { id: 'formular-contact', title: 'Trimite-ne un mesaj' },
  { id: 'locatie-contact', title: 'Locație' },
  { id: 'program-contact', title: 'Program' },
  { id: 'informatii-utile', title: 'Informații utile' },
];

export default async function ContactPage() {
  const config = await getContactInfo();
  const contactBreadcrumbItems = [
    { name: 'Acasă', slug: '' },
    { name: config.pageTitle, slug: '' },
  ];

  return (
    <div className="container-wide py-8">
      <CategoryBreadcrumbs
        items={contactBreadcrumbItems}
        rootLabel="Acasă"
        rootHref="/"
        className="mb-6"
      />
      <h1 className="heading-page mb-8">{config.pageTitle}</h1>

      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        <SectionNavigator items={navItems} title="Ajutor & Contact" />

        <div className="space-y-8">
          <section id="date-contact" className="scroll-mt-24">
            <h2 className="heading-section mb-4">Date de contact</h2>
            <ContactInfo config={config} />
          </section>

          <section id="formular-contact" className="scroll-mt-24" aria-labelledby="contact-form-heading">
            <h2 id="contact-form-heading" className="heading-section mb-4">
              Trimite-ne un mesaj
            </h2>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
              <p className="mb-4 text-neutral-600 dark:text-neutral-400">
                Folosește formularul de mai jos pentru întrebări despre produse, comenzi, livrare, facturi, retururi sau colaborări. Îți recomandăm să incluzi cât mai clar subiectul mesajului pentru a primi răspuns mai repede.
              </p>
              <ContactForm />
            </div>
          </section>

          {config.latitude != null && config.longitude != null && (
            <section id="locatie-contact" className="scroll-mt-24" aria-label="Locație pe hartă">
              <h2 className="heading-section mb-4">Locație</h2>
              <ContactMap
                latitude={config.latitude}
                longitude={config.longitude}
                mapUrl={config.mapUrl}
              />
            </section>
          )}

          {config.openingHoursSummary && (
            <section id="program-contact" className="scroll-mt-24">
              <h2 className="heading-section mb-4">Program</h2>
              <div
                className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4 dark:border-neutral-700 dark:bg-neutral-800/50"
                role="region"
                aria-label="Rezumat program"
              >
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Program: {config.openingHoursSummary}
                </p>
              </div>
            </section>
          )}

          <section id="informatii-utile" className="scroll-mt-24 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white">Informații utile</h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">
              Pentru răspunsuri rapide, poți consulta și paginile{' '}
              <Link href="/faq" className="text-primary-600 underline hover:no-underline dark:text-primary-400">
                Întrebări frecvente
              </Link>
              ,{' '}
              <Link href="/cum-comand" className="text-primary-600 underline hover:no-underline dark:text-primary-400">
                Cum comand
              </Link>
              {' '}și{' '}
              <Link href="/livrarea-produselor" className="text-primary-600 underline hover:no-underline dark:text-primary-400">
                Livrarea produselor
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
