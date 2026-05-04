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
  title: 'Politica de confidențialitate',
  description: `Află cum colectăm, folosim și protejăm datele tale personale pe ${siteConfig.name}.`,
  openGraph: {
    title: 'Politica de confidențialitate',
    description: `Confidențialitate – ${siteConfig.name}.`,
  },
};

const privacySections: LegalSection[] = [
  {
    title: '1. Operatorul datelor',
    paragraphs: [
      `${siteConfig.name} este operat de PANTANO SRL, cu sediul social în județul Bihor, localitatea Beiuș, Str. Horea nr. 61/E, cod poștal 415200, România, CUI 14847618, nr. de înregistrare J2002000834058, EUID ROONRC.J2002000834058.`,
      'PANTANO SRL are calitatea de operator de date cu caracter personal pentru prelucrările efectuate prin intermediul site-ului, în conformitate cu Regulamentul (UE) 2016/679 (GDPR), Legea nr. 190/2018 și celelalte dispoziții legale aplicabile.',
      'Pentru solicitări privind protecția datelor ne poți contacta la adresa office@pantano.ro. Dacă societatea nu a desemnat un responsabil cu protecția datelor, această adresă de contact reprezintă canalul oficial pentru exercitarea drepturilor tale GDPR.',
    ],
  },
  {
    title: '2. Ce date personale colectăm',
    paragraphs: [
      'În funcție de modul în care utilizezi site-ul, putem colecta direct de la tine sau genera în mod tehnic următoarele categorii de date personale.',
    ],
    bullets: [
      'Date de identificare și contact: nume, prenume, adresă de e-mail, număr de telefon.',
      'Date de cont client: e-mail, parolă criptată, preferințe de limbă, opțiuni privind notificările și consimțământul pentru newsletter.',
      'Date de facturare și livrare: adresă de livrare, adresă de facturare, localitate, județ, cod poștal, țară, informații privind persoană fizică sau juridică, inclusiv denumire companie, CUI/CIF și nr. registrului comerțului, atunci când sunt furnizate.',
      'Date privind comenzile: număr comandă, produse comandate, cantități, prețuri, discounturi, costuri de livrare, metodă de livrare, metodă de plată, status comandă, status plată, facturi și solicitări de retur.',
      'Date pentru comenzi fără cont: e-mail, nume, prenume și telefon furnizate în checkout, precum și adresele aferente executării comenzii.',
      'Date privind newsletter-ul: adresă de e-mail, nume, prenume, sursa abonării, textul consimțământului, data consimțământului, tokenul de confirmare, adresa IP și starea abonării.',
      'Date de utilizare și securitate: adresă IP, user-agent, identificator de sesiune, evenimente de navigare și de conversie în site, precum vizualizări de produse, adăugare în coș, începutul checkout-ului și finalizarea cumpărăturii.',
      'Date transmise prin formularele de contact sau întrebări: nume, e-mail și conținutul mesajului transmis.',
    ],
  },
  {
    title: '3. Scopurile prelucrării',
    paragraphs: [
      'Prelucrăm datele cu caracter personal pentru scopuri determinate, explicite și legitime, strict în legătură cu activitatea magazinului online.',
    ],
    bullets: [
      'Crearea și administrarea contului de client.',
      'Preluarea, confirmarea, procesarea și executarea comenzilor.',
      'Emiterea facturilor și îndeplinirea obligațiilor fiscale și contabile.',
      'Organizarea livrării, urmărirea stadiului comenzii și gestionarea retururilor sau reclamațiilor.',
      'Procesarea plăților online și validarea tranzacțiilor.',
      'Transmiterea de comunicări comerciale prin newsletter, numai în baza consimțământului tău.',
      'Asigurarea securității platformei, prevenirea fraudei, investigarea incidentelor și administrarea tehnică a serviciilor.',
      'Analiza modului de utilizare a site-ului și îmbunătățirea experienței utilizatorilor.',
      'Îndeplinirea obligațiilor legale și apărarea drepturilor sau intereselor legitime ale societății.',
    ],
  },
  {
    title: '4. Temeiurile legale ale prelucrării',
    paragraphs: [
      'Temeiurile juridice utilizate de PANTANO SRL, în conformitate cu art. 6 GDPR, sunt următoarele.',
    ],
    bullets: [
      'Art. 6 alin. (1) lit. b) GDPR: executarea unui contract sau efectuarea de demersuri la cererea persoanei vizate înainte de încheierea contractului, pentru contul de client, comenzi, facturare, livrare și retururi.',
      'Art. 6 alin. (1) lit. c) GDPR: îndeplinirea obligațiilor legale, inclusiv a celor fiscale, contabile, de arhivare și de conformitate comercială.',
      'Art. 6 alin. (1) lit. f) GDPR: interesul legitim al operatorului privind securitatea sistemelor, prevenirea fraudei, apărarea drepturilor și analiza internă a performanței platformei.',
      'Art. 6 alin. (1) lit. a) GDPR: consimțământul persoanei vizate, pentru newsletter și pentru cookie-urile sau tehnologiile opționale care nu sunt strict necesare.',
    ],
  },
  {
    title: '5. Newsletter și comunicări comerciale',
    paragraphs: [
      'Platforma include funcționalități de abonare la newsletter din homepage, checkout și contul utilizatorului. Codul aplicației indică un mecanism de dublă confirmare (double opt-in), ceea ce înseamnă că abonarea devine activă după confirmarea transmisă prin e-mail.',
      'În cadrul procesului de abonare se păstrează dovada consimțământului, inclusiv textul acceptat, momentul exprimării consimțământului, sursa abonării și, după caz, adresa IP.',
      'Te poți dezabona în orice moment prin linkul de dezabonare, prin setările contului sau prin contactarea noastră. Retragerea consimțământului nu afectează legalitatea prelucrărilor efectuate anterior retragerii.',
      'Din codul disponibil nu rezultă activarea obligatorie a unei platforme externe de email marketing; newsletter-ul este gestionat intern, cu posibilitatea tehnică de sincronizare către o platformă externă doar dacă aceasta este configurată ulterior.',
    ],
  },
  {
    title: '6. Plăți, livrare și destinatari ai datelor',
    paragraphs: [
      'Pentru executarea serviciilor noastre, putem transmite date personale către destinatari sau persoane împuternicite de operator, numai în măsura necesară îndeplinirii scopurilor descrise în această politică.',
    ],
    bullets: [
      'Procesatorul de plăți online. Codul aplicației indică o integrare cu Banca Transilvania / BT ApiStore pentru validarea plăților cu cardul.',
      'Partenerii logistici și curierii utilizați pentru livrarea comenzilor.',
      'Sistemul ERP / gestiune integrat cu magazinul. Codul aplicației indică integrarea cu Odoo pentru sincronizarea comenzilor, clienților, facturilor și stocurilor.',
      'Furnizorii de servicii de găzduire, infrastructură, mentenanță și backup, în măsura în care aceștia pot avea acces tehnic la date.',
      'Furnizorii de servicii de e-mail / SMTP utilizați pentru confirmări, resetări de parolă și comunicări operaționale.',
      'Autoritățile publice sau instituțiile competente, atunci când transmiterea este impusă de lege sau este necesară pentru apărarea unui drept în justiție.',
    ],
  },
  {
    title: '7. Cookie-uri și tehnologii similare',
    paragraphs: [
      'Site-ul utilizează cookie-uri necesare pentru funcționare, precum și mecanisme de consimțământ pentru categorii opționale. Codul aplicației indică existența unor categorii distincte de consimțământ: necesare, preferințe, analitice și marketing.',
      'Cookie-urile strict necesare sunt folosite pentru funcționarea site-ului, inclusiv pentru sesiune, coșul de cumpărături și salvarea preferințelor esențiale. Cookie-urile opționale sunt activate doar pe baza consimțământului tău explicit.',
      `Pentru informații complete privind cookie-urile, categoriile utilizate și modul în care îți poți modifica opțiunile, consultă pagina ${siteConfig.url}/cookie-uri.`,
    ],
  },
  {
    title: '8. Analitice și monitorizarea utilizării site-ului',
    paragraphs: [
      'Codul aplicației indică o soluție internă de analytics pentru înregistrarea unor evenimente precum vizualizarea produselor, adăugarea în coș, începerea checkout-ului și finalizarea achiziției. În acest context pot fi prelucrate identificatorul de sesiune, sursa accesării, adresa IP și user-agent-ul dispozitivului.',
      'Scopul acestor prelucrări este înțelegerea modului de utilizare a site-ului, optimizarea fluxurilor comerciale, prevenirea utilizărilor abuzive și îmbunătățirea experienței utilizatorilor.',
      'Din codul analizat nu rezultă în mod explicit integrarea activă, obligatorie și confirmată a unor servicii externe precum Google Analytics, Meta Pixel sau Hotjar. Dacă astfel de servicii vor fi activate ulterior, politica va trebui actualizată în mod corespunzător.',
    ],
  },
  {
    title: '9. Transferuri de date',
    paragraphs: [
      'Datele pot fi prelucrate în România, în Spațiul Economic European sau, după caz, în afara SEE, exclusiv dacă este necesar pentru furnizarea serviciilor și dacă sunt aplicate garanții adecvate conform GDPR.',
      'În măsura în care un furnizor implică transferuri către state terțe, PANTANO SRL va utiliza unul dintre mecanismele recunoscute de GDPR, precum decizii de adecvare, clauze contractuale standard sau alte garanții legale aplicabile.',
      'Dacă, la momentul publicării acestei politici, nu există transferuri active în afara SEE, această secțiune rămâne aplicabilă ca informare preventivă pentru situația în care anumite servicii externe vor fi activate ulterior.',
    ],
  },
  {
    title: '10. Durata de stocare',
    paragraphs: [
      'Păstrăm datele cu caracter personal doar pe perioada necesară îndeplinirii scopurilor pentru care au fost colectate sau pe perioada impusă de obligațiile legale.',
    ],
    bullets: [
      'Datele aferente contului de client se păstrează pe durata existenței contului și, ulterior, conform termenelor de retenție aplicabile sau până la ștergerea/anonimizarea lor, dacă legea permite.',
      'Datele privind comenzile, facturile și documentele fiscale se păstrează pe durata prevăzută de legislația fiscală și contabilă.',
      'Datele privind newsletter-ul se păstrează atât timp cât abonarea este activă sau până la retragerea consimțământului, cu menținerea unei evidențe minime necesare pentru demonstrarea consimțământului sau gestionarea dezabonării.',
      'Datele privind analytics și securitatea se păstrează doar atât cât este necesar pentru scopurile de analiză, securitate și prevenire a fraudei, în funcție de politicile interne de retenție.',
      'Mesajele transmise prin formularele de contact se păstrează pe durata necesară soluționării solicitării și pentru o perioadă rezonabilă ulterioară, necesară documentării comunicării.',
    ],
  },
  {
    title: '11. Securitatea datelor',
    paragraphs: [
      'Aplicăm măsuri tehnice și organizatorice adecvate pentru protejarea datelor personale împotriva accesului neautorizat, pierderii, distrugerii, modificării ori divulgării nepermise.',
      'Aceste măsuri pot include controlul accesului, parole securizate, trasabilitate tehnică, separarea rolurilor, utilizarea conexiunilor securizate, mecanisme de identificare a solicitărilor și măsuri rezonabile de protecție a infrastructurii.',
      'Nicio măsură de securitate nu poate garanta protecție absolută, însă PANTANO SRL revizuiește și actualizează periodic măsurile aplicate în raport cu riscurile identificate.',
    ],
  },
  {
    title: '12. Drepturile persoanei vizate',
    paragraphs: [
      'În condițiile prevăzute de GDPR, beneficiezi de următoarele drepturi cu privire la datele tale personale.',
    ],
    bullets: [
      'Dreptul de acces la datele prelucrate.',
      'Dreptul la rectificarea datelor inexacte sau incomplete.',
      'Dreptul la ștergerea datelor, în cazurile prevăzute de lege.',
      'Dreptul la restricționarea prelucrării.',
      'Dreptul la portabilitatea datelor.',
      'Dreptul la opoziție față de anumite prelucrări, în special cele întemeiate pe interes legitim sau cele de marketing direct.',
      'Dreptul de a-ți retrage consimțământul în orice moment, pentru prelucrările bazate pe consimțământ.',
      'Dreptul de a depune plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP).',
    ],
  },
  {
    title: '13. Cum îți exerciți drepturile',
    paragraphs: [
      'Pentru exercitarea drepturilor tale ne poți transmite o solicitare la adresa office@pantano.ro sau prin datele de contact afișate în pagina de contact. Pentru a proteja confidențialitatea datelor, putem solicita informații suplimentare necesare verificării identității tale.',
      'Vom răspunde solicitărilor în termenul prevăzut de lege, de regulă în cel mult o lună de la primirea cererii, cu posibilitatea prelungirii în cazurile permise de GDPR.',
    ],
  },
  {
    title: '14. Actualizarea politicii',
    paragraphs: [
      'PANTANO SRL poate actualiza periodic prezenta Politică de Confidențialitate pentru a reflecta modificări legislative, comerciale sau tehnice. Versiunea actualizată va fi publicată pe site și va produce efecte de la data publicării.',
      'Îți recomandăm să consulți periodic această pagină pentru a fi la curent cu modul în care sunt prelucrate datele tale personale.',
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

      <div className="space-y-6">
        <LegalPageLayout sections={privacySections} />
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
