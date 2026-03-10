import type { Metadata } from 'next';
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

      <ContactInfo config={config} />

      <section className="mt-8" aria-labelledby="contact-form-heading">
        <h2 id="contact-form-heading" className="heading-section mb-4">
          Trimite-ne un mesaj
        </h2>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <ContactForm />
        </div>
      </section>

      {config.latitude != null && config.longitude != null && (
        <section className="mt-8" aria-label="Locație pe hartă">
          <h2 className="heading-section mb-4">Locație</h2>
          <ContactMap
            latitude={config.latitude}
            longitude={config.longitude}
            mapUrl={config.mapUrl}
          />
        </section>
      )}

      {config.openingHoursSummary && (
        <div
          className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800/50"
          role="region"
          aria-label="Rezumat program"
        >
          <p className="text-sm font-medium text-neutral-900 dark:text-white">
            Program: {config.openingHoursSummary}
          </p>
        </div>
      )}
    </div>
  );
}
