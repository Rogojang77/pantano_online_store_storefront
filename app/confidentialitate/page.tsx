import type { Metadata } from 'next';
import Link from 'next/link';
import { CategoryBreadcrumbs } from '@/features/categories/category-breadcrumbs';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Politica de confidențialitate',
  description: `Află cum colectăm, folosim și protejăm datele tale personale pe ${siteConfig.name}.`,
  openGraph: {
    title: 'Politica de confidențialitate',
    description: `Confidențialitate – ${siteConfig.name}.`,
  },
};

const privacySections = [
  {
    title: '1. Cine suntem',
    paragraphs: [
      `${siteConfig.name} este operatorul datelor cu caracter personal colectate prin intermediul site-ului. Prelucrăm datele în conformitate cu Regulamentul (UE) 2016/679 (GDPR) și legislația națională aplicabilă.`,
    ],
  },
  {
    title: '2. Ce date colectăm',
    paragraphs: [
      'Putem colecta: date de identificare (nume), date de contact (email, telefon), date de livrare/facturare, istoricul comenzilor și comunicările trimise prin formularele de pe site.',
      'În mod tehnic, putem colecta și date de utilizare (IP, browser, pagini vizitate) pentru securitate, analiză și îmbunătățirea serviciilor.',
    ],
  },
  {
    title: '3. Scopurile prelucrării',
    paragraphs: [
      'Folosim datele pentru: procesarea comenzilor, emiterea documentelor fiscale, livrare, asistență clienți, gestionarea retururilor și respectarea obligațiilor legale.',
      'Cu acordul tău, putem utiliza datele și pentru comunicări comerciale (newsletter/ofertă). Îți poți retrage oricând consimțământul.',
    ],
  },
  {
    title: '4. Temeiuri legale',
    paragraphs: [
      'Prelucrăm datele în baza executării contractului (comandă), a obligațiilor legale (fiscale/contabile), a interesului legitim (securitate, prevenirea fraudei) și, unde este cazul, a consimțământului.',
    ],
  },
  {
    title: '5. Stocare și securitate',
    paragraphs: [
      'Păstrăm datele doar pe perioada necesară scopurilor pentru care au fost colectate sau conform termenelor legale de arhivare.',
      'Aplicăm măsuri tehnice și organizatorice rezonabile pentru a preveni accesul neautorizat, pierderea sau divulgarea datelor.',
    ],
  },
  {
    title: '6. Drepturile tale',
    paragraphs: [
      'Ai dreptul de acces, rectificare, ștergere, restricționare, portabilitate, opoziție și dreptul de a nu fi supus unei decizii automate, conform legii.',
      'Pentru exercitarea drepturilor, ne poți contacta prin formularul din pagina de contact. Ai și dreptul de a depune plângere la ANSPDCP.',
    ],
  },
];

export default function ConfidentialitatePage() {
  const breadcrumbItems = [
    { name: 'Acasă', slug: '' },
    { name: 'Politica de confidențialitate', slug: '' },
  ];

  return (
    <div className="container-wide py-8">
      <CategoryBreadcrumbs
        items={breadcrumbItems}
        rootLabel="Acasă"
        rootHref="/"
        className="mb-6"
      />
      <h1 className="heading-page mb-8">Politica de confidențialitate</h1>

      <div className="mx-auto max-w-4xl space-y-6">
        {privacySections.map((section) => (
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
          Pentru informații despre retururi și retragere, vezi{' '}
          <Link href="/politica-de-retur" className="text-primary-600 underline hover:no-underline dark:text-primary-400">
            politica de retur
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
