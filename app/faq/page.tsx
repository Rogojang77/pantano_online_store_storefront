import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionNavigator } from '@/components/content/section-navigator';
import { CategoryBreadcrumbs } from '@/features/categories/category-breadcrumbs';
import { FaqForm } from '@/features/faq/faq-form';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Întrebări frecvente',
  description: `Răspunsuri la cele mai frecvente întrebări despre comenzi, livrare, plăți și retururi. ${siteConfig.name}.`,
  openGraph: {
    title: 'Întrebări frecvente',
    description: `FAQ – ${siteConfig.name}.`,
  },
};

const faqItems = [
  {
    q: 'Cum pot plasa o comandă?',
    a: 'Poți comanda online pe site, prin telefon sau direct în magazin. Pe site, adaugă produsele în coș, finalizează cu datele de livrare și plătește conform opțiunilor disponibile.',
  },
  {
    q: 'Care sunt metodele de plată acceptate?',
    a: 'Acceptăm doar plată online cu cardul (debit/credit). Detalii la „Cum plătesc”.',
  },
  {
    q: 'În cât timp primesc comanda?',
    a: 'Termenul de livrare variază în funcție de zona ta și de stoc. Livrările se fac în general în 1–5 zile lucrătoare. Poți verifica termenul estimat în coș, înainte de plată.',
  },
  {
    q: 'Pot returna un produs?',
    a: 'Da. În conformitate cu legislația, beneficiezi de 14 zile pentru retragere/returnare fără motiv. Completează formularul de retragere/retur și urmează pașii indicați.',
  },
  {
    q: 'Cum mă contactați după ce am trimis un mesaj?',
    a: 'Te contactăm la email sau la numărul de telefon indicat în formular, în cel mai scurt timp posibil, de obicei în 1–2 zile lucrătoare.',
  },
];

const navItems = [
  { id: 'intro-faq', title: 'Pe scurt' },
  { id: 'trimite-intrebare', title: 'Trimite o întrebare' },
  ...faqItems.map((item, i) => ({ id: `faq-${i + 1}`, title: item.q })),
];

export default function FaqPage() {
  const breadcrumbItems = [
    { name: 'Acasă', slug: '' },
    { name: 'Întrebări frecvente', slug: '' },
  ];

  return (
    <div className="container-wide py-8">
      <CategoryBreadcrumbs
        items={breadcrumbItems}
        rootLabel="Acasă"
        rootHref="/"
        className="mb-6"
      />
      <h1 className="heading-page mb-8">Întrebări frecvente</h1>

      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        <SectionNavigator items={navItems} title="Întrebări frecvente" />

        <div className="space-y-6">
        <section id="intro-faq" className="scroll-mt-24 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white">Pe scurt</h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400">
            Mai jos găsești răspunsuri rapide la întrebările cele mai frecvente despre comenzi, plăți, livrare și retur. Pentru detalii suplimentare, consultă paginile dedicate sau{' '}
            <Link href="/contact" className="text-primary-600 underline hover:no-underline dark:text-primary-400">
              formularul de contact
            </Link>
            .
          </p>
        </section>

        <section id="trimite-intrebare" className="scroll-mt-24 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800" aria-labelledby="faq-form-heading">
          <h2 id="faq-form-heading" className="heading-section mb-4">
            Nu ai găsit răspunsul? Trimite-ne o întrebare
          </h2>
          <FaqForm />
        </section>

        <ul className="space-y-6" role="list">
          {faqItems.map((item, i) => (
            <li
              key={i}
              id={`faq-${i + 1}`}
              className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <h2 className="font-heading text-lg font-semibold text-neutral-900 dark:text-white">
                {item.q}
              </h2>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">{item.a}</p>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </div>
  );
}
