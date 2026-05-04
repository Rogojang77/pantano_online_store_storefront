import type { Metadata } from 'next';
import Link from 'next/link';
import { CategoryBreadcrumbs } from '@/features/categories/category-breadcrumbs';
import { LegalPageLayout } from '@/components/legal/legal-page-layout';
import { siteConfig } from '@/config/site';

type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export const metadata: Metadata = {
  title: 'Termeni și condiții',
  description: `Termeni și condiții pentru utilizarea ${siteConfig.name}, plasarea comenzilor, plata, livrarea și retururile.`,
  openGraph: {
    title: 'Termeni și condiții',
    description: `Termeni și condiții – ${siteConfig.name}.`,
  },
};

const termsSections: LegalSection[] = [
  {
    title: '1. Identificarea profesionistului',
    paragraphs: [
      `${siteConfig.name} este denumirea comercială a magazinului online operat de PANTANO SRL, persoană juridică română, organizată și funcționând în conformitate cu legislația din România.`,
      'Datele de identificare de mai jos fac parte integrantă din prezentele Termeni și Condiții și reprezintă informațiile oficiale ale comerciantului.',
    ],
    bullets: [
      'Denumire: PANTANO SRL',
      'CUI: 14847618',
      'Nr. Reg. Com.: J2002000834058',
      'EUID: ROONRC.J2002000834058',
      'Data înființării: 29.08.2002',
      'Sediu social: județul Bihor, localitatea Beiuș, Str. Horea nr. 61/E, cod poștal 415200, România',
      'Email contact: office@pantano.ro',
      'Telefon contact: 0731 312 388',
    ],
  },
  {
    title: '2. Definiții',
    paragraphs: [
      'În sensul prezentului document, termenii de mai jos au următorul înțeles: „site” sau „platformă” înseamnă magazinul online Pantano; „utilizator” înseamnă orice persoană care accesează site-ul; „client” înseamnă orice persoană fizică sau juridică ce plasează o comandă; „consumator” înseamnă orice persoană fizică ce acționează în scopuri din afara activității sale comerciale, industriale, artizanale ori profesionale.',
      '„Comandă” înseamnă documentul electronic prin care clientul transmite intenția de a achiziționa produse de pe site; „contract” înseamnă contractul la distanță încheiat între PANTANO SRL și client, la momentul acceptării comenzii; „produs” înseamnă orice bun disponibil spre vânzare pe site.',
    ],
  },
  {
    title: '3. Obiectul contractului',
    paragraphs: [
      `${siteConfig.name} este un magazin online destinat comercializării de materiale de construcții, produse de bricolaj, unelte, accesorii și produse conexe pentru casă, grădină și șantier, în limita categoriilor și stocurilor afișate pe site.`,
      'Prin accesarea site-ului, utilizarea funcționalităților acestuia ori plasarea unei comenzi, utilizatorul confirmă că a citit, a înțeles și acceptă prezentele Termeni și Condiții.',
    ],
  },
  {
    title: '4. Cont de client și comandă fără cont',
    paragraphs: [
      'Platforma permite atât plasarea comenzilor din cont de client, cât și plasarea comenzilor fără crearea unui cont, în regim de oaspete. În cazul comenzii fără cont, clientul furnizează datele necesare executării contractului, inclusiv datele de identificare, livrare și facturare.',
      'Clientul are obligația de a furniza date reale, complete și actualizate. PANTANO SRL nu răspunde pentru întârzieri, imposibilitatea livrării ori alte consecințe generate de date eronate, incomplete sau inexacte comunicate de client.',
    ],
  },
  {
    title: '5. Produse, disponibilitate și informații afișate',
    paragraphs: [
      'Depunem toate diligențele pentru ca descrierile, imaginile, specificațiile tehnice, prețurile și disponibilitatea produselor să fie afișate corect. Totuși, pot exista diferențe minore între imaginile de prezentare și produsul efectiv livrat, fără a afecta caracteristicile esențiale ale produsului.',
      'Disponibilitatea produselor este afișată cu caracter informativ și poate suferi modificări între momentul adăugării în coș și momentul confirmării finale a comenzii. În situația în care un produs nu mai poate fi furnizat, clientul va fi informat în cel mai scurt timp, iar sumele achitate pentru acel produs vor fi restituite conform legii.',
    ],
  },
  {
    title: '6. Prețuri, facturare și plată',
    paragraphs: [
      'Toate prețurile afișate pe site sunt exprimate în lei (RON). În măsura în care legea aplicabilă impune, prețurile afișate către consumatori includ TVA. Costurile de livrare se afișează distinct în checkout înainte de finalizarea comenzii.',
      'Conform configurației actuale a platformei, plata se realizează exclusiv online, cu cardul. Codul aplicației indică utilizarea unei integrări de plăți prin Banca Transilvania / BT ApiStore pentru validarea plăților online. Datele cardului nu sunt stocate de PANTANO SRL, ci sunt procesate de furnizorul autorizat de servicii de plată.',
      'La plasarea comenzii se emite documentația comercială și fiscală aferentă, inclusiv factura, conform regulilor interne și obligațiilor legale aplicabile.',
    ],
  },
  {
    title: '7. Plasarea, acceptarea și executarea comenzii',
    paragraphs: [
      'Comanda se transmite prin parcurgerea pașilor din checkout și apăsarea butonului de finalizare a comenzii. Înregistrarea comenzii nu echivalează automat cu acceptarea definitivă a acesteia.',
      'Contractul la distanță se consideră încheiat la momentul în care clientul primește confirmarea comenzii și plata este validată conform fluxului de procesare disponibil pe platformă.',
      'PANTANO SRL își rezervă dreptul de a refuza sau anula o comandă în situații justificate, cum ar fi: date incomplete sau incorecte, suspiciuni de fraudă, imposibilitatea procesării plății, indisponibilitatea produselor sau existența unor erori evidente de afișare.',
    ],
  },
  {
    title: '8. Livrare',
    paragraphs: [
      'Conform configurației identificate în aplicație, platforma oferă cel puțin două opțiuni de livrare: livrare standard și livrare expres. Termenele estimate afișate în checkout sunt, în prezent, de 2-4 zile lucrătoare pentru livrare standard și 1-2 zile lucrătoare pentru livrare expres, fără a constitui o garanție absolută de termen.',
      'Costul orientativ configurat în platformă este de 19,99 RON pentru livrarea standard și 39,99 RON pentru livrarea expres, cu posibilitatea modificării acestuia în funcție de politica comercială afișată pe site la momentul comenzii.',
      'Din codul aplicației nu rezultă, în acest moment, un nume unic și permanent al firmei de curierat. Livrarea se efectuează prin partenerii logistici ori curierii comunicați în checkout, în confirmarea comenzii sau în paginile informative ale site-ului. Livrarea este configurată, în mod implicit, pentru adrese din România, iar pentru livrări în afara României este necesară confirmarea expresă a disponibilității comerciale și logistice.',
      'Riscul pierderii sau deteriorării produselor se transferă către consumator la momentul în care acesta ori un terț desemnat de acesta, altul decât transportatorul, intră în posesia fizică a produselor.',
    ],
  },
  {
    title: '9. Dreptul de retragere',
    paragraphs: [
      'Dacă ai calitatea de consumator, beneficiezi de dreptul legal de retragere din contract, în termen de 14 zile calendaristice de la data la care tu sau un terț desemnat de tine, altul decât transportatorul, intră în posesia fizică a produsului, în conformitate cu OUG nr. 34/2014.',
      'Pentru exercitarea dreptului de retragere este suficientă transmiterea unei declarații neechivoce, inclusiv prin formularul de retur disponibil pe site, prin e-mail sau prin orice alt mijloc de comunicare indicat în pagina de contact, înainte de expirarea termenului legal.',
      'Rambursarea sumelor aferente produselor eligibile se efectuează în cel mult 14 zile de la data la care PANTANO SRL este informată cu privire la decizia de retragere. Societatea poate amâna rambursarea până la recepționarea produselor returnate sau până la primirea dovezii că acestea au fost expediate, luându-se în considerare data cea mai apropiată.',
    ],
  },
  {
    title: '10. Excepții de la dreptul de retragere',
    paragraphs: [
      'Dreptul de retragere nu se aplică în situațiile prevăzute de art. 16 din OUG nr. 34/2014, inclusiv, dar fără a se limita la: produse confecționate după specificațiile prezentate de consumator sau personalizate în mod clar, produse susceptibile a se deteriora ori expira rapid, produse sigilate care nu pot fi returnate din motive de protecție a sănătății sau din motive de igienă și care au fost desigilate de consumator, precum și alte categorii exceptate de lege.',
      'În măsura în care un anumit produs se încadrează într-o astfel de excepție, această informație va putea fi evidențiată în descrierea produsului sau în condițiile sale specifice de vânzare.',
    ],
  },
  {
    title: '11. Garanții, reclamații și retururi',
    paragraphs: [
      'Produsele beneficiază de garanțiile legale de conformitate prevăzute de legislația în vigoare și, după caz, de garanții comerciale acordate de producător sau distribuitor. Exercitarea garanției legale nu este condiționată de păstrarea ambalajului original, ci de respectarea condițiilor legale și de prezentarea documentelor justificative.',
      'Reclamațiile privind produsele, livrarea, facturarea sau serviciile asociate pot fi transmise utilizând datele de contact afișate pe site. PANTANO SRL va depune diligențe rezonabile pentru soluționarea sesizărilor într-un termen rezonabil.',
      `Informații suplimentare privind procedura de retur sunt disponibile în ${siteConfig.url}/politica-de-retur și în ${siteConfig.url}/formular-retur.`,
    ],
  },
  {
    title: '12. Drepturile și obligațiile utilizatorilor',
    paragraphs: [
      'Utilizatorii și clienții au obligația de a utiliza site-ul cu bună-credință, de a nu introduce conținut ilegal ori abuziv, de a nu afecta securitatea sau funcționarea platformei și de a nu folosi identități false.',
      'Clienții au dreptul să primească informații clare despre produse, prețuri, plată, livrare, retur și prelucrarea datelor, precum și să beneficieze de toate drepturile conferite de legislația aplicabilă în materie de protecție a consumatorilor.',
    ],
  },
  {
    title: '13. Drepturile și obligațiile companiei',
    paragraphs: [
      'PANTANO SRL are obligația de a furniza informații precontractuale corecte, de a procesa comenzile în limita disponibilității produselor și de a prelucra datele personale în conformitate cu legislația aplicabilă.',
      'PANTANO SRL are dreptul de a actualiza oferta comercială, prețurile, stocurile, condițiile de livrare și conținutul site-ului, precum și de a suspenda temporar accesul pentru mentenanță, securitate sau alte motive obiective.',
    ],
  },
  {
    title: '14. Proprietate intelectuală',
    paragraphs: [
      'Conținutul site-ului, incluzând fără limitare texte, imagini, baze de date, elemente grafice, mărci, logo-uri și structura platformei, aparține PANTANO SRL și/sau partenerilor săi și este protejat de legislația privind drepturile de autor și alte drepturi de proprietate intelectuală.',
      'Este interzisă copierea, distribuirea, publicarea, transferul, modificarea sau utilizarea conținutului în alt scop decât cel permis expres de lege sau de titularul drepturilor.',
    ],
  },
  {
    title: '15. Limitarea răspunderii',
    paragraphs: [
      'PANTANO SRL nu răspunde pentru prejudicii indirecte, pierderi de profit, întreruperea activității utilizatorului sau alte consecințe indirecte rezultate din utilizarea ori imposibilitatea utilizării site-ului, în măsura permisă de lege.',
      'Societatea nu poate fi ținută răspunzătoare pentru neexecutarea obligațiilor cauzată de evenimente de forță majoră, caz fortuit, acte ale autorităților, întreruperi ale rețelelor de comunicații, servicii ale terților ori alte cauze independente de voința sa.',
      'Nicio clauză din prezentul document nu limitează drepturile consumatorilor sau răspunderea societății în cazurile în care o asemenea limitare este interzisă de lege.',
    ],
  },
  {
    title: '16. Protecția datelor personale',
    paragraphs: [
      `Prelucrarea datelor cu caracter personal se realizează conform Politicii de Confidențialitate disponibile la ${siteConfig.url}/confidentialitate și, după caz, Politicii privind cookie-urile disponibile la ${siteConfig.url}/cookie-uri.`,
      'Prin utilizarea site-ului și plasarea comenzilor, clientul confirmă că a luat cunoștință de informațiile esențiale privind prelucrarea datelor sale personale.',
    ],
  },
  {
    title: '17. Modificarea termenilor și condițiilor',
    paragraphs: [
      'PANTANO SRL poate modifica în orice moment prezentul document, pentru a reflecta schimbări legislative, comerciale sau tehnice. Versiunea actualizată va fi publicată pe site și va produce efecte de la data publicării, pentru utilizările ulterioare ale platformei.',
      'Comenzile deja confirmate rămân supuse versiunii termenilor și condițiilor în vigoare la data plasării sau confirmării lor, cu excepția cazurilor în care legea impune altfel.',
    ],
  },
  {
    title: '18. Legea aplicabilă și jurisdicția',
    paragraphs: [
      'Prezentele Termeni și Condiții sunt guvernate de legea română. Orice litigiu va fi soluționat mai întâi pe cale amiabilă.',
      'În măsura în care soluționarea amiabilă nu este posibilă, competența revine instanțelor judecătorești române competente, fără a aduce atingere drepturilor speciale de competență recunoscute consumatorilor de lege.',
      'Consumatorii pot utiliza și mecanisme alternative de soluționare a litigiilor, inclusiv procedurile SAL și platforma SOL a Comisiei Europene, dacă acestea sunt aplicabile cazului concret.',
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

      <div className="space-y-6">
        <LegalPageLayout sections={termsSections} />
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
