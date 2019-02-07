import moment from 'moment';
import { NOT_PROVIDED } from '../../constants/strings';

export const getRangeReadinessMonthAndDate = (month, day) => {
  let readinessMonthAndDate;
  if (month && day) {
    const currYear = new Date().getFullYear();
    readinessMonthAndDate = moment(`${currYear} ${month} ${day}`).format('MMMM D');
  }
  return readinessMonthAndDate;
};

export const getMonitoringAreaPurposes = (purposes, otherPurpose) => {
  if (!purposes || !purposes.length) {
    return NOT_PROVIDED;
  }
  const purposeNames = purposes.map(purp => purp.purposeType && purp.purposeType.name);
  if (otherPurpose) {
    purposeNames.push(otherPurpose);
  }

  const { length } = purposeNames;
  switch (length) {
    case 0:
      return NOT_PROVIDED;
    case 1:
    case 2:
      return purposeNames.join(' and ');
    default:
      return `${purposeNames.slice(0, length - 1).join(', ')}, and ${purposeNames[length - 1]}`;
  }
};
