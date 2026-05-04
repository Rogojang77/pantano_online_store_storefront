import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionNavigator } from '@/components/content/section-navigator';
import { CategoryBreadcrumbs } from '@/features/categories/category-breadcrumbs';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Sustenabilitate',
  description: `Angajamentele noastre privind sustenabilitatea și responsabilitatea ambientală. ${siteConfig.name}.`,
  openGraph: {
    title: 'Sustenabilitate',
    description: `Sustenabilitate – ${siteConfig.name}.`,
  },
};

const sustainabilitySections = [
  {
    title: 'Obligația noastră',
    content: 'Ne angajăm să reducem impactul asupra mediului și să oferim produse și practici mai durabile. Sustenabilitatea face parte din deciziile noastre zilnice: de la aprovizionare și logistică până la ambalaje și informarea clienților.',
  },
  {
    title: 'Produse și furnizori',
    content: 'Prioritizăm furnizori care respectă standarde sociale și de mediu și, acolo unde este posibil, oferim produse cu certificări de sustenabilitate, materiale reciclate sau variante cu impact redus. Încerci să găsești opțiuni mai verzi în gama noastră.',
  },
  {
    title: 'Ambalaje și reciclare',
    content: 'Folosim ambalaje reciclabile și reducem materialele inutile. Te încurajăm să reciclezi cutiile și materialele de umplutură conform reglementărilor locale. Informațiile despre reciclare pot fi incluse în colete sau pe site.',
  },
  {
    title: 'Logistică și eficiență',
    content: 'Optimizăm rutele de livrare și consolidăm comenzile pentru a reduce emisiile. Oferim, unde este posibil, opțiunea de ridicare din magazin pentru a limita transportul suplimentar.',
  },
  {
    title: 'Transparență și îmbunătățire continuă',
    content: 'Ne propunem să raportăm progresul în domeniul sustenabilității și să ascultăm sugestiile clienților. Dacă ai idei sau întrebări, poți ne contacta prin formularul de contact.',
  },
];

const navItems = [
  { id: 'intro-sustenabilitate', title: 'Pe scurt' },
  ...sustainabilitySections.map((section, i) => ({ id: `sustenabilitate-${i + 1}`, title: section.title })),
  { id: 'contact-sustenabilitate', title: 'Sugestii și întrebări' },
];

export default function SustenabilitatePage() {
  const breadcrumbItems = [
    { name: 'Acasă', slug: '' },
    { name: 'Sustenabilitate', slug: '' },
  ];

  return (
    <div className="container-wide py-8">
      <CategoryBreadcrumbs
        items={breadcrumbItems}
        rootLabel="Acasă"
        rootHref="/"
        className="mb-6"
      />
      <h1 className="heading-page mb-8">Sustenabilitate</h1>

      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        <SectionNavigator items={navItems} title="Sustenabilitate" />

        <div className="space-y-6">
          <section id="intro-sustenabilitate" className="scroll-mt-24 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white">Pe scurt</h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">
              La {siteConfig.name} ne pasă de mediu și de responsabilitate socială. Pe această pagină găsești principiile pe care le urmărim în relația cu furnizorii, ambalajele, logistica și informarea clienților.
            </p>
          </section>

          <ul className="space-y-6">
          {sustainabilitySections.map((section, i) => (
            <li
              key={i}
              id={`sustenabilitate-${i + 1}`}
              className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <h2 className="font-heading text-lg font-semibold text-neutral-900 dark:text-white">
                {section.title}
              </h2>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">{section.content}</p>
            </li>
          ))}
          </ul>

          <section id="contact-sustenabilitate" className="scroll-mt-24 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800/50">
            <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white">Sugestii și întrebări</h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">
              Pentru sugestii sau întrebări despre sustenabilitate, aprovizionare responsabilă sau reciclare, ne poți scrie prin{' '}
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
