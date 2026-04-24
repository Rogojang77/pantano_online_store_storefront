/**
 * API response types aligned with backend DTOs and Prisma models.
 * Single source of truth for storefront ↔ API contract.
 */

// --- Pagination (matches backend common/dto/pagination.dto.ts) ---
export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginatedMeta;
}

// --- Category (tree + flat) ---
export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  parentId: string | null;
  level: number;
  path: string;
  isActive: boolean;
  sortOrder: number;
  children?: Category[];
  /** Present when fetching by slug (for breadcrumbs) */
  parent?: { id: string; name: string; slug: string } | null;
  /** Ancestors from root to immediate parent (up to 3), when fetching by slug */
  ancestors?: { id: string; name: string; slug: string }[];
}

export interface CategoryAttributeValue {
  id: string;
  value: string;
  sortOrder: number;
}

export interface CategoryAttributeDefinition {
  id: string;
  name: string;
  slug: string;
  type: string;
  unit: string | null;
  isFilterable: boolean;
  sortOrder: number;
  values: CategoryAttributeValue[];
}

export interface CategoryEffectiveAttribute {
  id: string;
  categoryId: string;
  definitionId: string;
  isRequired: boolean;
  sortOrder: number;
  sourceCategoryName?: string | null;
  definition: CategoryAttributeDefinition;
}

// --- Brand ---
export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  isActive: boolean;
}

export interface ProductBrandFacet {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  productCount: number;
}

export interface ProductAttributeFacetValue {
  id: string;
  value: string;
  normalizedValue: string;
  productCount: number;
  selected: boolean;
  disabled: boolean;
}

export interface ProductAttributeFacet {
  definitionId: string;
  name: string;
  code: string;
  dataType: string;
  filterType: 'checkbox' | 'dropdown' | 'range';
  unit: string | null;
  sortOrder: number;
  values: ProductAttributeFacetValue[];
  range?: { min: number; max: number };
}

export interface ProductFilterFacetsResponse {
  totalProducts: number;
  brands: ProductBrandFacet[];
  price: { min: number | null; max: number | null };
  attributes: ProductAttributeFacet[];
}

// --- Product image ---
export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

// --- Product variant ---
export interface ProductVariant {
  id: string;
  productId: string;
  ean: string | null;
  sku: string;
  name: string | null;
  price: string;
  compareAtPrice: string | null;
  stockQuantity: number;
  isActive: boolean;
  sortOrder: number;
  /** Weight override in kg (for price/kg display) */
  weightOverride?: string | null;
}

// --- Product document ---
export interface ProductDocument {
  id: string;
  productId: string;
  title: string;
  type: string | null;
  fileUrl: string;
  sortOrder: number;
}

// --- Product (list + detail) ---
export interface Product {
  id: string;
  ean: string | null;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  technicalSpecs: Record<string, unknown> | null;
  categoryId: string;
  brandId: string | null;
  status: string;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  /** e.g. ["bestseller", "new", "eco"] */
  badges?: string[] | null;
  /** Product weight in kg (for price/kg display) */
  weight?: string | null;
  /** Review summary when included in list/detail response */
  reviewSummary?: { averageRating: number; totalCount: number };
  category?: Category;
  brand?: Brand | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
  documents?: ProductDocument[];
}

// --- Cart (backend returns cart with items including variant relation) ---
export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  variant?: ProductVariant & { product?: Product };
}

export interface Cart {
  id: string;
  userId: string | null;
  sessionId: string | null;
  items: CartItem[];
  /** Applied coupon code */
  couponCode?: string | null;
  /** Discount amount (e.g. from promotion) */
  discountAmount?: number;
  /** Cart total after discount */
  total?: number;
  /** Subtotal before discount */
  subtotal?: number;
  /** Applied promotion summary (when coupon is applied) */
  promotion?: { id: string; code: string; type: string; value: number };
}

// --- Auth (mocked / JWT) ---
export type AccountType = 'INDIVIDUAL' | 'COMPANY';

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  accountType?: AccountType;
  companyName?: string | null;
  companyVatId?: string | null;
  companyTradeRegister?: string | null;
  newsletterConsent?: boolean;
  notifyOrderStatus?: boolean;
  language?: string;
}

