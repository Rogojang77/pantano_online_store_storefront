/**
 * Contact page content: address, phone, email, opening hours, map and form links.
 * Edit here or replace with CMS-driven data later.
 */

export interface ContactAddress {
  street: string;
  city: string;
  postalCode: string;
}

export interface OpeningHoursRow {
  day: string;
  time: string;
}

export interface ContactOpeningHours {
  headline?: string;
  rows: OpeningHoursRow[];
}

export interface ContactConfig {
  /** Page title (e.g. "Contact") */
  pageTitle: string;
  /** Optional hero/banner image URL for the contact page */
  imageUrl?: string;
  address: ContactAddress;
  phone: string;
  email: string;
  openingHours: ContactOpeningHours;
  /** One-line summary for infobox (e.g. "Luni – Sâmbătă 08:00 – 21:00; Duminică 08:00 – 19:00") */
  openingHoursSummary?: string;
  /** Google Maps or other "Planificare rută" URL */
  mapUrl?: string;
  /** Latitude for embedded map (e.g. 47.044857) */
  latitude?: number;
  /** Longitude for embedded map (e.g. 21.898144) */
  longitude?: number;
}

export const contactConfig: ContactConfig = {
  pageTitle: 'Contact',
  imageUrl: undefined,
  address: {
    street: 'Strada Exemplu nr. 1',
    city: 'București',
    postalCode: '010101',
  },
  phone: '+40 21 123 4567',
  email: 'contact@pantano.ro',
  openingHours: {
    headline: 'Program de lucru',
    rows: [
      { day: 'Lun. – Sâm.', time: '08:00 – 21:00' },
      { day: 'Dum.', time: '08:00 – 19:00' },
    ],
  },
  openingHoursSummary: 'Luni – Sâmbătă 08:00 – 21:00; Duminică 08:00 – 19:00',
  mapUrl: 'https://www.google.com/maps',
  latitude: undefined,
  longitude: undefined,
};
