import moment from 'moment';
import { DATE_FORMAT } from '../constants/variables';
import { NOT_PROVIDED } from '../constants/strings';

/**
 * Present the date time in a more readable way
 *
 * @param {string | Date} isoFormatDate The stringified date time
 * @param {boolean} isYearIncluded The boolean to specify whether the year is needed
 * @returns {string} a formatted string or 'Not provided'
 */
export const formatDateFromServer = (isoFormatDate, isYearIncluded = true) => {
  if (isoFormatDate) {
    if (isYearIncluded) {
      return moment(isoFormatDate, DATE_FORMAT.SERVER_SIDE).format(DATE_FORMAT.CLIENT_SIDE);
    }
    return moment(isoFormatDate, DATE_FORMAT.SERVER_SIDE).format(DATE_FORMAT.SCHEUDLE_ENTRY);
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
  moment(date).format(DATE_FORMAT.SERVER_SIDE)
);
