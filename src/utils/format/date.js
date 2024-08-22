import moment from 'moment';
import { DATE_FORMAT } from '../../constants/variables';
import { NOT_PROVIDED } from '../../constants/strings';

/**
 * Present the date time in a more readable way
 *
 * @param {string | Date} isoFormatDate The stringified date time
 * @param {boolean} isYearIncluded The boolean to specify whether the year is needed
 * @returns {string} a formatted string or 'Not provided'
 */
export const formatDateFromServer = (isoFormatDate, isYearIncluded = true, notProvided = NOT_PROVIDED) => {
  if (isoFormatDate) {
    const m = moment(isoFormatDate, DATE_FORMAT.SERVER_SIDE);

    if (isYearIncluded) {
      return m.format(DATE_FORMAT.CLIENT_SIDE);
    }

    return m.format(DATE_FORMAT.CLIENT_SIDE_WITHOUT_YEAR);
  }

  return notProvided;
};

/**
 * Format a Date instance to server side date format
 *
 * @param {Date} date The Date instance created by Pikaday
 * @returns {string} a formatted string
 */
export const formatDateFromUTC = (date) => moment(date).format(DATE_FORMAT.SERVER_SIDE);

/**
 *
 *
 * @param {Date} date The Date instance
 * @returns {string} a formatted string
 */
export const formatDateToNow = (date) => {
  if (!date) return NOT_PROVIDED;

  const fromNow = moment(date).fromNow();
  const absolute = moment(date, DATE_FORMAT.SERVER_SIDE).format(DATE_FORMAT.CLIENT_SIDE_WITH_HOURS);

  return `${fromNow}, ${absolute}`;
};

/**
 * Parse a Date instance to get the month and day
 *
 * @param {Date} date The Date instance created by Pikaday
 * @returns {object}
 */
export const parseMonthAndDay = (date) => {
  return {
    month: moment(date).month() + 1,
    day: moment(date).date(),
  };
};

export const createDateWithMoment = (day, month, year) => {
  if (month && day) {
    return moment()
      .set('year', year || new Date().getFullYear())
      .set('month', month - 1)
      .set('date', day)
      .toDate();
  }

  return null;
};
