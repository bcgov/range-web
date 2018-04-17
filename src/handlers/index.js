import moment from 'moment';
import queryParams from 'query-params';
import {
  NOT_PROVIDED,
  REFERENCE_KEY,
  UNEXPECTED_ERROR,
  STATUS404,
  STATUS500,
} from '../constants/strings';

/**
 * Present the date time in a more readable way
 *
 * @param {string} isoFormatDate The stringified date time
 * @returns a formatted string or 'Not provided'
 */
export const formatDate = (isoFormatDate) => {
  if (isoFormatDate) {
    return moment(isoFormatDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('MMMM Do, YYYY');
  }
  return NOT_PROVIDED;
};

/**
 * Save references in local that was sent from the server
 *
 * @param {object} references all the references
 * @returns an object of all the references
 */
export const saveReferencesInLocal = (references) => {
  localStorage.setItem(REFERENCE_KEY, JSON.stringify(references));
};

/**
 * Grab references saved in local that was sent from the server
 *
 * @returns an object of all the references
 */
export const getReferencesFromLocal = () => (
  JSON.parse(localStorage.getItem(REFERENCE_KEY)) || {}
);

/**
 * Parse the network error response to get the error message
 * based on either from the server or the status
 *
 * @param {response.error} err The network error response object
 * @returns an error message string
 */
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

/**
 * Turn a string parameter into an object with the key and value pair
 *
 * @param {string} query The stringified query parameter
 * @returns A plain object
 */
export const parseQuery = (query = '') => (
  queryParams.decode(query.replace(/\?/g, ''))
);

/**
 * Turn a query object into a web link parameter looking string
 *
 * @param {object} query The plain object with the key and value pair
 * @returns A stringified query parameter
 */
export const stringifyQuery = query => (
  queryParams.encode(query)
);

/**
 * Download a pdf file through an a tag using a built-in browser feature
 *
 * @param {response.data} blob The binary array buffer from API
 * @param {object} ref The React reference of an a tag
 * @returns undefined
 */
export const downloadPDFBlob = (blob, ref, fileName) => {
  // It is necessary to create a new blob object with mime-type explicitly set
  // otherwise only Chrome works like it should
  const newBlob = new Blob([blob], { type: 'application/pdf' });

  // IE doesn't allow using a blob object directly as link href
  // instead it is necessary to use msSaveOrOpenBlob
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(newBlob);
    return;
  }

  // For other browsers:
  // Create a link pointing to the ObjectURL containing the blob.
  const data = window.URL.createObjectURL(newBlob);
  const pdfLink = ref;
  pdfLink.href = data;
  pdfLink.download = fileName;

  // Safari thinks _blank anchor are pop ups. We only want to set _blank
  // target if the browser does not support the HTML5 download attribute.
  // This allows you to download files in desktop safari if pop up blocking is enabled.
  if (typeof pdfLink.download === 'undefined') {
    pdfLink.setAttribute('target', '_blank');
  }

  pdfLink.click();

  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(data);
  }, 100);
};
