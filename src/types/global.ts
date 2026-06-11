/**
 * Generic network request state — used by the networkReducer pattern.
 */
export interface NetworkState<T = unknown> {
  isFetching: boolean;
  errorOccured: boolean;
  errorResponse: unknown | null;
  success: T | null;
  pagination: PaginationMeta;
}

/**
 * Pagination metadata from API responses.
 */
export interface PaginationMeta {
  perPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Normalized entity map — used for Redux normalized state.
 */
export type EntityMap<T> = Record<string, T>;

/**
 * Toast notification message.
 */
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}
