'use client';

/**
 * Embedded OpenStreetMap view for the contact page.
 * Renders when both latitude and longitude are provided in config.
 */
interface ContactMapProps {
  latitude: number;
  longitude: number;
  /** Optional link to open full map in new tab (e.g. Google Maps) */
  mapUrl?: string;
  className?: string;
}

const ZOOM_DELTA = 0.008;

export function ContactMap({ latitude, longitude, mapUrl, className = '' }: ContactMapProps) {
  const minLon = longitude - ZOOM_DELTA;
  const minLat = latitude - ZOOM_DELTA;
  const maxLon = longitude + ZOOM_DELTA;
  const maxLat = latitude + ZOOM_DELTA;
  const bbox = `${minLon},${minLat},${maxLon},${maxLat}`;
  const marker = `${latitude},${longitude}`;
  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(marker)}`;

  return (
    <div className={className}>
      <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="aspect-video w-full min-h-[280px] relative">
          <iframe
            src={embedSrc}
            title="Locație pe hartă"
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        {mapUrl && (
          <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800/50">
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Deschide în Google Maps / Planificare rută →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
