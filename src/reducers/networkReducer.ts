import { REQUEST, SUCCESS, ERROR } from '../constants/actionTypes';
import { NetworkState } from '../types';

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
    default:
      return state;
  }
};

export default networkReducer;

// Private selectors
export const getIsFetching = (state: NetworkState): boolean => state.isFetching;
export const getErrorOccured = (state: NetworkState): boolean => state.errorOccured;
export const getErrorResponse = (state: NetworkState): unknown => state.errorResponse;
