import * as actionTypes from '../constants/actionTypes';

export const request = reducer => (
  {
    name: reducer,
    type: actionTypes.REQUEST,
  }
);

export const success = (reducer, data) => (
  {
    name: reducer,
    type: actionTypes.SUCCESS,
    data,
  }
);

export const successPagenated = (reducer, data) => (
  {
    name: reducer,
    type: actionTypes.SUCCESS_PAGINATED,
    data,
    perPage: data.perPage,
    currentPage: data.currentPage,
    totalItems: data.totalItems,
    totalPages: data.totalPages,
  }
);

export const error = (reducer, errorMessage) => (
  {
    name: reducer,
    type: actionTypes.ERROR,
    errorMessage,
  }
);
