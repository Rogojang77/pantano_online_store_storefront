import { cache } from 'react';
import { api } from '../api-client';
import type { ContactConfig } from '@/config/contact';
import { contactConfig } from '@/config/contact';

/**
 * Fetch contact info from the API (admin-configured). Falls back to static config on error.
 * Cached for the request (server components).
 */
export const getContactInfo = cache(async (): Promise<ContactConfig> => {
  try {
    const data = await api.get<ContactConfig>('/contact');
    if (data && typeof data === 'object') {
      return {
        pageTitle: data.pageTitle ?? contactConfig.pageTitle,
        imageUrl: data.imageUrl ?? contactConfig.imageUrl,
        address: {
          street: data.address?.street ?? contactConfig.address.street,
          city: data.address?.city ?? contactConfig.address.city,
          postalCode: data.address?.postalCode ?? contactConfig.address.postalCode,
        },
        phone: data.phone ?? contactConfig.phone,
        email: data.email ?? contactConfig.email,
        openingHours: {
          headline: data.openingHours?.headline ?? contactConfig.openingHours.headline,
          rows: Array.isArray(data.openingHours?.rows) && data.openingHours.rows.length > 0
            ? data.openingHours.rows
            : contactConfig.openingHours.rows,
        },
        openingHoursSummary: data.openingHoursSummary ?? contactConfig.openingHoursSummary,
        mapUrl: data.mapUrl ?? contactConfig.mapUrl,
        latitude: data.latitude ?? contactConfig.latitude,
        longitude: data.longitude ?? contactConfig.longitude,
      };
    }
  } catch {
    // fallback to static config
  }
  return contactConfig;
});
