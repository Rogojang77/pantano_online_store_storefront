import type { Metadata } from 'next';
import Link from 'next/link';
import { CategoryBreadcrumbs } from '@/features/categories/category-breadcrumbs';
import { ContactForm } from '@/features/contact/contact-form';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Formular de retragere / retur',
  description: `Solicită retragerea sau returnarea produselor în 14 zile. ${siteConfig.name}.`,
  openGraph: {
    title: 'Formular de retragere / retur',
    description: `Retururi – ${siteConfig.name}.`,
  },
};

export default function FormularReturPage() {
  const breadcrumbItems = [
    { name: 'Acasă', slug: '' },
    { name: 'Formular de retragere/retur', slug: '' },
  ];

  return (
    <div className="container-wide py-8">
      <CategoryBreadcrumbs
        items={breadcrumbItems}
        rootLabel="Acasă"
        rootHref="/"
        className="mb-6"
      />
      <h1 className="heading-page mb-8">Formular de retragere / retur</h1>

      <div className="mx-auto max-w-3xl space-y-8">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white">
            Dreptul la retragere
          </h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400">
            În conformitate cu legislația în vigoare, beneficiezi de 14 zile calendaristice pentru a te răzgândi și a returna produsele fără a invoca niciun motiv. Termenul începe de la data primirii produsului.
          </p>
          <ul className="mt-4 list-inside list-disc space-y-1 text-neutral-600 dark:text-neutral-400">
            <li>Produsele trebuie returnate în stare nealterată, în ambalajul original, cu accesorii și documentație.</li>
            <li>Unele categorii (ex.: produse personalizate, perisabile) pot fi exceptate – verifică la produs.</li>
            <li>Costurile de expediere pentru returnare pot fi suportate de tine, dacă nu am convenit altfel.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white">
            Cum soliciți retragerea sau returul
          </h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400">
            Poți comunica decizia de retragere sau de returnare în orice formă (telefon, email, formular). Pentru a ne ajuta să procesăm cererea rapid, completează formularul de mai jos cu numărul comenzii, produsele pe care dorești să le returnezi și motivul (opțional). Te contactăm cu pașii următori (etichete de returnare, adresă depozit etc.).
          </p>
        </div>

        <section aria-labelledby="form-retur-heading">
          <h2 id="form-retur-heading" className="heading-section mb-4">
            Trimite cererea de retragere / retur
          </h2>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <ContactForm />
          </div>
          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
            În mesaj, te rugăm să menționezi „Retragere” sau „Retur” și numărul comenzii (ex.: #12345). Dacă ai cont, poți gestiona și cererile de retur din{' '}
            <Link href="/cont/retururi" className="text-primary-600 underline hover:no-underline dark:text-primary-400">
              contul tău
            </Link>
            .
          </p>
        </section>

        <p className="text-neutral-600 dark:text-neutral-400">
          Mai multe detalii în{' '}
          <Link href="/faq" className="text-primary-600 underline hover:no-underline dark:text-primary-400">
            întrebările frecvente
          </Link>
          {' '}și în{' '}
          <Link href="/termeni" className="text-primary-600 underline hover:no-underline dark:text-primary-400">
            termenii și condițiile
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
