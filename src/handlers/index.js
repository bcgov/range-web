import moment from 'moment';
import queryParams from 'query-params';
import {
  NOT_PROVIDED,
  NP,
  UNEXPECTED_ERROR,
  STATUS404,
  STATUS500,
} from '../constants/strings';
import {
  REFERENCE_KEY,
  SERVER_SIDE_DATE_FORMAT,
  CLIENT_SIDE_DATE_FORMAT,
  ADMINISTRATOR,
  AGREEMENT_HOLDER,
  DRAFT,
  COMPLETED,
  CHANGE_REQUESTED,
  PENDING,
  CREATED,
} from '../constants/variables';

/**
 * Save data in local storage
 *
 * @param {string} key
 * @param {object} data
 * @returns undefined
 */
export const saveDataInLocal = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));

  // const encode = window.btoa(JSON.stringify(data));
  // localStorage.setItem(key, encode);
};

/**
 * Get data that was saved in local storage
 *
 * @param {string} key
 * @returns {object} the data object
 */
export const getDataFromLocal = (key) => {
  return JSON.parse(localStorage.getItem(key));

  // const localData = localStorage.getItem(key);
  // let decode = null;
  // try {
  //   decode = localData && window.atob(localData);
  // } catch (err) {
  //   console.log(err);
  // }
  // return JSON.parse(decode);
};

/**
 * Check the user if he or she is an admin
 *
 * @param {object} user the user object from authentication
 * @returns {boolean}
 */
export const isUserAdmin = (user = {}) => (
  user.roles && user.roles.includes(ADMINISTRATOR)
);

/**
 * Check the user if he or she is an agreement holder
 *
 * @param {object} user the user object from authentication
 * @returns {boolean}
 */
export const isUserAgreementHolder = (user = {}) => (
  user.roles && user.roles.includes(AGREEMENT_HOLDER)
);

/**
 * check the range use plan for a certain status
 *
 * @param {object} status the status of the range use plan
 * @returns {boolean}
 */
export const isRupCreated = (status = {}) => (
  status.name === CREATED
);
export const isRupInDraftByAH = (status = {}) => (
  status.name === DRAFT
);
export const isRupComplete = (status = {}) => (
  status.name === COMPLETED
);
export const isRupChangedRequested = (status = {}) => (
  status.name === CHANGE_REQUESTED
);
export const isRupPending = (status = {}) => (
  status.name === PENDING
);

/**
 * Present the date time in a more readable way
 *
 * @param {string | Date} isoFormatDate The stringified date time
 * @returns {string} a formatted string or 'Not provided'
 */
export const formatDateFromServer = (isoFormatDate) => {
  if (isoFormatDate) {
    return moment(isoFormatDate, SERVER_SIDE_DATE_FORMAT).format(CLIENT_SIDE_DATE_FORMAT);
  }
  return NOT_PROVIDED;
};

/**
 * Format a Date instance to server side date format
 *
 * @param {Date} date The Date instance created by Pikaday
 * @returns {string} a formatted string
 */
export const formatDateFromUTC = date => (
  moment(date).format(SERVER_SIDE_DATE_FORMAT)
);

/**
 * Present user friendly string when getting null or undefined value
 *
 * @param {string} value
 * @param {boolean} fullText default is true
 * @returns {string} the value or 'Not provided' or 'N/P'
 */
export const presentNullValue = (value, fullText = true) => {
  if (value || value === 0) {
    return value;
  }
  return fullText ? NOT_PROVIDED : NP;
};

/**
 * Present user friendly string when getting null or undefined value
 *
 * @param {string | Date} first the string in the class Date form
 * @param {string | Date} second the string in the class Date form
 * @param {bool} isUserFriendly
 * @returns {number | string} the number of days or 'N/P'
 */
export const calcDateDiff = (first, second, isUserFriendly) => {
  if (first && second) {
    return moment(first).diff(moment(second), 'days');
  }
  return isUserFriendly ? NP : 0;
};

/**
 *
 * @param {number} numberOfAnimals
 * @param {number} totalDays
 * @param {number} auFactor parameter provided from the livestock type
 * @returns {float} the total AUMs
 */
export const calcTotalAUMs = (numberOfAnimals = 0, totalDays, auFactor = 0) => (
  ((numberOfAnimals * totalDays * auFactor) / 30.44)
);

/**
 *
 * @param {number} totalAUMs
 * @param {float} pasturePldPercent
 * @returns {float} the pld AUMs
 */
export const calcPldAUMs = (totalAUMs, pasturePldPercent = 0) => (
  totalAUMs * pasturePldPercent
);

/**
 *
 * @param {number} totalAUMs
 * @param {number} pldAUMs
 * @returns {float} the crown AUMs
 */
export const calcCrownAUMs = (totalAUMs, pldAUMs) => (
  (totalAUMs - pldAUMs)
);

/**
 *
 * @param {Array} entries grazing schedule entries
 * @returns {float} the total crown AUMs
 */
export const calcCrownTotalAUMs = (entries = []) => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  if (entries.length === 0) {
    return 0;
  }
  return entries
    .map((entry) => {
      const {
        pasture,
        livestockType,
        livestockCount,
        dateIn,
        dateOut,
      } = entry || {};
      const days = calcDateDiff(dateOut, dateIn, false);
      const auFactor = livestockType && livestockType.auFactor;
      const totalAUMs = calcTotalAUMs(livestockCount, days, auFactor);
      const pldAUMs = calcPldAUMs(totalAUMs, pasture && pasture.pldPercent);
      const crownAUMs = calcCrownAUMs(totalAUMs, pldAUMs);
      return crownAUMs;
    })
    .reduce(reducer);
};
/**
 * Save references in local that was sent from the server
 *
 * @param {object} references all the references
 * @returns {null}
 */
export const saveReferencesInLocal = (references) => {
  saveDataInLocal(REFERENCE_KEY, references);
};

/**
 * Grab references saved in local that was sent from the server
 *
 * @returns an object of all the references
 */
export const getReferencesFromLocal = () => (
  getDataFromLocal(REFERENCE_KEY) || {}
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

const round = (number, precision) => {
  const shift = (number, precision) => {
    const numArray = ('' + number).split('e');
    return +(numArray[0] + 'e' + (numArray[1] ? (+numArray[1] + precision) : precision));
  };
  return shift(Math.round(shift(number, +precision)), -precision);
};

/**
 * Round the float to 1 decimal
 *
 * @param {float} number
 * @returns the rounded float number
 */
export const roundTo1Decimal = number => (
  round(number, 1)
);
