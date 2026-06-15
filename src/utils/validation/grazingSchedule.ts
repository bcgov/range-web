import { getCurrentYear } from '..';
import {
  INVALID_SCHEDULE_ENTRY,
  EMPTY_SCHEDULE_ENTRIES,
  TOTAL_AUMS_EXCEEDS,
  SCHEDULE_ENTRY_DATE_OUT_OF_RANGE,
} from '../../constants/strings';
import { ELEMENT_ID } from '../../constants/variables';
import { calcCrownTotalAUMs } from '../calculation';

interface ValidationError {
  error: boolean;
  message: string;
  elementId?: string;
}

interface GrazingScheduleEntryLike {
  dateIn?: string | null;
  dateOut?: string | null;
  pastureId?: number | null;
  livestockTypeId?: number | null;
  livestockCount?: number | string | null;
}

interface UsageLike {
  year: number;
  totalAnnualUse: number;
}

interface PastureLike {
  id: number;
  pldPercent?: number | null;
}

interface LivestockTypeLike {
  id: number;
  auFactor?: number;
}

interface ScheduleLike {
  year?: number;
  scheduleEntries?: GrazingScheduleEntryLike[];
}

/**
 * Validate a grazing schedule entry
 *
 * @param e the grazing schedule entry object
 * @param scheduleYear the year of the schedule
 * @returns the error object or undefined
 */
export const handleGrazingScheduleEntryValidation = (
  e: GrazingScheduleEntryLike = {},
  scheduleYear?: number,
): ValidationError | undefined => {
  if (e.dateIn && e.dateOut && e.pastureId && e.livestockTypeId && !isNaN(parseFloat(String(e.livestockCount)))) {
    const dateInYear = new Date(e.dateIn).getFullYear();
    const dateOutYear = new Date(e.dateOut).getFullYear();
    if (dateInYear !== scheduleYear || dateOutYear !== scheduleYear) {
      return {
        error: true,
        message: SCHEDULE_ENTRY_DATE_OUT_OF_RANGE,
      };
    }
  } else {
    return {
      error: true,
      message: INVALID_SCHEDULE_ENTRY,
    };
  }
  return undefined;
};

/**
 * Validate a grazing schedule
 *
 * @param schedule the grazing schedule object
 * @param pastures the array of pastures from the plan
 * @param livestockTypes the array of live stock types
 * @param usage the array of usage from the agreement
 * @param isAgreementHolder is the current user an agreement holder?
 * @returns An array of errors
 */
export const handleGrazingScheduleValidation = (
  schedule: ScheduleLike = {},
  pastures: PastureLike[] = [],
  livestockTypes: LivestockTypeLike[] = [],
  usage: UsageLike[] = [],
  isAgreementHolder = false,
): ValidationError[] => {
  const { year, scheduleEntries: gse } = schedule;
  const scheduleEntries = gse || [];
  const yearUsage = usage.find((u) => u.year === year);
  const totalAnnualUse = yearUsage && yearUsage.totalAnnualUse;
  const crownTotalAUMs = calcCrownTotalAUMs(scheduleEntries as any, pastures as any, livestockTypes as any);

  const elementId = ELEMENT_ID.SCHEDULE;
  const errors: ValidationError[] = [];

  if (scheduleEntries.length === 0) {
    if (isAgreementHolder) {
      errors.push({
        error: true,
        message: EMPTY_SCHEDULE_ENTRIES,
        elementId,
      });
    }
  }

  scheduleEntries.map((entry) => {
    const result = handleGrazingScheduleEntryValidation(entry, year);
    if (result) {
      errors.push({ ...result, elementId });
    }
    return undefined;
  });

  if (crownTotalAUMs > totalAnnualUse! && year! >= getCurrentYear()) {
    errors.push({
      error: true,
      message: TOTAL_AUMS_EXCEEDS,
      elementId,
    });
  }
  return errors;
};
