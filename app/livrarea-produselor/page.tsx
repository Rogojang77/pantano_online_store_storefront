import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionNavigator } from '@/components/content/section-navigator';
import { CategoryBreadcrumbs } from '@/features/categories/category-breadcrumbs';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Livrarea produselor',
  description: `Informații despre livrare la ${siteConfig.name}: termene, zone, costuri și ridicare din magazin.`,
  openGraph: {
    title: 'Livrarea produselor',
    description: `Livrare – ${siteConfig.name}.`,
  },
};

const deliverySections = [
  {
    title: 'Livrare la domiciliu',
    content: 'Livrăm la adresa indicată de tine, în intervalul ales (unde este disponibil). Coletul este predat de curier; poți verifica termenul estimat în coș, în funcție de localitate și stoc.',
  },
  {
    title: 'Termene de livrare',
    content: 'În general, livrările se efectuează în 1–5 zile lucrătoare de la confirmarea comenzii. Pentru produse din stoc și zone acoperite rapid, termenul poate fi mai scurt. Pentru produse comandate special sau zone îndepărtate, te informăm individual.',
  },
  {
    title: 'Costuri de livrare',
    content: 'Costul livrării depinde de greutate, dimensiuni și destinație. În coș vei vedea suma exactă înainte de plată. Oferim uneori livrare gratuită pentru comenzi peste un anumit prag – verifică ofertele pe site.',
  },
  {
    title: 'Ridicare din magazin',
    content: 'Dacă este disponibilă opțiunea de ridicare din magazin, poți alege să ridici comanda personal. Primești notificare când comanda este pregătită. Verifică programul magazinului și adresa pe pagina de contact.',
  },
  {
    title: 'Urmărire comandă',
    content: 'După ce comanda pleacă din depozit, primești un link sau un număr de urmărire pentru a verifica statusul livrării. Poți vedea și istoricul comenzilor din contul tău.',
  },
];

const navItems = [
  { id: 'prezentare-livrare', title: 'Pe scurt' },
  ...deliverySections.map((section, i) => ({ id: `livrare-${i + 1}`, title: section.title })),
  { id: 'suport-livrare', title: 'Suport livrare' },
];

export default function LivrareaProduselorPage() {
  const breadcrumbItems = [
    { name: 'Acasă', slug: '' },
    { name: 'Livrarea produselor', slug: '' },
  ];

  return (
    <div className="container-wide py-8">
      <CategoryBreadcrumbs
        items={breadcrumbItems}
        rootLabel="Acasă"
        rootHref="/"
        className="mb-6"
      />
      <h1 className="heading-page mb-8">Livrarea produselor</h1>

      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        <SectionNavigator items={navItems} title="Livrarea produselor" />

        <div className="space-y-6">
          <section id="prezentare-livrare" className="scroll-mt-24 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white">Pe scurt</h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">
              Livrăm produsele în toată țara, iar în checkout vei vedea opțiunile disponibile, costurile și termenul estimat pentru comanda ta. Mai jos găsești explicații clare despre livrare, ridicare și urmărirea coletului.
            </p>
          </section>

          <ul className="space-y-6">
          {deliverySections.map((section, i) => (
            <li
              key={i}
              id={`livrare-${i + 1}`}
              className="scroll-mt-24 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <h2 className="font-heading text-lg font-semibold text-neutral-900 dark:text-white">
                {section.title}
              </h2>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">{section.content}</p>
            </li>
          ))}
          </ul>

          <section id="suport-livrare" className="scroll-mt-24 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800/50">
            <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white">Suport livrare</h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">
              Pentru întrebări specifice despre livrare, termene, costuri sau statusul unei comenzi, consultă{' '}
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
