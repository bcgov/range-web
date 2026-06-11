import { handleGrazingScheduleValidation } from './grazingSchedule';
import { handleHayCuttingScheduleValidation } from './hayCuttingSchedule';
import { handlePastureValidation } from './pasture';
import { handlePlantCommunityValidation } from './plantCommunity';
import { handleMinisterIssueValidation } from './ministerIssue';

interface ValidationError {
  error: boolean;
  message: string;
  elementId?: string;
}

/**
 * Validate a range use plan
 *
 * @param plan the range use plan object
 * @param pastures the array of pastures
 * @param livestockTypes the array of live stock types
 * @param usage the array of usage from the agreement
 * @param isAgreementHolder is the current user an agreement holder?
 * @returns An array of errors
 */
export const handleRupValidation = (
  plan: any = {},
  pastures: any[] = [],
  livestockTypes: any[] = [],
  usage: any[] = [],
  isAgreementHolder = false,
): ValidationError[] => {
  const { schedules = [], ministerIssues = [], agreement = {} } = plan;
  let errors: ValidationError[] = [];

  // Determine if this is a grazing agreement (types 1 and 2) or hay cutting agreement
  const isGrazing = agreement.agreementTypeId === 1 || agreement.agreementTypeId === 2;
  const isHayCutting = agreement.agreementTypeId === 3 || agreement.agreementTypeId === 4;

  schedules.map((schedule: any) => {
    if (isGrazing) {
      errors = [
        ...errors,
        ...handleGrazingScheduleValidation(schedule, pastures, livestockTypes, usage, isAgreementHolder),
      ];
    } else if (isHayCutting) {
      errors = [...errors, ...handleHayCuttingScheduleValidation(schedule, usage, isAgreementHolder)];
    } else {
      // Handle unknown agreement types
      throw new Error(
        `Unknown agreement type: ${agreement.agreementTypeId}. Only grazing (types 1, 2) and hay cutting (types 3, 4) agreements are supported.`,
      );
    }
    return undefined;
  });

  errors = [...errors, ...handlePastureValidation(pastures)];
  errors = [
    ...errors,
    ...handlePlantCommunityValidation(
      pastures.reduce((communities: any[], pasture: any) => [...communities, ...(pasture.plantCommunities || [])], []),
    ),
  ];

  errors = [...errors, ...handleMinisterIssueValidation(ministerIssues)];

  return errors;
};

export const isPlanAmendment = (plan: any): boolean => plan && plan.amendmentTypeId;

/**
 * Gets the path of the first error in the formik errors object.
 *
 * @param errors Formik errors object
 * @param path current path accumulator
 * @returns Path to first error in errors object
 */
export const getFirstFormikError = (errors: any, path: string[] = []): [string, string] => {
  const [key, value] = Object.entries(errors)[0];

  if (typeof value !== 'string' && typeof value !== 'boolean' && value !== undefined) {
    return getFirstFormikError(value, path.concat(key));
  }
  return [path.concat(key).join('.'), typeof value === 'boolean' ? 'Required' : (value as string)];
};
