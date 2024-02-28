import { handleGrazingScheduleValidation } from './grazingSchedule';
import { handlePastureValidation } from './pasture';
import { handlePlantCommunityValidation } from './plantCommunity';
import { handleMinisterIssueValidation } from './ministerIssue';

/**
 * Validate a range use plan
 *
 * @param {Object} plan the range use plan object
 * @param {Object} pasturesMap
 * @param {Object} grazingSchedulesMap
 * @param {Array} livestockTypes the array of live stock types
 * @param {Array} usage the array of usage from the agreement
 * @param {Boolean} isAgreementHolder is the current user an agreement holder?
 * @returns {Array} An array of errors
 */
export const handleRupValidation = (
  plan = {},
  pastures = [],
  livestockTypes = [],
  usage = [],
  isAgreementHolder = false,
) => {
  const { grazingSchedules = [], ministerIssues = [] } = plan;

  let errors = [];
  grazingSchedules.map((schedule) => {
    errors = [
      ...errors,
      ...handleGrazingScheduleValidation(
        schedule,
        pastures,
        livestockTypes,
        usage,
        isAgreementHolder,
      ),
    ];
    return undefined;
  });

  errors = [...errors, ...handlePastureValidation(pastures)];
  errors = [
    ...errors,
    ...handlePlantCommunityValidation(
      pastures.reduce(
        (communities, pasture) => [...communities, ...pasture.plantCommunities],
        [],
      ),
    ),
  ];

  errors = [...errors, ...handleMinisterIssueValidation(ministerIssues)];

  return errors;
};

export const isPlanAmendment = (plan) => plan && plan.amendmentTypeId;

/**
 * Gets the path of the first error in the formik errors object.
 *
 * @param {object} errors Formik errors object
 * @returns {string} Path to first error in errors object
 */
export const getFirstFormikError = (errors, path = []) => {
  const [key, value] = Object.entries(errors)[0];

  if (
    typeof value !== 'string' &&
    typeof value !== 'boolean' &&
    value !== undefined
  ) {
    return getFirstFormikError(value, path.concat(key));
  }
  return [
    path.concat(key).join('.'),
    typeof value === 'boolean' ? 'Required' : value,
  ];
};
