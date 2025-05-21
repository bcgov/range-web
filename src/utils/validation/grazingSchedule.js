import { INVALID_SCHEDULE_ENTRY, EMPTY_SCHEDULE_ENTRIES, TOTAL_AUMS_EXCEEDS } from '../../constants/strings';
import { ELEMENT_ID } from '../../constants/variables';
import { calcCrownTotalAUMs } from '../calculation';
/**
 * Validate a grazing schedule entry
 *
 * @param {object} entry the grazing schedule entry object
 * @returns {object | undefined} the error object that has error and message properties
 */
export const handleGrazingScheduleEntryValidation = (e = {}) => {
  if (e.dateIn && e.dateOut && e.pastureId && e.livestockTypeId && !isNaN(parseFloat(e.livestockCount))) {
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
 * Validate a grazing schedule
 *
 * @param {object} schedule the grazing schedule object
 * @param {Object} pasturesMap the array of pastures from the plan
 * @param {Array} livestockTypes the array of live stock types
 * @param {Array} usage the array of usage from the agreement
 * @param {Boolean} isAgreementHolder is the current user an agreement holder?
 * @returns {Array} An array of errors
 */
export const handleGrazingScheduleValidation = (
  schedule = {},
  pastures = [],
  livestockTypes = [],
  usage = [],
  isAgreementHolder = false,
) => {
  const { year, scheduleEntries: gse } = schedule;
  const scheduleEntries = gse || [];
  const yearUsage = usage.find((u) => u.year === year);
  const totalAnnualUse = yearUsage && yearUsage.totalAnnualUse;
  const crownTotalAUMs = calcCrownTotalAUMs(scheduleEntries, pastures, livestockTypes);

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
    const result = handleGrazingScheduleEntryValidation(entry);
    if (result) {
      errors.push({ ...result, elementId });
    }
    return undefined;
  });

  if (crownTotalAUMs > totalAnnualUse) {
    errors.push({
      error: true,
      message: TOTAL_AUMS_EXCEEDS,
      elementId,
    });
  }
  return errors;
};
