import moment from 'moment';
import { DATE_FORMAT } from '../../constants/variables';
import { NOT_PROVIDED } from '../../constants/strings';

/**
 * Present the date time in a more readable way
 *
 * @param isoFormatDate The stringified date time
 * @param isYearIncluded The boolean to specify whether the year is needed
 * @returns a formatted string or 'Not provided'
 */
export const formatDateFromServer = (
  isoFormatDate: string | Date | null | undefined,
  isYearIncluded = true,
  notProvided: string = NOT_PROVIDED,
): string => {
  if (isoFormatDate) {
    const m = moment(isoFormatDate);

    if (isYearIncluded) {
      return m.format(DATE_FORMAT.CLIENT_SIDE);
    }

    return m.format(DATE_FORMAT.CLIENT_SIDE_WITHOUT_YEAR);
  }

  return notProvided;
};

/**
 * @param date The Date instance
 * @returns a formatted string
 */
export const formatDateToNow = (date: string | Date | null | undefined): string => {
  if (!date) return NOT_PROVIDED;

  const fromNow = moment(date).fromNow();
  const absolute = moment(date, DATE_FORMAT.SERVER_SIDE).format(DATE_FORMAT.CLIENT_SIDE_WITH_HOURS);

  return `${fromNow}, ${absolute}`;
};