export interface LoginResponse {
  accessToken?: string;
  access_token?: string;
  user?: User;
}

// --- Product Q&A ---
export interface ProductQuestionAnswer {
  id: string;
  answer: string;
  createdAt: string;
  user: { firstName: string | null; lastName: string | null } | null;
}

export interface ProductQuestionItem {
  id: string;
  question: string;
  createdAt: string;
  user: { firstName: string | null; lastName: string | null } | null;
  answers: ProductQuestionAnswer[];
}

// --- Product reviews ---
export interface ProductReview {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  createdAt: string;
  user: { firstName: string | null; lastName: string | null } | null;
}

export interface ProductReviewsResponse {
  data: ProductReview[];
  summary: { averageRating: number; totalCount: number };
}

// --- Search ---
export type SearchProductsResult = PaginatedResult<Product>;

export interface SearchSuggestionsCategory {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export interface SearchSuggestionsResult {
  keywords: string[];
  products: Product[];
  categories: SearchSuggestionsCategory[];
  totalProducts: number;
}

// --- CMS blocks (headless-ready) ---
export type CmsBlockType = 'hero' | 'promo_grid' | 'banner' | 'category_teaser';

export interface CmsHeroBlock {
  type: 'hero';
  id: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl: string;
  imageAlt?: string;
  variant: 'default' | 'split' | 'full_bleed';
}

export interface CmsPromoBlock {
  type: 'promo_grid';
  id: string;
  items: Array<{
    id: string;
    title: string;
    subtitle?: string;
    href: string;
    imageUrl: string;
    imageAlt?: string;
  }>;
  columns?: 2 | 3 | 4;
}

export interface CmsBannerBlock {
  type: 'banner';
  id: string;
  title: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  backgroundColor?: string;
  textColor?: string;
  backgroundImageUrl?: string;
  backgroundImageAlt?: string;
}

export type CmsBlock = CmsHeroBlock | CmsPromoBlock | CmsBannerBlock;

// --- Orders ---
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'READY_FOR_PICKUP' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type OrderType = 'RESERVATION' | 'DELIVERY';

export interface OrderItem {
  id: string;
  variantId: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  variant?: { ean?: string; sku?: string; name?: string; product?: { name: string; slug?: string } };
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  type: OrderType;
  status: OrderStatus;
  paymentStatus: string;
  guestEmail?: string | null;
  accountType?: AccountType;
  companyName?: string | null;
  companyVatId?: string | null;
  companyTradeRegister?: string | null;
  billingSameAsShipping?: boolean;
  deliveryMethod?: string | null;
  paymentMethod?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  county?: string | null;
  postalCode?: string | null;
  country?: string | null;
  billingAddressLine1?: string | null;
  billingAddressLine2?: string | null;
  billingCity?: string | null;
  billingCounty?: string | null;
  billingPostalCode?: string | null;
  billingCountry?: string | null;
  deliveryFee?: string | null;
  subtotal: string;
  discountAmount?: string | null;
  total: string;
  createdAt: string;
  items: OrderItem[];
  user?: User | null;
  invoice?: {
    id: string;
    invoiceNumber: string;
    odooInvoiceId: string | null;
  } | null;
}

// --- Addresses ---
export type AddressType = 'SHIPPING' | 'BILLING';
export type AddressLabel = 'Home' | 'Work' | 'Site' | 'Warehouse' | 'Other';

export interface Address {
  id: string;
  userId: string;
  type: AddressType;
  label: AddressLabel;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  county?: string | null;
  postalCode: string;
  country: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Invoices ---
export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  userId: string;
  amount: string;
  status: string;
  issuedAt: string;
  odooInvoiceId?: string | null;
  order?: { orderNumber: string; createdAt: string };
}

// --- Saved Carts / Projects ---
export interface SavedCartItem {
  id: string;
  variantId: string;
  quantity: number;
  variant?: ProductVariant & { product?: { name: string; slug?: string } };
}

export interface SavedCart {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  items: SavedCartItem[];
  _count?: { items: number };
}
