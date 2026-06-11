import * as actionTypes from '../constants/actionTypes';

interface PaginatedData {
  perPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
  [key: string]: unknown;
}

export const request = (reducer: string) => ({
  name: reducer,
  type: actionTypes.REQUEST,
});

export const success = (reducer: string, data: unknown) => ({
  name: reducer,
  type: actionTypes.SUCCESS,
  data,
});

export const successPagenated = (reducer: string, data: PaginatedData) => ({
  name: reducer,
  type: actionTypes.SUCCESS_PAGINATED,
  data,
  perPage: data.perPage,
  currentPage: data.currentPage,
  totalItems: data.totalItems,
  totalPages: data.totalPages,
});

export const error = (reducer: string, errorResponse: unknown) => ({
  name: reducer,
  type: actionTypes.ERROR,
  errorResponse,
});
