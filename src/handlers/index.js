import moment from 'moment';
import queryParams from 'query-params';
import {
  NOT_PROVIDED,
  REFERENCE_KEY,
  UNEXPECTED_ERROR,
  STATUS404,
  STATUS500,
} from '../constants/strings';

export const formatDate = (isoFormatDate) => {
  if (isoFormatDate) {
    return moment(isoFormatDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('MMMM Do, YYYY');
  }
  return NOT_PROVIDED;
};

export const saveReferencesInLocal = (references) => {
  localStorage.setItem(REFERENCE_KEY, JSON.stringify(references));
};

export const getReferencesFromLocal = () => (
  JSON.parse(localStorage.getItem(REFERENCE_KEY)) || {}
);

export const getErrorMessage = (err) => {
  let message = UNEXPECTED_ERROR;

  if (err instanceof Object) {
    const res = err.response;
    const { status } = err;

    if (res && res.data && res.data.error) {
      message = res.data.error;
    } else if (status) {
      switch (status) {
        case 404:
          message = STATUS404;
          break;
        case 500:
          message = STATUS500;
          break;
        default:
          break;
      }
    }
  }

  return message;
};

export const parseQuery = (query = '') => (
  queryParams.decode(query.replace(/\?/g, ''))
);

export const stringifyQuery = query => (
  queryParams.encode(query)
);
