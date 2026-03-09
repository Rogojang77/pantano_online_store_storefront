'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TechnicalSpecsTable } from './technical-specs-table';
import type { Product } from '@/types/api';
import { FileText, Download } from 'lucide-react';

interface ProductTabsProps {
  product: Product;
  className?: string;
}

export function ProductTabs({ product, className }: ProductTabsProps) {
  const hasSpecs =
    product.technicalSpecs &&
    typeof product.technicalSpecs === 'object' &&
    Object.keys(product.technicalSpecs).length > 0;
  const documents = product.documents ?? [];
  const hasDocuments = documents.length > 0;

  return (
    <Tabs defaultValue="description" className={className}>
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="description">Descriere</TabsTrigger>
        {hasSpecs && (
          <TabsTrigger value="specs">Specificații tehnice</TabsTrigger>
        )}
        <TabsTrigger value="downloads">Descărcări</TabsTrigger>
      </TabsList>
      <TabsContent value="description" className="mt-4">
        {product.description ? (
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">
              {product.description}
            </p>
          </div>
        ) : (
          <p className="text-neutral-500 dark:text-neutral-400">
            Nu există descriere disponibilă.
          </p>
        )}
      </TabsContent>
      {hasSpecs && (
        <TabsContent value="specs" className="mt-4">
          <TechnicalSpecsTable
            specs={product.technicalSpecs as Record<string, unknown>}
          />
        </TabsContent>
      )}
      <TabsContent value="downloads" className="mt-4">
        {hasDocuments ? (
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li key={doc.id}>
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-600 hover:underline dark:text-primary-400"
                >
                  <Download className="h-4 w-4 shrink-0" />
                  <span>{doc.title}</span>
                  {doc.type && (
                    <span className="text-neutral-500 text-sm">({doc.type})</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
            <FileText className="h-4 w-4 shrink-0" />
            Nu există documente de descărcat pentru acest produs.
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}
