/**
 * Main navigation and footer links.
 * Can be driven by CMS later.
 */

export const mainNavLinks = [
  { label: 'Categorii', href: '/categorii', megaMenu: true },
  { label: 'Oferte', href: '/oferte' },
  { label: 'Magazin', href: '/magazin' },
  { label: 'Servicii', href: '/servicii' },
  { label: 'Inspirații', href: '/inspiratii' },
] as const;

export const footerSections = [
  {
    title: 'Cumpărături',
    links: [
      { label: 'Toate categoriile', href: '/categorii' },
      { label: 'Oferte', href: '/oferte' },
      { label: 'Produse noi', href: '/produse-noi' },
      { label: 'Ridicare din magazin', href: '/ridicare' },
    ],
  },
  {
    title: 'Servicii',
    links: [
      { label: 'Livrare', href: '/livrare' },
      { label: 'Asamblare', href: '/asamblare' },
      { label: 'Credit', href: '/credit' },
    ],
  },
  {
    title: 'Ajutor & Contact',
    links: [
      { label: 'Întrebări frecvente', href: '/faq' },
      { label: 'Cum comand', href: '/cum-comand' },
      { label: 'Cum plătesc', href: '/cum-platesc' },
      { label: 'Livrarea produselor', href: '/livrarea-produselor' },
      { label: 'Formular de contact', href: '/contact' },
      { label: 'Formular de retragere/retur', href: '/formular-retur' },
      { label: 'Sustenabilitate', href: '/sustenabilitate' },
    ],
  },
  {
    title: 'Cont',
    links: [
      { label: 'Contul meu', href: '/cont' },
      { label: 'Istoric comenzi', href: '/cont/comenzi' },
      { label: 'Adrese', href: '/cont/adrese' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Termeni și condiții', href: '/termeni' },
      { label: 'Politica de confidențialitate', href: '/confidentialitate' },
      { label: 'Politica de retur', href: '/politica-de-retur' },
      { label: 'Cookie-uri', href: '/cookie-uri' },
    ],
  },
] as const;
