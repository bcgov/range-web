import { REQUEST, SUCCESS, ERROR, SUCCESS_PAGINATED } from '../constants/actionTypes';
import { NetworkState, PaginationMeta } from '../types';

const initialState: NetworkState = {
  isFetching: false,
  errorOccured: false,
  errorResponse: null,
  success: null,
  pagination: {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  },
};

interface NetworkAction {
  type: string;
  name?: string;
  data?: unknown;
  errorResponse?: unknown;
  perPage?: number;
  currentPage?: number;
  totalItems?: number;
  totalPages?: number;
}

const networkReducer = (state: NetworkState = initialState, action: NetworkAction): NetworkState => {
  switch (action.type) {
    case REQUEST:
      return {
        ...state,
        isFetching: true,
        errorOccured: false,
        success: null,
      };
    case SUCCESS:
      return {
        ...state,
        isFetching: false,
        errorOccured: false,
        success: action.data ?? null,
      };
    case ERROR:
      return {
        ...state,
        isFetching: false,
        errorOccured: true,
        errorResponse: action.errorResponse ?? null,
        success: null,
      };
    case SUCCESS_PAGINATED:
      return {
        ...state,
        isFetching: false,
        errorOccured: false,
        success: action.data ?? null,
        pagination: {
          perPage: action.perPage ?? 10,
          currentPage: action.currentPage ?? 1,
          totalItems: action.totalItems ?? 0,
          totalPages: action.totalPages ?? 1,
        },
      };
    default:
      return state;
  }
};

export default networkReducer;

// Private selectors
export const getIsFetching = (state: NetworkState): boolean => state.isFetching;
export const getPagination = (state: NetworkState): PaginationMeta => state.pagination;
export const getErrorOccured = (state: NetworkState): boolean => state.errorOccured;
export const getErrorResponse = (state: NetworkState): unknown => state.errorResponse;
export const getData = (state: NetworkState): unknown => state.success;
