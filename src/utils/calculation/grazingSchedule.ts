import moment from 'moment';
import { NP } from '../../constants/strings';
import { round } from '../calculation';

/**
 * Present user friendly string when getting null or undefined value
 *
 * @param first the string in the class Date form
 * @param second the string in the class Date form
 * @param isUserFriendly
 * @returns the number of days or 'N/P'
 */
export const calcDateDiff = (
  first: string | Date | null | undefined,
  second: string | Date | null | undefined,
  isUserFriendly: boolean,
): number | string => {
  if (first && second) {
    return moment(first).diff(moment(second), 'days') + 1;
  }

  return isUserFriendly ? NP : 0;
};

/**
 * @param numberOfAnimals
 * @param totalDays
 * @param auFactor parameter provided from the livestock type
 * @returns the total AUMs
 */
export const calcTotalAUMs = (numberOfAnimals = 0, totalDays: number, auFactor = 0): number =>
  (numberOfAnimals * totalDays * auFactor) / 30.44;

/**
 * @param totalAUMs
 * @param pasturePldPercent
 * @returns the pld AUMs
 */
export const calcPldAUMs = (totalAUMs: number, pasturePldPercent = 0): number => totalAUMs * pasturePldPercent;

/**
 * @param totalAUMs
 * @param pldAUMs
 * @returns the crown AUMs
 */
export const calcCrownAUMs = (totalAUMs: number, pldAUMs: number): number => totalAUMs - pldAUMs;

interface GrazingScheduleEntry {
  pastureId?: number | null;
  livestockTypeId?: number | null;
  livestockCount?: number | null;
  dateIn?: string | null;
  dateOut?: string | null;
}

interface PastureWithPld {
  id: number;
  pldPercent?: number | null;
}

interface LivestockType {
  id: number;
  auFactor?: number;
}

/**
 * @param entries grazing schedule entries
 * @param pastures the array of pastures from the plan
 * @param livestockTypes the array of live stock types
 * @returns the total crown AUMs
 */
export const calcCrownTotalAUMs = (
  entries: GrazingScheduleEntry[] = [],
  pastures: PastureWithPld[] = [],
  livestockTypes: LivestockType[] = [],
): number => {
  const reducer = (accumulator: number, currentValue: number): number => accumulator + currentValue;
  if (entries.length === 0) {
    return 0;
  }

  const sumAUM = entries
    .map((entry) => {
      const { pastureId, livestockTypeId, livestockCount, dateIn, dateOut } = entry || {};
      const days = calcDateDiff(dateOut, dateIn, false) as number;
      const pasture = pastures.find((p) => p.id === pastureId);
      const livestockType = livestockTypes.find((lt) => lt.id === livestockTypeId);
      const auFactor = livestockType && livestockType.auFactor;
      const totalAUMs = calcTotalAUMs(livestockCount || 0, days, auFactor);
      const pldAUMs = round(calcPldAUMs(totalAUMs, pasture && pasture.pldPercent || 0), 0);
      const crownAUMDecimal = calcCrownAUMs(totalAUMs, pldAUMs);
      return crownAUMDecimal > 0 && crownAUMDecimal < 1 ? 1 : round(crownAUMDecimal, 0);
    })
    .reduce(reducer, 0);
  return sumAUM > 0 && sumAUM < 1 ? 1 : sumAUM;
};
