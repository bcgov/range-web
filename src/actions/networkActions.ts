import * as actionTypes from '../constants/actionTypes';

export const request = (reducer: string) => ({
  name: reducer,
  type: actionTypes.REQUEST,
});

export const success = (reducer: string, data: unknown) => ({
  name: reducer,
  type: actionTypes.SUCCESS,
  data,
});

export const error = (reducer: string, errorResponse: unknown) => ({
  name: reducer,
  type: actionTypes.ERROR,
  errorResponse,
});
