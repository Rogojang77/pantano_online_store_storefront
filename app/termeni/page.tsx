import type { Metadata } from 'next';
import Link from 'next/link';
import { CategoryBreadcrumbs } from '@/features/categories/category-breadcrumbs';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Termeni și condiții',
  description: `Termeni și condiții pentru utilizarea ${siteConfig.name}, plasarea comenzilor, plata, livrarea și retururile.`,
  openGraph: {
    title: 'Termeni și condiții',
    description: `Termeni și condiții – ${siteConfig.name}.`,
  },
};

const termsSections = [
  {
    title: '1. Informații generale',
    paragraphs: [
      `${siteConfig.name} este platforma de comerț electronic prin care poți comanda produse online. Prin accesarea și utilizarea site-ului, confirmi că ai citit și accepți acești termeni și condiții.`,
      'Ne rezervăm dreptul de a actualiza periodic acest document, fără notificare prealabilă. Versiunea publicată pe site este cea aplicabilă la momentul utilizării.',
    ],
  },
  {
    title: '2. Produse, prețuri și disponibilitate',
    paragraphs: [
      'Depunem eforturi pentru a afișa corect informațiile despre produse, imagini, prețuri și stocuri. Pot exista diferențe minore între imaginile de prezentare și produsul livrat.',
      'Prețurile afișate sunt exprimate în lei (RON) și includ TVA, dacă nu este menționat altfel. În cazul unor erori evidente de preț sau descriere, ne rezervăm dreptul de a anula comanda după informarea clientului.',
    ],
  },
  {
    title: '3. Plasarea și confirmarea comenzii',
    paragraphs: [
      'Comanda se consideră plasată după finalizarea pașilor din checkout și confirmarea plății. Vei primi un email de confirmare cu detaliile comenzii.',
      'Ne rezervăm dreptul de a refuza sau anula comenzi în situații justificate (date incomplete, imposibilitate de livrare, suspiciuni de fraudă).',
    ],
  },
  {
    title: '4. Plată, livrare și transferul riscului',
    paragraphs: [
      'Plata se realizează online, prin metodele disponibile la checkout. Procesarea plăților se face prin parteneri autorizați, în mediu securizat.',
      'Termenele de livrare sunt orientative și pot varia în funcție de localitate, disponibilitate și perioade aglomerate. Riscul asupra produselor se transferă la momentul livrării către client.',
    ],
  },
  {
    title: '5. Retururi, garanții și reclamații',
    paragraphs: [
      'Dacă ai calitatea de consumator, beneficiezi de dreptul legal de retragere în 14 zile calendaristice, conform legislației aplicabile.',
      `Pentru detalii complete, consultă ${siteConfig.url}/politica-de-retur și ${siteConfig.url}/formular-retur. Reclamațiile privind calitatea produselor pot fi transmise prin pagina de contact.`,
    ],
  },
  {
    title: '6. Limitarea răspunderii și legea aplicabilă',
    paragraphs: [
      'Nu răspundem pentru întreruperi temporare ale site-ului, cauzate de factori tehnici sau de forță majoră. Nu garantăm disponibilitatea neîntreruptă a tuturor funcționalităților.',
      'Acești termeni sunt guvernați de legea română. Litigiile vor fi soluționate pe cale amiabilă, iar în caz contrar de instanțele competente din România.',
    ],
  },
];

export default function TermeniPage() {
  const breadcrumbItems = [
    { name: 'Acasă', slug: '' },
    { name: 'Termeni și condiții', slug: '' },
  ];

  return (
    <div className="container-wide py-8">
      <CategoryBreadcrumbs
        items={breadcrumbItems}
        rootLabel="Acasă"
        rootHref="/"
        className="mb-6"
      />
      <h1 className="heading-page mb-8">Termeni și condiții</h1>

      <div className="mx-auto max-w-4xl space-y-6">
        {termsSections.map((section) => (
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
          Pentru informații privind prelucrarea datelor personale, vezi{' '}
          <Link href="/confidentialitate" className="text-primary-600 underline hover:no-underline dark:text-primary-400">
            politica de confidențialitate
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
