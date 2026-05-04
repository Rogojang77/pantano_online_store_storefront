import type { Metadata } from 'next';
import Link from 'next/link';
import { CategoryBreadcrumbs } from '@/features/categories/category-breadcrumbs';
import { LegalPageLayout } from '@/components/legal/legal-page-layout';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Politica de retur',
  description: `Condiții și pași pentru returul produselor comandate de pe ${siteConfig.name}.`,
  openGraph: {
    title: 'Politica de retur',
    description: `Retururi – ${siteConfig.name}.`,
  },
};

const returnSections = [
  {
    title: '1. Dreptul de retragere conform OUG nr. 34/2014',
    paragraphs: [
      'Dacă ai calitatea de consumator, ai dreptul legal de a te retrage din contractul la distanță, fără a invoca un motiv, în termen de 14 zile calendaristice de la data la care tu sau un terț desemnat de tine, altul decât transportatorul, intră în posesia fizică a produsului.',
      'În cazul unei comenzi care cuprinde mai multe produse livrate separat, termenul curge de la data primirii ultimului produs. În cazul produselor livrate în loturi sau piese multiple, termenul curge de la primirea ultimului produs sau a ultimei piese.',
      'Pentru exercitarea dreptului de retragere este suficient să ne transmiți, înainte de expirarea termenului, o declarație neechivocă privind decizia ta de retragere, inclusiv prin formularul de retur disponibil pe site, prin e-mail la office@pantano.ro sau telefonic la 0731 312 388.',
    ],
  },
  {
    title: '2. Condițiile în care produsele pot fi returnate',
    paragraphs: [
      'Produsele returnate trebuie predate în aceeași stare în care au fost livrate, însoțite, pe cât posibil, de ambalajul original, accesoriile, instrucțiunile, certificatul de garanție și celelalte documente primite odată cu produsul.',
      'Consumatorul este responsabil doar pentru diminuarea valorii produselor rezultată din manipulări altele decât cele necesare pentru determinarea naturii, caracteristicilor și funcționării produselor. Dacă produsul prezintă urme de uzură excesivă, deteriorări, lovituri, componente lipsă sau alte semne că a fost utilizat peste limita unei verificări rezonabile, PANTANO SRL poate aplica o diminuare corespunzătoare a valorii rambursate, în condițiile legii.',
    ],
  },
  {
    title: '3. Produse excluse de la retur',
    paragraphs: [
      'În conformitate cu art. 16 din OUG nr. 34/2014, anumite categorii de produse sunt exceptate de la dreptul de retragere, dacă sunt îndeplinite condițiile legale aplicabile.',
    ],
    bullets: [
      'produse confecționate după specificațiile prezentate de consumator sau personalizate în mod clar;',
      'produse care sunt susceptibile a se deteriora sau a expira rapid;',
      'produse sigilate care nu pot fi returnate din motive de protecție a sănătății ori din motive de igienă și care au fost desigilate de consumator;',
      'produse care, după livrare, sunt inseparabil amestecate cu alte elemente;',
      'alte categorii prevăzute expres de legislația aplicabilă.',
    ],
  },
  {
    title: '4. Procedura de retur',
    paragraphs: [
      'Pentru a solicita returul, consumatorul trebuie să urmeze pașii de mai jos, astfel încât cererea să poată fi procesată rapid și corect.',
    ],
    bullets: [
      `completează formularul disponibil la ${siteConfig.url}/formular-retur sau transmite cererea prin e-mail la office@pantano.ro;`,
      'menționează numărul comenzii, produsele pe care dorești să le returnezi și, dacă dorești, motivul returului;',
      'așteaptă confirmarea înregistrării cererii și instrucțiunile de expediere;',
      'pregătește produsul pentru returnare, cu toate accesoriile și documentele relevante;',
      'expediază produsul către adresa de retur indicată mai jos sau către adresa comunicată de echipa noastră, dacă ți se transmit instrucțiuni suplimentare.',
    ],
  },
  {
    title: '5. Adresa de retur și contact pentru suport',
    paragraphs: [
      'În lipsa unei adrese distincte comunicate expres pentru anumite categorii de produse, retururile pot fi trimise la adresa societății: PANTANO SRL, județul Bihor, localitatea Beiuș, Str. Horea nr. 61/E, cod poștal 415200, România.',
      'Pentru clarificări privind eligibilitatea returului, statusul solicitării, produsul neconform sau pașii de expediere, ne poți contacta la office@pantano.ro sau la 0731 312 388.',
    ],
  },
  {
    title: '6. Costurile de retur',
    paragraphs: [
      'Costul direct al returnării produselor este, de regulă, suportat de client, cu excepția situațiilor în care produsul este neconform, defect, livrat greșit sau în alt caz în care legea ori politica comercială aplicabilă impun suportarea costului de către comerciant.',
      'Dacă un anumit produs nu poate fi returnat în mod obișnuit prin poștă sau curier standard, costurile estimate de returnare pot fi comunicate separat, înainte de finalizarea procesului de retur, în măsura în care acest lucru este necesar.',
    ],
  },
  {
    title: '7. Rambursarea banilor',
    paragraphs: [
      'Rambursarea sumelor aferente produselor eligibile se face în cel mult 14 zile calendaristice de la data la care PANTANO SRL este informată cu privire la decizia de retragere.',
      'Ne rezervăm dreptul de a amâna rambursarea până la data recepționării produselor returnate sau până la primirea dovezii că acestea au fost expediate, luându-se în considerare data cea mai apropiată.',
      'Rambursarea se va efectua folosind aceeași metodă de plată utilizată de consumator pentru tranzacția inițială, cu excepția cazului în care părțile convin expres o altă metodă. În orice caz, consumatorului nu îi vor fi percepute comisioane ca urmare a rambursării.',
    ],
  },
  {
    title: '8. Produse defecte sau neconforme',
    paragraphs: [
      'Dacă produsul livrat este defect, deteriorat în mod necorespunzător, incomplet sau neconform cu specificațiile esențiale prezentate pe site, consumatorul are drepturile prevăzute de lege privind garanția legală de conformitate.',
      'În astfel de situații, te rugăm să ne contactezi cât mai curând la office@pantano.ro și să descrii problema, atașând, dacă este posibil, fotografii relevante. În funcție de situația concretă și de drepturile legale aplicabile, produsul poate fi reparat, înlocuit, redus ca preț sau poate face obiectul rambursării sumelor achitate.',
    ],
  },
  {
    title: '9. Schimbul de produse',
    paragraphs: [
      'Schimbul direct de produse poate fi acceptat doar dacă acest lucru este posibil din punct de vedere logistic și comercial. În lipsa unei confirmări exprese din partea noastră, schimbul de produse se realizează prin returnarea produsului inițial și plasarea unei comenzi noi pentru produsul dorit.',
      'Pentru situațiile în care dorești un schimb, recomandăm să contactezi în prealabil echipa de suport la office@pantano.ro sau la 0731 312 388.',
    ],
  },
  {
    title: '10. Dispoziții finale',
    paragraphs: [
      'Prezenta Politică de Retur se completează cu Termenii și Condițiile site-ului, Politica de Confidențialitate și dispozițiile legale aplicabile în materia protecției consumatorilor.',
      'PANTANO SRL își rezervă dreptul de a actualiza această politică pentru a reflecta modificări legislative, comerciale sau operaționale. Versiunea publicată pe site este versiunea aplicabilă la momentul consultării, fără a afecta drepturile deja dobândite de consumatori în legătură cu comenzile anterioare.',
    ],
  },
];

export default function PoliticaDeReturPage() {
  const breadcrumbItems = [
    { name: 'Acasă', slug: '' },
    { name: 'Politica de retur', slug: '' },
  ];

  return (
    <div className="container-wide py-8">
      <CategoryBreadcrumbs
        items={breadcrumbItems}
        rootLabel="Acasă"
        rootHref="/"
        className="mb-6"
      />
      <h1 className="heading-page mb-8">Politica de retur</h1>

      <div className="space-y-6">
        <LegalPageLayout sections={returnSections} />
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Pentru trimiterea unei cereri, accesează{' '}
          <Link href="/formular-retur" className="text-primary-600 underline hover:no-underline dark:text-primary-400">
            formularul de retragere/retur
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
