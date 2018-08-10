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
export const formatDateFromUTC = date => (
  moment(date).format(DATE_FORMAT.SERVER_SIDE)
);

export const getPastureNames = (pastureIds = [], pasturesMap = {}) => {
  const pastureNames = pastureIds.map((pId) => {
    const pasture = pasturesMap[pId];
    return pasture && pasture.name;
  });
  const { length } = pastureNames;
  switch (length) {
    case 0:
      return NOT_PROVIDED;
    case 1:
    case 2:
      return pastureNames.join(' and ');
    default:
      return `${pastureNames.slice(0, length - 1).join(', ')}, and ${pastureNames[length - 1]}`;
  }
};
