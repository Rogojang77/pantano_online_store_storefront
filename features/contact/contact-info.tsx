import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, Map } from 'lucide-react';
import type { ContactConfig } from '@/config/contact';

interface ContactInfoProps {
  config: ContactConfig;
}

const linkClass =
  'text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 underline underline-offset-2';

export function ContactInfo({ config }: ContactInfoProps) {
  const { address, phone, email, openingHours, mapUrl, imageUrl } = config;
  const telHref = phone.replace(/\s/g, '').startsWith('+') ? `tel:${phone.replace(/\s/g, '')}` : `tel:${phone}`;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden dark:border-neutral-700 dark:bg-neutral-800">
      <div className={`p-6 ${imageUrl ? 'md:grid md:grid-cols-2 md:gap-8' : ''}`}>
        {/* Left: all contact info */}
        <div className="space-y-6">
          <div className="flex gap-3">
            <MapPin
              className="h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400"
              aria-hidden
            />
            <div>
              <p className="font-medium text-neutral-900 dark:text-white">Adresă</p>
              <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                {address.street}
                <br />
                {address.postalCode} {address.city}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Phone
              className="h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400"
              aria-hidden
            />
            <div>
              <p className="font-medium text-neutral-900 dark:text-white">Telefon</p>
              <a
                href={telHref}
                className={linkClass}
                aria-label={`Număr de telefon ${phone}`}
              >
                {phone}
              </a>
            </div>
          </div>

          <div className="flex gap-3">
            <Mail
              className="h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400"
              aria-hidden
            />
            <div>
              <p className="font-medium text-neutral-900 dark:text-white">Email</p>
              <a
                href={`mailto:${email}`}
                className={linkClass}
                aria-label={`Adresa de e-mail ${email}`}
              >
                {email}
              </a>
            </div>
          </div>

          <div className="flex gap-3">
            <Clock
              className="h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400"
              aria-hidden
            />
            <div>
              {openingHours.headline && (
                <p className="font-medium text-neutral-900 dark:text-white">
                  {openingHours.headline}
                </p>
              )}
              <ul className="mt-1 space-y-1 text-neutral-600 dark:text-neutral-400">
                {openingHours.rows.map((row, i) => (
                  <li key={i} className="flex justify-between gap-4">
                    <span>{row.day}</span>
                    <span>{row.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 ${linkClass}`}
              aria-label="Planificare rută (se deschide într-o fereastră nouă)"
            >
              <Map className="h-4 w-4" aria-hidden />
              Planificare rută
            </a>
          )}
        </div>

        {/* Right: image */}
        {imageUrl && (
          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800/80 mt-6 md:mt-0">
            <Image
              src={imageUrl}
              alt=""
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
      </div>
    </div>
  );
}
