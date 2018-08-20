import { handleGrazingScheduleValidation } from './grazingSchedule';

/**
 * Validate a range use plan
 *
 * @param {Object} plan the range use plan object
 * @param {Object} pasturesMap
 * @param {Object} grazingSchedulesMap
 * @param {Array} livestockTypes the array of live stock types
 * @param {Array} usages the array of usages from the agreement
 * @returns {Array} An array of errors
 */
export const handleRupValidation = (
  plan = {},
  pasturesMap = {},
  grazingSchedulesMap = {},
  livestockTypes = [],
  usages = [],
) => {
  const grazingSchedules = plan.grazingSchedules.map(id => grazingSchedulesMap[id]) || [];

  let errors = [];
  grazingSchedules.map((schedule) => {
    errors = [
      ...errors,
      ...handleGrazingScheduleValidation(schedule, pasturesMap, livestockTypes, usages),
    ];
    return undefined;
  });

  return errors;
};

export const isPlanAmendment = (plan) => (
  plan && plan.amendmentTypeId
);