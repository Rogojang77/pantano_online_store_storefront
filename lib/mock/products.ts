import type { Product, ProductImage, ProductVariant } from '@/types/api';

const MOCK_CATEGORY_ID = 'mock-cat-1';
const MOCK_BRAND_ID = 'mock-brand-1';

function mockImage(id: string, seed: number, alt: string): ProductImage {
  return {
    id: `mock-img-${id}`,
    url: `https://picsum.photos/seed/${seed}/600/600`,
    alt,
    sortOrder: 0,
    isPrimary: true,
  };
}

function mockVariant(
  productId: string,
  id: string,
  sku: string,
  price: string,
  compareAt: string | null,
  stock: number,
  weightOverride?: string | null
): ProductVariant {
  return {
    id: `mock-var-${id}`,
    productId,
    sku,
    name: null,
    price,
    compareAtPrice: compareAt,
    stockQuantity: stock,
    isActive: true,
    sortOrder: 0,
    weightOverride: weightOverride ?? undefined,
  };
}

export const mockProducts: Product[] = [
  {
    id: 'mock-prod-1',
    sku: 'CEM-001',
    name: 'Ciment Portland 42.5R',
    slug: 'ciment-portland-42-5r',
    description: 'Ciment de înaltă rezistență pentru beton, mortar și tencuieli. Sac 50 kg.',
    technicalSpecs: null,
    categoryId: MOCK_CATEGORY_ID,
    brandId: MOCK_BRAND_ID,
    status: 'ACTIVE',
    metaTitle: null,
    metaDescription: null,
    metaKeywords: null,
    weight: '50',
    reviewSummary: { averageRating: 4.6, totalCount: 24 },
    images: [mockImage('1', 101, 'Ciment Portland')],
    variants: [mockVariant('mock-prod-1', '1', 'CEM-001', '28.50', '32.00', 120, '50')],
  },
  {
    id: 'mock-prod-2',
    sku: 'NIS-002',
    name: 'Nisip pentru construcții 0–4 mm',
    slug: 'nisip-constructii-0-4mm',
    description: 'Nisip sortat pentru beton și zidărie. Livrare la sac sau vrac.',
    technicalSpecs: null,
    categoryId: MOCK_CATEGORY_ID,
    brandId: null,
    status: 'ACTIVE',
    metaTitle: null,
    metaDescription: null,
    metaKeywords: null,
    weight: '25',
    reviewSummary: { averageRating: 4.2, totalCount: 18 },
    images: [mockImage('2', 102, 'Nisip construcții')],
    variants: [mockVariant('mock-prod-2', '2', 'NIS-002', '12.00', null, 500, '25')],
  },
  {
    id: 'mock-prod-3',
    sku: 'PLA-003',
    name: 'Placă gips-carton 12,5 mm',
    slug: 'placa-gips-carton-12-5mm',
    description: 'Placă standard rezistentă la umiditate. 2500×1200 mm.',
    technicalSpecs: null,
    categoryId: MOCK_CATEGORY_ID,
    brandId: MOCK_BRAND_ID,
    status: 'ACTIVE',
    metaTitle: null,
    metaDescription: null,
    metaKeywords: null,
    reviewSummary: { averageRating: 4.8, totalCount: 31 },
    images: [mockImage('3', 103, 'Placă gips-carton')],
    variants: [mockVariant('mock-prod-3', '3', 'PLA-003', '45.00', '52.00', 80)],
  },
  {
    id: 'mock-prod-4',
    sku: 'VOP-004',
    name: 'Vopsea lavabilă interior alb',
    slug: 'vopsea-lavabila-interior-alb',
    description: 'Vopsea lavabilă mată pentru pereți și tavan. Acoperire excelentă, 2 straturi.',
    technicalSpecs: null,
    categoryId: MOCK_CATEGORY_ID,
    brandId: MOCK_BRAND_ID,
    status: 'ACTIVE',
    metaTitle: null,
    metaDescription: null,
    metaKeywords: null,
    reviewSummary: { averageRating: 4.5, totalCount: 12 },
    images: [mockImage('4', 104, 'Vopsea lavabilă')],
    variants: [mockVariant('mock-prod-4', '4', 'VOP-004', '89.00', null, 45)],
  },
  {
    id: 'mock-prod-5',
    sku: 'SCA-005',
    name: 'Scară extensibilă aluminiu 3×12 trepte',
    slug: 'scara-extensibila-aluminiu-3x12',
    description: 'Scară extensibilă din aluminiu, 3×12 trepte, înălțime max. 3,60 m.',
    technicalSpecs: null,
    categoryId: MOCK_CATEGORY_ID,
    brandId: null,
    status: 'ACTIVE',
    metaTitle: null,
    metaDescription: null,
    metaKeywords: null,
    reviewSummary: { averageRating: 4.9, totalCount: 8 },
    images: [mockImage('5', 105, 'Scară extensibilă')],
    variants: [mockVariant('mock-prod-5', '5', 'SCA-005', '189.00', '220.00', 25)],
  },
];

export function getMockProductBySlug(slug: string): Product | undefined {
  return mockProducts.find((p) => p.slug === slug);
}

export function getMockProductsList(): Product[] {
  return mockProducts;
}
