import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Te-ai dezabonat',
  description: `Ai fost dezabonat de la newsletter. ${siteConfig.name}`,
};

export default function NewsletterDezabonatPage() {
  return (
    <div className="container-wide py-16 text-center">
      <h1 className="heading-page mb-4">Te-ai dezabonat</h1>
      <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
        Nu vei mai primi newsletter-ul nostru. Poți să te abonezi din nou oricând.
      </p>
      <Link
        href="/"
        className="text-primary-600 underline hover:text-primary-700 dark:text-primary-400"
      >
        Înapoi la prima pagină
      </Link>
    </div>
  );
}
