import * as actionTypes from '../constants/actionTypes';

export const request = reducer => (
  {
    name: reducer,
    type: actionTypes.REQUEST,
  }
);

export const success = reducer => (
  {
    name: reducer,
    type: actionTypes.SUCCESS,
  }
);

export const successPagenated = (reducer, response) => (
  {
    name: reducer,
    type: actionTypes.SUCCESS_PAGINATED,
    perPage: response.perPage,
    currentPage: response.currentPage,
    totalItems: response.totalItems,
    totalPages: response.totalPages,
  }
);

export const error = (reducer, errorMessage) => (
  {
    name: reducer,
    type: actionTypes.ERROR,
    errorMessage,
  }
);
