import { cache } from 'react';
import { api } from '../api-client';
import type { CmsBlock } from '@/types/api';

/**
 * Fetch active CMS blocks for a placement (e.g. home, global_top).
 * Cached for the request (server components).
 */
export const getBlocksByPlacement = cache(async (placement: string): Promise<CmsBlock[]> => {
  try {
    const blocks = await api.get<CmsBlock[]>(`/cms/blocks?placement=${encodeURIComponent(placement)}`);
    return Array.isArray(blocks) ? blocks : [];
  } catch {
    return [];
  }
});
