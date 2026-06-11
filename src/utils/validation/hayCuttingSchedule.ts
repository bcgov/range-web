import { getCurrentYear } from '..';
import {
  INVALID_SCHEDULE_ENTRY,
  EMPTY_SCHEDULE_ENTRIES,
  TOTAL_TONNES_EXCEEDS,
  SCHEDULE_ENTRY_DATE_OUT_OF_RANGE,
} from '../../constants/strings';
import { ELEMENT_ID } from '../../constants/variables';
import { calcTotalTonnes } from '../calculation/hayCuttingSchedule';

interface ValidationError {
  error: boolean;
  message: string;
  elementId?: string;
}

interface HayCuttingEntryLike {
  dateIn?: string | null;
  dateOut?: string | null;
  pastureId?: number | null;
  stubbleHeight?: number | string | null;
  tonnes?: number | string | null;
}

interface UsageLike {
  year: number;
  authorizedAum: number;
}

interface ScheduleLike {
  year?: number;
  scheduleEntries?: HayCuttingEntryLike[];
}

/**
 * Validate a hay cutting schedule entry
 *
 * @param e the hay cutting schedule entry object
 * @param scheduleYear the year of the schedule
 * @returns the error object or undefined
 */
export const handleHayCuttingScheduleEntryValidation = (
  e: HayCuttingEntryLike = {},
  scheduleYear?: number,
): ValidationError | undefined => {
  // For hay cutting schedules, we need: dateIn, dateOut, pastureId, stubbleHeight, and tonnes
  if (
    e.dateIn &&
    e.dateOut &&
    e.pastureId &&
    !isNaN(parseFloat(String(e.stubbleHeight))) &&
    e.stubbleHeight !== null &&
    e.stubbleHeight !== undefined &&
    e.stubbleHeight !== '' &&
    !isNaN(parseFloat(String(e.tonnes))) &&
    e.tonnes !== null &&
    e.tonnes !== undefined &&
    e.tonnes !== ''
  ) {
    const entryYear = new Date(e.dateIn).getFullYear();
    if (entryYear !== scheduleYear) {
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
 * Validate a hay cutting schedule
 *
 * @param schedule the hay cutting schedule object
 * @param usage the array of usage from the agreement
 * @param isAgreementHolder is the current user an agreement holder?
 * @returns An array of errors
 */
export const handleHayCuttingScheduleValidation = (
  schedule: ScheduleLike = {},
  usage: UsageLike[] = [],
  isAgreementHolder = false,
): ValidationError[] => {
  const { year, scheduleEntries: hse } = schedule;
  const scheduleEntries = hse || [];
  const yearUsage = usage.find((u) => u.year === year);

  // For hay cutting, we use authorizedAum as the authorized tonnes field
  const authorizedTonnes = yearUsage && yearUsage.authorizedAum;
  const totalTonnes = parseFloat(calcTotalTonnes(scheduleEntries as any)) || 0;

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
    const result = handleHayCuttingScheduleEntryValidation(entry, year);
    if (result) {
      errors.push({ ...result, elementId });
    }
    return undefined;
  });

  if (authorizedTonnes && totalTonnes > authorizedTonnes && year! >= getCurrentYear()) {
    errors.push({
      error: true,
      message: TOTAL_TONNES_EXCEEDS,
      elementId,
    });
  }

  return errors;
};
