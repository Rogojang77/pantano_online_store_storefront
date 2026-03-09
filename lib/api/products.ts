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
} from '@/types/api';
import { api, getAuthToken } from '@/lib/api-client';
import { getMockProductBySlug, getMockProductsList } from '@/lib/mock/products';

type ProductsQuery = {
  page?: number;
  limit?: number;
  categoryId?: string;
  brandId?: string;
  status?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'sku';
  sortDir?: 'asc' | 'desc';
};

function mockListResult(params: ProductsQuery): PaginatedResult<Product> {
  const limit = params.limit ?? 24;
  const list = getMockProductsList();
  return {
    data: list,
    meta: {
      total: list.length,
      page: params.page ?? 1,
      limit,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  };
}

export const productsApi = {
  async list(params: ProductsQuery = {}): Promise<PaginatedResult<Product>> {
    const search = new URLSearchParams();
    if (params.page != null) search.set('page', String(params.page));
    if (params.limit != null) search.set('limit', String(params.limit));
    if (params.categoryId) search.set('categoryId', params.categoryId);
    if (params.brandId) search.set('brandId', params.brandId);
    if (params.status) search.set('status', params.status);
    if (params.sortBy) search.set('sortBy', params.sortBy);
    if (params.sortDir) search.set('sortDir', params.sortDir);
    const q = search.toString();
    try {
      const result = await api.get<PaginatedResult<Product>>(q ? `/products?${q}` : '/products');
      if (result.data.length > 0) return result;
    } catch {
      // API error or empty – use mock
    }
    return mockListResult(params);
  },
  async bySlug(slug: string): Promise<Product> {
    try {
      return await api.get<Product>(`/products/slug/${encodeURIComponent(slug)}`);
    } catch (err) {
      const mock = getMockProductBySlug(slug);
      if (mock) return mock;
      throw err;
    }
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
    const token = getAuthToken();
    return api.post<{ id: string }>(`/products/${productId}/reviews`, payload, token);
  },
  async questions(productId: string, limit = 50): Promise<ProductQuestionItem[]> {
    try {
      return await api.get<ProductQuestionItem[]>(`/products/${productId}/questions?limit=${limit}`);
    } catch {
      return [];
    }
  },
  createQuestion(productId: string, question: string) {
    const token = getAuthToken();
    return api.post<{ id: string }>(`/products/${productId}/questions`, { question }, token);
  },
  createAnswer(productId: string, questionId: string, answer: string) {
    const token = getAuthToken();
    return api.post<{ id: string }>(
      `/products/${productId}/questions/${questionId}/answers`,
      { answer },
      token
    );
  },
};

export const categoriesApi = {
  tree: () => api.get<Category[]>('/categories/tree'),
  roots: () => api.get<Category[]>('/categories/roots'),
  bySlug: (slug: string) =>
    api.get<Category>(`/categories/slug/${encodeURIComponent(slug)}`),
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
  }) => api.post<LoginResponse>('/auth/register', payload),
  profile: () => {
    const token = getAuthToken();
    return api.get<User>('/auth/profile', token);
  },
  updateProfile: (payload: { firstName?: string; lastName?: string; phone?: string; newsletterConsent?: boolean; notifyOrderStatus?: boolean; language?: string }) => {
    const token = getAuthToken();
    return api.patch<User>('/auth/profile', payload, token);
  },
  changePassword: (currentPassword: string, newPassword: string) => {
    const token = getAuthToken();
    return api.post<{ message: string }>('/auth/change-password', {
      currentPassword,
      newPassword,
    }, token);
  },
  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) =>
    api.post<{ message: string }>('/auth/reset-password', { token, newPassword }),
};

export const cartApi = {
  get: () => {
    const token = getAuthToken();
    return api.get<Cart>('/cart', token);
  },
  addItem: (variantId: string, quantity: number) => {
    const token = getAuthToken();
    return api.post<Cart>('/cart/items', { variantId, quantity }, token);
  },
  updateItem: (variantId: string, quantity: number) => {
    const token = getAuthToken();
    return api.put<Cart>(`/cart/items/${variantId}`, { quantity }, token);
  },
  removeItem: (variantId: string) => {
    const token = getAuthToken();
    return api.delete<Cart>(`/cart/items/${variantId}`, token);
  },
  applyCoupon: (code: string) => {
    const token = getAuthToken();
    return api.post<Cart>('/cart/coupon', { code }, token);
  },
  removeCoupon: () => {
    const token = getAuthToken();
    return api.delete<Cart>('/cart/coupon', token);
  },
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
