'use client';

import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TechnicalSpecsTable } from './technical-specs-table';
import type { Product } from '@/types/api';
import { FileText, Download, CheckCircle2, ChevronDown } from 'lucide-react';
import {
  parseStructuredProductDescription,
  sanitizeProductDescriptionHtml,
} from '@/lib/product-html';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductTabsProps {
  product: Product;
  className?: string;
}

function isPetshopProduct(product: Product): boolean {
  const categorySlug = product.category?.slug?.toLowerCase() ?? '';
  const categoryName = product.category?.name?.toLowerCase() ?? '';
  return (
    categorySlug.includes('petshop') ||
    categorySlug.includes('pet-shop') ||
    categoryName.includes('petshop') ||
    categoryName.includes('pet shop')
  );
}

export function ProductTabs({ product, className }: ProductTabsProps) {
  const hasSpecs =
    product.technicalSpecs &&
    typeof product.technicalSpecs === 'object' &&
    Object.keys(product.technicalSpecs).length > 0;
  const documents = product.documents ?? [];
  const hasDocuments = documents.length > 0;
  const primaryImage = product.images?.find((image) => image.isPrimary) ?? product.images?.[0];
  const structuredDescription = isPetshopProduct(product) && product.description
    ? parseStructuredProductDescription(product.description)
    : null;

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
          structuredDescription ? (
            <div className="space-y-8">
              <Card className="overflow-hidden border-neutral-200 bg-gradient-to-br from-sky-50 via-white to-neutral-50">
                <CardContent className="grid gap-6 p-5 md:grid-cols-[minmax(0,1.6fr)_280px] md:p-7">
                  <div className="space-y-4">
                    {structuredDescription.introLabel ? (
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                        {structuredDescription.introLabel}
                      </p>
                    ) : null}
                    <div className="space-y-3">
                      <h3 className="text-2xl font-semibold text-neutral-950 dark:text-white">
                        {product.name}
                      </h3>
                      {structuredDescription.summary ? (
                        <p className="max-w-3xl text-sm leading-7 text-neutral-700 dark:text-neutral-300">
                          {structuredDescription.summary}
                        </p>
                      ) : null}
                    </div>

                    {structuredDescription.highlightChips.length ? (
                      <div className="flex flex-wrap gap-2">
                        {structuredDescription.highlightChips.map((chip) => (
                          <Badge
                            key={chip}
                            variant="outline"
                            className="rounded-full bg-white/70 px-3 py-1 text-[11px] uppercase tracking-wide text-neutral-700"
                          >
                            {chip}
                          </Badge>
                        ))}
                      </div>
                    ) : null}

                    {structuredDescription.heroStats.length ? (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {structuredDescription.heroStats.map((stat) => (
                          <div
                            key={`${stat.label}-${stat.value}`}
                            className="rounded-2xl border border-white/80 bg-white/85 p-3 shadow-sm"
                          >
                            <p className="text-xs font-medium text-neutral-500">
                              {stat.label}
                            </p>
                            <p className="mt-1 text-base font-semibold text-neutral-950 dark:text-white">
                              {stat.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {structuredDescription.heroNote ? (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {structuredDescription.heroNote}
                      </p>
                    ) : null}
                  </div>

                  {primaryImage ? (
                    <div className="flex items-center justify-center rounded-3xl border border-white/80 bg-white/90 p-6 shadow-sm">
                      <Image
                        src={primaryImage.url}
                        alt={primaryImage.alt ?? product.name}
                        width={240}
                        height={240}
                        className="h-auto max-h-[240px] w-auto object-contain"
                      />
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              {structuredDescription.attributeImageUrl ? (
                <section className="flex justify-center">
                  <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white p-4 shadow-card">
                    <Image
                      src={structuredDescription.attributeImageUrl}
                      alt={`${product.name} atribute`}
                      width={720}
                      height={320}
                      className="h-auto max-w-full object-contain"
                    />
                  </div>
                </section>
              ) : null}

              {structuredDescription.benefits.length ? (
                <section className="space-y-4">
                  <h4 className="text-xl font-semibold text-neutral-950 dark:text-white">
                    Beneficii cheie
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {structuredDescription.benefits.map((benefit) => (
                      <Card key={`${benefit.title}-${benefit.body}`} className="h-full">
                        <CardContent className="flex h-full flex-col gap-3 p-5">
                          <div className="flex items-start gap-3">
                            <span className="mt-0.5 rounded-full bg-primary-50 p-1.5 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                              <CheckCircle2 className="h-4 w-4" />
                            </span>
                            <div className="space-y-1">
                              <p className="font-medium text-neutral-950 dark:text-white">
                                {benefit.title}
                              </p>
                              <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                                {benefit.body}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              ) : null}

              {(structuredDescription.ingredients.length || structuredDescription.analytics.length) ? (
                <section className="grid gap-4 lg:grid-cols-2">
                  {structuredDescription.ingredients.length ? (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-2xl">Ingrediente</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm leading-7 text-neutral-700 dark:text-neutral-300">
                        {structuredDescription.ingredients.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </CardContent>
                    </Card>
                  ) : null}

                  {structuredDescription.analytics.length ? (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-2xl">Constituenți analitici</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
                          {structuredDescription.analytics.map((item, index) => (
                            <div
                              key={`${item.label}-${item.value}`}
                              className="grid grid-cols-[minmax(0,1fr)_120px] border-b border-neutral-200 text-sm dark:border-neutral-700 last:border-b-0"
                            >
                              <div className="bg-white px-4 py-3 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                                {item.label}
                              </div>
                              <div className="border-l border-neutral-200 bg-neutral-50 px-4 py-3 text-right font-medium text-neutral-950 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                                {item.value}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ) : null}
                </section>
              ) : null}

              {structuredDescription.additives.length ? (
                <section className="space-y-4">
                  <h4 className="text-xl font-semibold text-neutral-950 dark:text-white">
                    Aditivi nutriționali
                  </h4>
                  <div className="grid gap-4 lg:grid-cols-2">
                    {structuredDescription.additives.map((group) => (
                      <Card key={group.title}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-xl">{group.title}</CardTitle>
                          {group.subtitle ? (
                            <p className="text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                              {group.subtitle}
                            </p>
                          ) : null}
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
                            {group.rows.map((row) => (
                              <div
                                key={`${row.label}-${row.value}`}
                                className="grid grid-cols-[minmax(0,1fr)_140px] border-b border-neutral-200 text-sm dark:border-neutral-700 last:border-b-0"
                              >
                                <div className="bg-white px-4 py-3 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                                  {row.label}
                                </div>
                                <div className="border-l border-neutral-200 bg-neutral-50 px-4 py-3 text-right font-medium text-neutral-950 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                                  {row.value}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              ) : null}

              {structuredDescription.feedingGuide ? (
                <section className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-xl font-semibold text-neutral-950 dark:text-white">
                      {structuredDescription.feedingGuide.title}
                    </h4>
                    {structuredDescription.feedingGuide.intro ? (
                      <p className="max-w-4xl text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                        {structuredDescription.feedingGuide.intro}
                      </p>
                    ) : null}
                  </div>
                  <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        {structuredDescription.feedingGuide.headers.length ? (
                          <thead className="bg-sky-50 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                            <tr>
                              {structuredDescription.feedingGuide.headers.map((header) => (
                                <th
                                  key={header}
                                  className="whitespace-nowrap px-4 py-3 text-left font-medium"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                        ) : null}
                        <tbody>
                          {structuredDescription.feedingGuide.rows.map((row, rowIndex) => (
                            <tr
                              key={`${row.join('-')}-${rowIndex}`}
                              className="border-t border-neutral-200 dark:border-neutral-700"
                            >
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={`${cell}-${cellIndex}`}
                                  className="whitespace-nowrap px-4 py-3 text-neutral-700 dark:text-neutral-300"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                  {structuredDescription.feedingGuide.note ? (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {structuredDescription.feedingGuide.note}
                    </p>
                  ) : null}
                </section>
              ) : null}

              {structuredDescription.faq.length ? (
                <section className="space-y-4">
                  <h4 className="text-xl font-semibold text-neutral-950 dark:text-white">
                    FAQ
                  </h4>
                  <div className="space-y-3">
                    {structuredDescription.faq.map((item, index) => (
                      <details
                        key={`${item.question}-${index}`}
                        className="group rounded-2xl border border-neutral-200 bg-white px-5 py-4 shadow-card dark:border-neutral-700 dark:bg-neutral-800"
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-neutral-950 dark:text-white">
                          <span>{item.question}</span>
                          <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400 transition group-open:rotate-180" />
                        </summary>
                        <p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                          {item.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </section>
              ) : null}

              {structuredDescription.sections.length ? (
                <section className="grid gap-4 lg:grid-cols-2">
                  {structuredDescription.sections.map((section) => (
                    <Card key={section.title}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl">{section.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm leading-7 text-neutral-700 dark:text-neutral-300">
                        {section.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </section>
              ) : null}
            </div>
          ) : (
            <div
              className="prose prose-neutral dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-400"
              // HTML from product catalog (WooCommerce / imports); stripped before inject
              dangerouslySetInnerHTML={{
                __html: sanitizeProductDescriptionHtml(product.description),
              }}
            />
          )
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
