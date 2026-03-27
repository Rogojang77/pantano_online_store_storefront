import Link from "next/link";

import { Button } from "@/components/ui";

export default function NotFoundPage() {
  return (
    <div className="container-wide flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="heading-page mb-3">Pagina nu a fost găsită</h1>
      <p className="mb-8 max-w-xl text-neutral-600 dark:text-neutral-400">
        Linkul poate fi invalid sau pagina a fost mutată. Poți reveni la pagina principală sau la lista de produse.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/">Acasă</Link>
        </Button>
        <Button asChild className="rounded-xl">
          <Link href="/produse">Vezi produse</Link>
        </Button>
      </div>
    </div>
  );
}
