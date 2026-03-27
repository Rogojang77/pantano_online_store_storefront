/**
 * Account-area API: orders, addresses, invoices, saved carts.
 * Uses cookie-based session auth where required.
 */

import type { PaginatedResult, Order, Address, Invoice, SavedCart } from '@/types/api';
import { api } from '@/lib/api-client';
import { siteConfig } from '@/config/site';

type OrdersMyParams = { page?: number; limit?: number; status?: string; from?: string; to?: string; search?: string };
type InvoicesListParams = { page?: number; limit?: number };

export type CreateAddressPayload = {
  type: 'SHIPPING' | 'BILLING';
  label?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county?: string;
  postalCode: string;
  country?: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
};

export type CreateOrderPayload = {
  type: 'RESERVATION' | 'DELIVERY';
  items: { variantId: string; quantity: number }[];
  shippingAddressId?: string;
  billingAddressId?: string;
  accountType?: 'INDIVIDUAL' | 'COMPANY';
  companyName?: string;
  companyVatId?: string;
  companyTradeRegister?: string;
  billingSameAsShipping?: boolean;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  county?: string;
  postalCode?: string;
  country?: string;
  billingAddressLine1?: string;
  billingAddressLine2?: string;
  billingCity?: string;
  billingCounty?: string;
  billingPostalCode?: string;
  billingCountry?: string;
  notes?: string;
  promotionId?: string;
  discountAmount?: number;
  guestEmail?: string;
  guestFirstName?: string;
  guestLastName?: string;
  guestPhone?: string;
  deliveryMethod?: string;
  deliveryFee?: number;
  paymentMethod?: string;
  newsletterSubscribe?: boolean;
};

export const ordersApi = {
  my: (params?: OrdersMyParams) => {
    const search = new URLSearchParams();
    if (params?.page != null) search.set('page', String(params.page));
    if (params?.limit != null) search.set('limit', String(params.limit));
    if (params?.status) search.set('status', params.status);
    if (params?.from) search.set('from', params.from);
    if (params?.to) search.set('to', params.to);
    if (params?.search) search.set('search', params.search);
    const q = search.toString();
    return api.get<PaginatedResult<Order>>(q ? `/orders/my?${q}` : '/orders/my');
  },
  byId: (id: string, guestEmail?: string) => {
    const url = guestEmail
      ? `/orders/${id}?guestEmail=${encodeURIComponent(guestEmail)}`
      : `/orders/${id}`;
    return api.get<Order>(url);
  },
  create: (payload: CreateOrderPayload) => api.post<Order>('/orders', payload),
  reorder: (orderId: string) => api.post<unknown>(`/orders/${orderId}/reorder`),
};

export const addressesApi = {
  list: () => api.get<Address[]>('/addresses'),
  byId: (id: string) => api.get<Address>(`/addresses/${id}`),
  create: (data: CreateAddressPayload) => api.post<Address>('/addresses', data),
  update: (id: string, data: Partial<CreateAddressPayload>) => api.patch<Address>(`/addresses/${id}`, data),
  setDefaultShipping: (id: string) => api.put<Address>(`/addresses/${id}/default-shipping`),
  setDefaultBilling: (id: string) => api.put<Address>(`/addresses/${id}/default-billing`),
  delete: (id: string) => api.delete<unknown>(`/addresses/${id}`),
};

export const invoicesApi = {
  list: (params?: InvoicesListParams) => {
    const search = new URLSearchParams();
    if (params?.page != null) search.set('page', String(params.page));
    if (params?.limit != null) search.set('limit', String(params.limit));
    const q = search.toString();
    return api.get<PaginatedResult<Invoice>>(q ? `/invoices?${q}` : '/invoices');
  },
  byId: (id: string) => api.get<Invoice>(`/invoices/${id}`),
  /** Fetch PDF as blob (use with createObjectURL or trigger download) */
  download: async (id: string): Promise<Blob> => {
    const base = siteConfig.apiUrl;
    const url = `${base}/invoices/${id}/download`;
    const res = await fetch(url, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Download failed');
    return res.blob();
  },
};

export interface ReturnRequest {
  id: string;
  orderId: string;
  userId: string;
  status: string;
  reason?: string | null;
  notes?: string | null;
  createdAt: string;
  order?: { orderNumber: string; total?: string; createdAt?: string };
}

export const returnsApi = {
  list: () => api.get<ReturnRequest[]>('/returns'),
  byId: (id: string) => api.get<ReturnRequest>(`/returns/${id}`),
  create: (data: { orderId: string; reason?: string; notes?: string }) => api.post<ReturnRequest>('/returns', data),
};

export interface WishlistItemResponse {
  id: string;
  variantId: string;
  createdAt: string;
  variant?: { id: string; product?: { id: string; name: string; slug: string } };
}

export const wishlistApi = {
  list: () => api.get<WishlistItemResponse[]>('/wishlist'),
  add: (variantId: string) => api.post<WishlistItemResponse>('/wishlist/items', { variantId }),
  remove: (variantId: string) => api.delete<{ removed: boolean }>(`/wishlist/items/${variantId}`),
  sync: (variantIds: string[]) => api.post<WishlistItemResponse[]>('/wishlist/sync', { variantIds }),
};

export const savedCartsApi = {
  list: () => api.get<SavedCart[]>('/saved-carts'),
  byId: (id: string) => api.get<SavedCart>(`/saved-carts/${id}`),
  create: (data: { name: string; description?: string }) => api.post<SavedCart>('/saved-carts', data),
  update: (id: string, data: { name?: string; description?: string }) => api.patch<SavedCart>(`/saved-carts/${id}`, data),
  loadIntoCart: (id: string) => api.post<unknown>(`/saved-carts/${id}/load`),
  duplicate: (id: string, name?: string) => api.post<SavedCart>(`/saved-carts/${id}/duplicate`, name != null ? { name } : {}),
  delete: (id: string) => api.delete<unknown>(`/saved-carts/${id}`),
};
