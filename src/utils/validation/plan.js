import { handleGrazingScheduleValidation } from './grazingSchedule'

/**
 * Validate a range use plan
 *
 * @param {Object} plan the range use plan object
 * @param {Object} pasturesMap
 * @param {Object} grazingSchedulesMap
 * @param {Array} livestockTypes the array of live stock types
 * @param {Array} usage the array of usage from the agreement
 * @returns {Array} An array of errors
 */
export const handleRupValidation = (
  plan = {},
  pasturesMap = {},
  grazingSchedulesMap = {},
  livestockTypes = [],
  usage = []
) => {
  const grazingSchedules =
    plan.grazingSchedules.map(id => grazingSchedulesMap[id]) || []

  let errors = []
  grazingSchedules.map(schedule => {
    errors = [
      ...errors,
      ...handleGrazingScheduleValidation(
        schedule,
        pasturesMap,
        livestockTypes,
        usage
      )
    ]
    return undefined
  })

  return errors
}

export const isPlanAmendment = plan => plan && plan.amendmentTypeId
