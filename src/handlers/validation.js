import { INVALID_GRAZING_SCHEDULE_ENTRY, EMPTY_GRAZING_SCHEDULE_ENTRIES } from '../constants/strings';
import { GRAZING_SCHEDULE_ELEMENT_ID } from '../constants/variables';
/**
 * Validate a grazing schedule entry
 *
 * @param {object} entry the grazing schedule entry object
 * @returns {object | undefined} the error object that has error and message properties
 */
export const validateGrazingScheduleEntry = (e = {}) => {
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
 * @returns {Array} An array of errors
 */
export const validateGrazingSchedule = (schedule = {}) => {
  const grazingScheduleEntries = schedule.grazingScheduleEntries || [];
  const elementId = GRAZING_SCHEDULE_ELEMENT_ID;
  const errors = [];

  if (grazingScheduleEntries.length === 0) {
    errors.push({
      error: true,
      message: EMPTY_GRAZING_SCHEDULE_ENTRIES,
      elementId,
    });
  }
  grazingScheduleEntries.forEach((entry) => {
    const result = validateGrazingScheduleEntry(entry);
    if (result) {
      errors.push({ ...result, elementId });
    }
  });

  return errors;
};

/**
 * Validate a range use plan
 *
 * @param {Object} plan the range use plan object
 * @returns {Array} An array of errors
 */
export const validateRangeUsePlan = (plan = {}) => {
  const grazingSchedules = plan.grazingSchedules || [];
  let errors = [];
  grazingSchedules.forEach((schedule) => {
    errors = [...errors, ...validateGrazingSchedule(schedule)];
  });
  return errors;
};
