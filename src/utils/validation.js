import { INVALID_GRAZING_SCHEDULE_ENTRY, EMPTY_GRAZING_SCHEDULE_ENTRIES, TOTAL_AUMS_EXCEEDS } from '../constants/strings';
import { ELEMENT_ID } from '../constants/variables';
import { calcCrownTotalAUMs } from './calculation';
/**
 * Validate a grazing schedule entry
 *
 * @param {object} entry the grazing schedule entry object
 * @returns {object | undefined} the error object that has error and message properties
 */
export const handleGrazingScheduleEntryValidation = (e = {}) => {
  if (e.dateIn && e.dateOut && e.pastureId && e.livestockTypeId && e.livestockCount) {
    // valid entry
  } else {
    return {
      error: true,
      message: INVALID_GRAZING_SCHEDULE_ENTRY,
    };
  }
  return undefined;
};

/**
 * Validate a grazing schedule
 *
 * @param {object} schedule the grazing schedule object
 * @param {Array} pastures the array of pastures from the plan
 * @param {Array} livestockTypes the array of live stock types
 * @param {Array} usages the array of usages from the agreement
 * @returns {Array} An array of errors
 */
export const handleGrazingScheduleValidation = (schedule = {}, pastures = [], livestockTypes = [], usages = []) => {
  const { year, grazingScheduleEntries: gse } = schedule;
  const grazingScheduleEntries = gse || [];
  const yearUsage = usages.find(u => u.year === year);
  const authorizedAUMs = yearUsage && yearUsage.authorizedAum; 
  const crownTotalAUMs = calcCrownTotalAUMs(grazingScheduleEntries, pastures, livestockTypes);

  const elementId = ELEMENT_ID.GRAZING_SCHEDULE;
  const errors = [];

  if (grazingScheduleEntries.length === 0) {
    errors.push({
      error: true,
      message: EMPTY_GRAZING_SCHEDULE_ENTRIES,
      elementId,
    });
  }

  grazingScheduleEntries.map((entry) => {
    const result = handleGrazingScheduleEntryValidation(entry);
    if (result) {
      errors.push({ ...result, elementId });
    }
  });

  if (crownTotalAUMs > authorizedAUMs) {
    errors.push({
      error: true,
      message: TOTAL_AUMS_EXCEEDS,
      elementId,
    });
  }
  return errors;
};

/**
 * Validate a range use plan
 *
 * @param {Object} plan the range use plan object
 * @param {Array} livestockTypes the array of live stock types
 * @param {Array} usages the array of usages from the agreement
 * @returns {Array} An array of errors
 */
export const handleRupValidation = (plan = {}, livestockTypes = [], usages = []) => {
  const grazingSchedules = plan.grazingSchedules || [];
  const pastures = plan.pastures || [];

  let errors = [];
  grazingSchedules.forEach((schedule) => {
    errors = [...errors, ...handleGrazingScheduleValidation(schedule, pastures, livestockTypes, usages)];
  });
  return errors;
};
