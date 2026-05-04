'use client';

type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type LegalPageLayoutProps = {
  sections: LegalSection[];
};

function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function LegalPageLayout({ sections }: LegalPageLayoutProps) {
  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
      <aside className="lg:sticky lg:top-24">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Navigare rapidă
          </p>
          <nav aria-label="Navigare secțiuni document" className="max-h-[70vh] overflow-y-auto">
            <ul className="space-y-1">
              {sections.map((section) => {
                const id = slugifyHeading(section.title);

                return (
                  <li key={section.title}>
                    <a
                      href={`#${id}`}
                      className="block rounded-lg px-3 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700/60 dark:hover:text-white"
                    >
                      {section.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      <div className="space-y-6">
        {sections.map((section) => {
          const id = slugifyHeading(section.title);

          return (
            <section
              key={section.title}
              id={id}
              className="scroll-mt-24 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3 text-neutral-600 dark:text-neutral-400">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets ? (
                  <ul className="list-inside list-disc space-y-1">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
