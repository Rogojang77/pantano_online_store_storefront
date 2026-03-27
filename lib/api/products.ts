/**
 * API service functions – mirror backend routes.
 * Used by TanStack Query and server components.
 */

import type {
  Category,
  PaginatedResult,
  Product,
  ProductReviewsResponse,
  ProductQuestionItem,
  SearchProductsResult,
  SearchSuggestionsResult,
  Brand,
  Cart,
  CartItem,
  LoginResponse,
  User,
  CategoryEffectiveAttribute,
} from '@/types/api';
import { api } from '@/lib/api-client';

type ProductsQuery = {
  page?: number;
  limit?: number;
  categoryId?: string;
  includeDescendants?: boolean;
  brandId?: string;
  attributeValueIds?: string[];
  status?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'ean' | 'sku';
  sortDir?: 'asc' | 'desc';
};

export const productsApi = {
  async list(params: ProductsQuery = {}): Promise<PaginatedResult<Product>> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 24;

    const search = new URLSearchParams();
    if (params.page != null) search.set('page', String(params.page));
    if (params.limit != null) search.set('limit', String(params.limit));
    if (params.categoryId) search.set('categoryId', params.categoryId);
    if (params.includeDescendants != null) search.set('includeDescendants', String(params.includeDescendants));
    if (params.brandId) search.set('brandId', params.brandId);
    if (params.attributeValueIds?.length) {
      search.set('attributeValueIds', params.attributeValueIds.join(','));
    }
    if (params.status) search.set('status', params.status);
    if (params.sortBy) search.set('sortBy', params.sortBy);
    if (params.sortDir) search.set('sortDir', params.sortDir);
    const q = search.toString();
    try {
      return await api.get<PaginatedResult<Product>>(q ? `/products?${q}` : '/products');
    } catch {
      // No mock fallback: return an empty list on API failure.
      return {
        data: [],
        meta: {
          total: 0,
          page,
          limit,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
  },
  async bySlug(slug: string): Promise<Product> {
    return api.get<Product>(`/products/slug/${encodeURIComponent(slug)}`);
  },
  async related(productId: string, limit = 8): Promise<Product[]> {
    try {
      return await api.get<Product[]>(`/products/${productId}/related?limit=${limit}`);
    } catch {
      return [];
    }
  },
  async similar(productId: string, limit = 8): Promise<Product[]> {
    try {
      return await api.get<Product[]>(`/products/${productId}/similar?limit=${limit}`);
    } catch {
      return [];
    }
  },
  async reviews(productId: string, limit = 50): Promise<ProductReviewsResponse> {
    try {
      return await api.get<ProductReviewsResponse>(`/products/${productId}/reviews?limit=${limit}`);
    } catch {
      return { data: [], summary: { averageRating: 0, totalCount: 0 } };
    }
  },
  createReview(
    productId: string,
    payload: { rating: number; title?: string; body?: string }
  ) {
    return api.post<{ id: string }>(`/products/${productId}/reviews`, payload);
  },
  async questions(productId: string, limit = 50): Promise<ProductQuestionItem[]> {
    try {
      return await api.get<ProductQuestionItem[]>(`/products/${productId}/questions?limit=${limit}`);
    } catch {
      return [];
    }
  },
  createQuestion(productId: string, question: string) {
    return api.post<{ id: string }>(`/products/${productId}/questions`, { question });
  },
  createAnswer(productId: string, questionId: string, answer: string) {
    return api.post<{ id: string }>(
      `/products/${productId}/questions/${questionId}/answers`,
      { answer }
    );
  },
};

export const categoriesApi = {
  tree: () => api.get<Category[]>('/categories/tree'),
  roots: () => api.get<Category[]>('/categories/roots'),
  bySlug: (slug: string) =>
    api.get<Category>(`/categories/slug/${encodeURIComponent(slug)}`),
  effectiveAttributes: (categoryId: string) =>
    api.get<CategoryEffectiveAttribute[]>(
      `/attributes/category/${encodeURIComponent(categoryId)}/effective`,
    ),
};

export const brandsApi = {
  list: async () => {
    const result = await api.get<PaginatedResult<Brand>>('/brands');
    return result.data;
  },
  bySlug: (slug: string) =>
    api.get<Brand>(`/brands/slug/${encodeURIComponent(slug)}`),
};

type SearchQuery = {
  q: string;
  page?: number;
  limit?: number;
  categoryId?: string;
  brandId?: string;
};

type SearchSuggestionsQuery = {
  q: string;
  productLimit?: number;
  keywordLimit?: number;
  categoryLimit?: number;
};

export const searchApi = {
  products: (params: SearchQuery) => {
    const search = new URLSearchParams({ q: params.q });
    if (params.page != null) search.set('page', String(params.page));
    if (params.limit != null) search.set('limit', String(params.limit));
    if (params.categoryId) search.set('categoryId', params.categoryId);
    if (params.brandId) search.set('brandId', params.brandId);
    return api.get<SearchProductsResult>(`/search/products?${search.toString()}`);
  },
  suggestions: (params: SearchSuggestionsQuery) => {
    const search = new URLSearchParams({ q: params.q });
    if (params.productLimit != null) search.set('productLimit', String(params.productLimit));
    if (params.keywordLimit != null) search.set('keywordLimit', String(params.keywordLimit));
    if (params.categoryLimit != null) search.set('categoryLimit', String(params.categoryLimit));
    return api.get<SearchSuggestionsResult>(`/search/suggestions?${search.toString()}`);
  },
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }),
  register: (payload: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    accountType?: 'INDIVIDUAL' | 'COMPANY';
    companyName?: string;
    companyVatId?: string;
    companyTradeRegister?: string;
    billingAddressLine1?: string;
    billingAddressLine2?: string;
    billingCity?: string;
    billingCounty?: string;
    billingPostalCode?: string;
    billingCountry?: string;
  }) => api.post<LoginResponse>('/auth/register', payload),
  profile: () => {
    return api.get<User>('/auth/profile');
  },
  updateProfile: (payload: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    accountType?: 'INDIVIDUAL' | 'COMPANY';
    companyName?: string;
    companyVatId?: string;
    companyTradeRegister?: string;
    newsletterConsent?: boolean;
    notifyOrderStatus?: boolean;
    language?: string;
  }) => {
    return api.patch<User>('/auth/profile', payload);
  },
  changePassword: (currentPassword: string, newPassword: string) => {
    return api.post<{ message: string }>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },
  logout: () => api.post<{ message: string }>('/auth/logout'),
  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) =>
    api.post<{ message: string }>('/auth/reset-password', { token, newPassword }),
};

export const cartApi = {
  get: () => api.get<Cart>('/cart'),
  addItem: (variantId: string, quantity: number) => api.post<Cart>('/cart/items', { variantId, quantity }),
  updateItem: (variantId: string, quantity: number) => api.put<Cart>(`/cart/items/${variantId}`, { quantity }),
  removeItem: (variantId: string) => api.delete<Cart>(`/cart/items/${variantId}`),
  applyCoupon: (code: string) => api.post<Cart>('/cart/coupon', { code }),
  removeCoupon: () => api.delete<Cart>('/cart/coupon'),
};

export interface ValidateCouponResult {
  valid: boolean;
  message?: string;
  discount?: number;
  promotion?: { id: string; code: string; type: string; value: number };
}

export const promotionsApi = {
  validate: (code: string, subtotal?: number) =>
    api.post<ValidateCouponResult>('/promotions/validate', { code, subtotal }),
};

export type { Cart, CartItem };
