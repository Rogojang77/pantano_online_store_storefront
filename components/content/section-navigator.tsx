'use client';

type NavigatorItem = {
  id: string;
  title: string;
};

type SectionNavigatorProps = {
  items: NavigatorItem[];
  title?: string;
};

export function SectionNavigator({
  items,
  title = 'Navigare rapidă',
}: SectionNavigatorProps) {
  return (
    <aside className="lg:sticky lg:top-24">
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          {title}
        </p>
        <nav aria-label={title} className="max-h-[70vh] overflow-y-auto">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="block rounded-lg px-3 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700/60 dark:hover:text-white"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
