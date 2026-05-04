import type { Metadata } from 'next';
import Link from 'next/link';
import { CategoryBreadcrumbs } from '@/features/categories/category-breadcrumbs';
import { LegalPageLayout } from '@/components/legal/legal-page-layout';
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
      'Cookie-urile sunt fișiere text de mici dimensiuni pe care site-ul le poate stoca pe dispozitivul tău atunci când îl vizitezi. Acestea permit recunoașterea terminalului utilizat, memorarea anumitor setări și facilitarea funcționării corecte a paginilor.',
      'În sens larg, termenul „cookie-uri” include și tehnologii similare, precum local storage, identificatori de sesiune, pixeli sau alte mecanisme utilizate pentru stocarea ori citirea unor informații de pe dispozitivul utilizatorului.',
    ],
  },
  {
    title: '2. Cine utilizează cookie-urile',
    paragraphs: [
      `${siteConfig.name} utilizează cookie-uri proprii și, după caz, cookie-uri furnizate de terți, pentru funcționarea magazinului online, măsurarea performanței și gestionarea preferințelor de consimțământ.`,
      'În măsura în care anumite servicii terțe sunt activate, acestea pot seta sau accesa cookie-uri în nume propriu, potrivit propriilor politici. În asemenea situații, utilizarea lor se face în condițiile legii și, dacă este necesar, numai după obținerea consimțământului tău.',
    ],
  },
  {
    title: '3. Ce tipuri de cookie-uri utilizăm',
    paragraphs: [
      'Site-ul este configurat pentru a diferenția între cookie-uri necesare și categorii opționale de cookie-uri. În prezent, arhitectura aplicației include cel puțin următoarele categorii.',
    ],
    bullets: [
      'Cookie-uri necesare: esențiale pentru funcționarea site-ului, pentru securitate, menținerea sesiunii, funcționarea coșului de cumpărături și memorarea setărilor strict necesare. Aceste cookie-uri nu pot fi dezactivate din panoul de preferințe al site-ului.',
      'Cookie-uri de preferințe: permit memorarea unor opțiuni alese de utilizator, astfel încât experiența de navigare să fie mai personalizată și mai fluentă.',
      'Cookie-uri de performanță / analiză: ne ajută să înțelegem cum este utilizat site-ul, ce pagini sunt accesate, cum interacționează utilizatorii cu fluxurile de comandă și ce zone pot fi îmbunătățite.',
      'Cookie-uri de marketing / publicitate: pot fi utilizate pentru măsurarea eficienței campaniilor, limitarea frecvenței afișării unor mesaje și personalizarea conținutului promoțional, dacă astfel de instrumente sunt activate.',
    ],
  },
  {
    title: '4. Ce date pot fi colectate prin cookie-uri',
    paragraphs: [
      'În funcție de categoria cookie-urilor activate, pot fi colectate sau generate date precum: identificatori de sesiune, preferințe salvate, adresa IP parțială sau completă, tipul dispozitivului, browserul utilizat, limba, paginile vizitate, sursa accesării, timpul petrecut pe site și interacțiunile cu anumite funcționalități.',
      'Cookie-urile nu sunt utilizate, în mod obișnuit, pentru a identifica direct o persoană după nume, însă informațiile asociate lor pot deveni date cu caracter personal atunci când sunt corelate cu alte informații deținute de operator sau de un furnizor terț.',
    ],
  },
  {
    title: '5. Scopurile utilizării cookie-urilor',
    paragraphs: [
      'Cookie-urile și tehnologiile similare sunt utilizate pentru scopuri legitime și determinate, în funcție de categoria selectată.',
    ],
    bullets: [
      'asigurarea funcționării corecte și securizate a site-ului;',
      'menținerea sesiunii și a coșului de cumpărături;',
      'memorarea opțiunilor de consimțământ și a altor preferințe ale utilizatorului;',
      'analiza traficului și a modului de utilizare a site-ului;',
      'optimizarea performanței paginilor și a fluxurilor de comandă;',
      'măsurarea eficienței comunicărilor comerciale și, după caz, personalizarea conținutului promoțional.',
    ],
  },
  {
    title: '6. Temeiul legal',
    paragraphs: [
      'Utilizarea cookie-urilor este guvernată de normele aplicabile în materie de protecția vieții private în comunicațiile electronice și de Regulamentul (UE) 2016/679 (GDPR).',
      'Cookie-urile strict necesare sunt utilizate în temeiul interesului legitim al operatorului de a asigura funcționarea și securitatea site-ului.',
      'Cookie-urile de preferințe, performanță / analiză și marketing / publicitate sunt utilizate numai în baza consimțământului tău prealabil, liber exprimat, specific, informat și lipsit de ambiguitate, în măsura în care legea impune acest lucru.',
    ],
  },
  {
    title: '7. Durata de stocare',
    paragraphs: [
      'Durata de stocare a cookie-urilor diferă în funcție de natura și scopul lor. Unele cookie-uri sunt de sesiune și se șterg automat la închiderea browserului, iar altele sunt persistente și rămân stocate pentru o perioadă determinată sau până la ștergerea lor manuală de către utilizator.',
      'Conform configurației tehnice identificate în aplicație, preferințele privind consimțământul pentru cookie-uri pot fi păstrate pentru o perioadă de până la aproximativ 180 de zile, după care utilizatorului i se poate solicita din nou exprimarea opțiunilor.',
    ],
  },
  {
    title: '8. Cookie-uri terțe',
    paragraphs: [
      'În măsura în care site-ul utilizează servicii terțe pentru analiză, publicitate, integrare social media sau alte funcționalități, acești furnizori pot plasa propriile cookie-uri. Exemple uzuale în piață includ servicii precum Google Analytics, Google Ads, Meta Pixel sau alte platforme similare.',
      'Din analiza codului disponibil rezultă existența unei infrastructuri pentru categorii de cookie-uri analitice și marketing, însă nu reiese în mod explicit activarea permanentă și obligatorie a unor furnizori terți anume în toate mediile de funcționare. Dacă asemenea servicii sunt active în producție, utilizatorii vor fi informați prin prezenta politică și prin mecanismul de consimțământ.',
    ],
  },
  {
    title: '9. Cum îți poți gestiona sau retrage consimțământul',
    paragraphs: [
      'Poți accepta, refuza sau personaliza cookie-urile opționale prin bannerul și centrul de preferințe pentru cookie-uri disponibil pe site.',
      'Îți poți modifica opțiunile în orice moment folosind butonul „Setări cookie-uri” disponibil în subsolul site-ului. Retragerea consimțământului produce efecte pentru viitor și nu afectează legalitatea prelucrărilor realizate anterior retragerii.',
    ],
  },
  {
    title: '10. Setările browserului',
    paragraphs: [
      'În plus față de setările disponibile pe site, poți controla cookie-urile și din setările browserului tău. Majoritatea browserelor permit vizualizarea, blocarea sau ștergerea cookie-urilor stocate.',
      'Dezactivarea cookie-urilor necesare poate afecta funcționarea corectă a site-ului, inclusiv autentificarea, salvarea coșului, navigarea între pași în checkout sau memorarea preferințelor esențiale.',
    ],
  },
  {
    title: '11. Link către politica de confidențialitate',
    paragraphs: [
      `Pentru informații detaliate despre modul în care prelucrăm datele cu caracter personal, drepturile tale și destinatarii datelor, consultă și Politica de Confidențialitate disponibilă la ${siteConfig.url}/confidentialitate.`,
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

      <div className="space-y-6">
        <LegalPageLayout sections={cookieSections} />
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
