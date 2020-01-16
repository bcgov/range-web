import { handleGrazingScheduleValidation } from './grazingSchedule'
import { handlePastureValidation } from './pasture'

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
  pastures = [],
  livestockTypes = [],
  usage = []
) => {
  const { grazingSchedules = [] } = plan

  let errors = []
  grazingSchedules.map(schedule => {
    errors = [
      ...errors,
      ...handleGrazingScheduleValidation(
        schedule,
        pastures,
        livestockTypes,
        usage
      )
    ]
    return undefined
  })

  errors = [...errors, ...handlePastureValidation(pastures)]

  return errors
}

export const isPlanAmendment = plan => plan && plan.amendmentTypeId
