import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Abonare confirmată',
  description: `Ai confirmat abonarea la newsletter. ${siteConfig.name}`,
};

export default function NewsletterConfirmatPage() {
  return (
    <div className="container-wide py-16 text-center">
      <h1 className="heading-page mb-4">Abonare confirmată</h1>
      <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
        Mulțumim! Ești abonat la newsletter-ul nostru și vei primi oferte și noutăți pe email.
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
