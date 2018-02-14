import {
  SUCCESS,
  REQUEST,
  SUCCESS_PAGINATED,
  ERROR
} from '../constants/actionTypes';

export const success = (reducer, data) => {
  return {
    name: reducer,
    type: SUCCESS,
    data,
  }
} 

export const request = (reducer) => {
  return {
    name: reducer,
    type: REQUEST,
  }
}

export const successPaginated = (reducer, data) => {
  return {
    name: reducer,
    type: SUCCESS_PAGINATED,
    data: data.data,
    currentPage: data.current_page,
    totalPages: data.last_page,
  }
}

export const error = (reducer, error) => {
  return {
    name: reducer,
    type: ERROR,
    errorMessage: error,
  }
}

