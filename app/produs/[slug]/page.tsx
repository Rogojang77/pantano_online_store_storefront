import { notFound } from 'next/navigation';
import { productsApi, getCategoryBySlug, buildCategoryBreadcrumbs } from '@/lib/api';
import { ProductDetailClient } from '@/features/products/product-detail-client';
import type { Metadata } from 'next';
import type { BreadcrumbItem } from '@/features/categories/category-breadcrumbs';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await productsApi.bySlug(slug);
    return {
      title: product.name,
      description: product.metaDescription ?? product.description ?? undefined,
      openGraph: {
        title: product.name,
        description: product.metaDescription ?? product.description ?? undefined,
      },
    };
  } catch {
    return {};
  }
}

function buildProductBreadcrumbItems(
  product: { name: string; slug: string; category?: { slug: string } | null },
  categoryBreadcrumbItems: BreadcrumbItem[] | null
): BreadcrumbItem[] {
  const home = { name: 'Acasă', slug: '' };
  if (categoryBreadcrumbItems && categoryBreadcrumbItems.length > 0) {
    return [home, ...categoryBreadcrumbItems, { name: product.name, slug: '' }];
  }
  return [home, { name: product.name, slug: '' }];
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  let product;
  try {
    product = await productsApi.bySlug(slug);
  } catch {
    notFound();
  }

  let breadcrumbItems: BreadcrumbItem[] = [{ name: 'Acasă', slug: '' }, { name: product.name, slug: '' }];
  if (product.category?.slug) {
    try {
      const category = await getCategoryBySlug(product.category.slug);
      const categoryPath = buildCategoryBreadcrumbs(category);
      breadcrumbItems = buildProductBreadcrumbItems(product, categoryPath);
    } catch {
      // keep default breadcrumb
    }
  }

  let relatedProducts: Awaited<ReturnType<typeof productsApi.related>> = [];
  let similarProducts: Awaited<ReturnType<typeof productsApi.similar>> = [];
  let reviewsData: Awaited<ReturnType<typeof productsApi.reviews>> = {
    data: [],
    summary: { averageRating: 0, totalCount: 0 },
  };
  let questionsData: Awaited<ReturnType<typeof productsApi.questions>> = [];
  try {
    [relatedProducts, similarProducts, reviewsData, questionsData] = await Promise.all([
      productsApi.related(product.id, 8),
      productsApi.similar(product.id, 8),
      productsApi.reviews(product.id, 50),
      productsApi.questions(product.id, 50),
    ]);
  } catch {
    // keep empty
  }

  return (
    <div className="container-wide py-8">
      <ProductDetailClient
        product={product}
        breadcrumbItems={breadcrumbItems}
        relatedProducts={relatedProducts}
        similarProducts={similarProducts}
        reviewsData={reviewsData}
        questionsData={questionsData}
      />
    </div>
  );
}
