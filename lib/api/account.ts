/**
 * Account-area API: orders, addresses, invoices, saved carts.
 * All require JWT (getAuthToken).
 */

import type { PaginatedResult, Order, Address, Invoice, SavedCart } from '@/types/api';
import { api, getAuthToken } from '@/lib/api-client';
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
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  county?: string;
  postalCode?: string;
  country?: string;
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
    const token = getAuthToken();
    const search = new URLSearchParams();
    if (params?.page != null) search.set('page', String(params.page));
    if (params?.limit != null) search.set('limit', String(params.limit));
    if (params?.status) search.set('status', params.status);
    if (params?.from) search.set('from', params.from);
    if (params?.to) search.set('to', params.to);
    if (params?.search) search.set('search', params.search);
    const q = search.toString();
    return api.get<PaginatedResult<Order>>(q ? `/orders/my?${q}` : '/orders/my', token);
  },
  byId: (id: string, guestEmail?: string) => {
    const token = getAuthToken();
    const url = guestEmail
      ? `/orders/${id}?guestEmail=${encodeURIComponent(guestEmail)}`
      : `/orders/${id}`;
    return api.get<Order>(url, token);
  },
  create: (payload: CreateOrderPayload) => {
    const token = getAuthToken();
    return api.post<Order>('/orders', payload, token ?? undefined);
  },
  reorder: (orderId: string) => {
    const token = getAuthToken();
    return api.post<unknown>(`/orders/${orderId}/reorder`, undefined, token);
  },
};

export const addressesApi = {
  list: () => {
    const token = getAuthToken();
    return api.get<Address[]>('/addresses', token);
  },
  byId: (id: string) => {
    const token = getAuthToken();
    return api.get<Address>(`/addresses/${id}`, token);
  },
  create: (data: CreateAddressPayload) => {
    const token = getAuthToken();
    return api.post<Address>('/addresses', data, token);
  },
  update: (id: string, data: Partial<CreateAddressPayload>) => {
    const token = getAuthToken();
    return api.patch<Address>(`/addresses/${id}`, data, token);
  },
  setDefaultShipping: (id: string) => {
    const token = getAuthToken();
    return api.put<Address>(`/addresses/${id}/default-shipping`, undefined, token);
  },
  setDefaultBilling: (id: string) => {
    const token = getAuthToken();
    return api.put<Address>(`/addresses/${id}/default-billing`, undefined, token);
  },
  delete: (id: string) => {
    const token = getAuthToken();
    return api.delete<unknown>(`/addresses/${id}`, token);
  },
};

export const invoicesApi = {
  list: (params?: InvoicesListParams) => {
    const token = getAuthToken();
    const search = new URLSearchParams();
    if (params?.page != null) search.set('page', String(params.page));
    if (params?.limit != null) search.set('limit', String(params.limit));
    const q = search.toString();
    return api.get<PaginatedResult<Invoice>>(q ? `/invoices?${q}` : '/invoices', token);
  },
  byId: (id: string) => {
    const token = getAuthToken();
    return api.get<Invoice>(`/invoices/${id}`, token);
  },
  /** Fetch PDF as blob (use with createObjectURL or trigger download) */
  download: async (id: string): Promise<Blob> => {
    const token = getAuthToken();
    const base = siteConfig.apiUrl;
    const url = `${base}/invoices/${id}/download`;
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
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
  list: () => {
    const token = getAuthToken();
    return api.get<ReturnRequest[]>('/returns', token);
  },
  byId: (id: string) => {
    const token = getAuthToken();
    return api.get<ReturnRequest>(`/returns/${id}`, token);
  },
  create: (data: { orderId: string; reason?: string; notes?: string }) => {
    const token = getAuthToken();
    return api.post<ReturnRequest>('/returns', data, token);
  },
};

export interface WishlistItemResponse {
  id: string;
  variantId: string;
  createdAt: string;
  variant?: { id: string; product?: { id: string; name: string; slug: string } };
}

export const wishlistApi = {
  list: () => {
    const token = getAuthToken();
    return api.get<WishlistItemResponse[]>('/wishlist', token);
  },
  add: (variantId: string) => {
    const token = getAuthToken();
    return api.post<WishlistItemResponse>('/wishlist/items', { variantId }, token);
  },
  remove: (variantId: string) => {
    const token = getAuthToken();
    return api.delete<{ removed: boolean }>(`/wishlist/items/${variantId}`, token);
  },
  sync: (variantIds: string[]) => {
    const token = getAuthToken();
    return api.post<WishlistItemResponse[]>('/wishlist/sync', { variantIds }, token);
  },
};

export const savedCartsApi = {
  list: () => {
    const token = getAuthToken();
    return api.get<SavedCart[]>('/saved-carts', token);
  },
  byId: (id: string) => {
    const token = getAuthToken();
    return api.get<SavedCart>(`/saved-carts/${id}`, token);
  },
  create: (data: { name: string; description?: string }) => {
    const token = getAuthToken();
    return api.post<SavedCart>('/saved-carts', data, token);
  },
  update: (id: string, data: { name?: string; description?: string }) => {
    const token = getAuthToken();
    return api.patch<SavedCart>(`/saved-carts/${id}`, data, token);
  },
  loadIntoCart: (id: string) => {
    const token = getAuthToken();
    return api.post<unknown>(`/saved-carts/${id}/load`, undefined, token);
  },
  duplicate: (id: string, name?: string) => {
    const token = getAuthToken();
    return api.post<SavedCart>(`/saved-carts/${id}/duplicate`, name != null ? { name } : {}, token);
  },
  delete: (id: string) => {
    const token = getAuthToken();
    return api.delete<unknown>(`/saved-carts/${id}`, token);
  },
};
