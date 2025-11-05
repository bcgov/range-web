import moment from 'moment';
import { NP } from '../../constants/strings';
import { round } from '../calculation';

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
    return moment(first).diff(moment(second), 'days') + 1;
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
export const calcTotalAUMs = (numberOfAnimals = 0, totalDays, auFactor = 0) =>
  (numberOfAnimals * totalDays * auFactor) / 30.44;

/**
 *
 * @param {number} totalAUMs
 * @param {float} pasturePldPercent
 * @returns {float} the pld AUMs
 */
export const calcPldAUMs = (totalAUMs, pasturePldPercent = 0) => totalAUMs * pasturePldPercent;

/**
 *
 * @param {number} totalAUMs
 * @param {number} pldAUMs
 * @returns {float} the crown AUMs
 */
export const calcCrownAUMs = (totalAUMs, pldAUMs) => totalAUMs - pldAUMs;

/**
 *
 * @param {Array} entries grazing schedule entries
 * @param {Object} pasturesMap the array of pastures from the plan
 * @param {Array} livestockTypes the array of live stock types
 * @returns {float} the total crown AUMs
 */
export const calcCrownTotalAUMs = (entries = [], pastures = [], livestockTypes = []) => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  if (entries.lsength === 0) {
    return 0;
  }

  let sumAUM = entries
    .map((entry) => {
      const { pastureId, livestockTypeId, livestockCount, dateIn, dateOut } = entry || {};
      const days = calcDateDiff(dateOut, dateIn, false);
      const pasture = pastures.find((p) => p.id === pastureId);
      const livestockType = livestockTypes.find((lt) => lt.id === livestockTypeId);
      const auFactor = livestockType && livestockType.auFactor;
      const totalAUMs = calcTotalAUMs(livestockCount, days, auFactor);
      const pldAUMs = round(calcPldAUMs(totalAUMs, pasture && pasture.pldPercent), 1);
      const crownAUMDecimal = calcCrownAUMs(totalAUMs, pldAUMs);
      return crownAUMDecimal > 0 && crownAUMDecimal < 1 ? 1 : round(crownAUMDecimal, 0);
    })
    .reduce(reducer, 0);
  return sumAUM > 0 && sumAUM < 1 ? 1 : sumAUM;
};
