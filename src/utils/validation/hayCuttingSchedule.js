import { INVALID_SCHEDULE_ENTRY, EMPTY_SCHEDULE_ENTRIES, TOTAL_TONNES_EXCEEDS } from '../../constants/strings';
import { ELEMENT_ID } from '../../constants/variables';
import { calcTotalTonnes } from '../calculation/hayCuttingSchedule';

/**
 * Validate a hay cutting schedule entry
 *
 * @param {object} entry the hay cutting schedule entry object
 * @returns {object | undefined} the error object that has error and message properties
 */
export const handleHayCuttingScheduleEntryValidation = (e = {}) => {
  // For hay cutting schedules, we need: dateIn, dateOut, pastureId, stubbleHeight, and tonnes
  if (
    e.dateIn &&
    e.dateOut &&
    e.pastureId &&
    !isNaN(parseFloat(e.stubbleHeight)) &&
    e.stubbleHeight !== null &&
    e.stubbleHeight !== undefined &&
    e.stubbleHeight !== '' &&
    !isNaN(parseFloat(e.tonnes)) &&
    e.tonnes !== null &&
    e.tonnes !== undefined &&
    e.tonnes !== ''
  ) {
    // valid entry
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
 * @param {object} schedule the hay cutting schedule object
 * @param {Array} usage the array of usage from the agreement
 * @param {Boolean} isAgreementHolder is the current user an agreement holder?
 * @returns {Array} An array of errors
 */
export const handleHayCuttingScheduleValidation = (schedule = {}, usage = [], isAgreementHolder = false) => {
  const { year, scheduleEntries: hse } = schedule;
  const scheduleEntries = hse || [];
  const yearUsage = usage.find((u) => u.year === year);

  // For hay cutting, we use authorizedAum as the authorized tonnes field
  // (this might need to be adjusted based on your actual data structure)
  const authorizedTonnes = yearUsage && yearUsage.authorizedAum;
  const totalTonnes = parseFloat(calcTotalTonnes(scheduleEntries)) || 0;

  const elementId = ELEMENT_ID.SCHEDULE;
  const errors = [];

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
    const result = handleHayCuttingScheduleEntryValidation(entry);
    if (result) {
      errors.push({ ...result, elementId });
    }
    return undefined;
  });

  if (authorizedTonnes && totalTonnes > authorizedTonnes) {
    errors.push({
      error: true,
      message: TOTAL_TONNES_EXCEEDS,
      elementId,
    });
  }

  return errors;
};
