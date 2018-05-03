import {
  SUCCESS,
  REQUEST,
  SUCCESS_PAGINATED,
  ERROR,
  DATA_CHANGED,
} from '../constants/actionTypes';

export const success = (reducer, data) => (
  {
    name: reducer,
    type: SUCCESS,
    data,
  }
);

export const request = reducer => (
  {
    name: reducer,
    type: REQUEST,
  }
);

export const successPaginated = (reducer, data, currentPage, totalPages) => (
  {
    name: reducer,
    type: SUCCESS_PAGINATED,
    data,
    currentPage,
    totalPages,
  }
);

export const error = (reducer, error) => (
  {
    name: reducer,
    type: ERROR,
    error,
  }
);

export const dataChanged = (reducer, data) => (
  {
    name: reducer,
    type: DATA_CHANGED,
    data,
  }
);