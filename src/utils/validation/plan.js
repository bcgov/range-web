import { handleGrazingScheduleValidation } from './grazingSchedule'
import { handlePastureValidation } from './pasture'
import { handlePlantCommunityValidation } from './plantCommunity'

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
  isAgreementHolder = false
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
        usage,
        isAgreementHolder
      )
    ]
    return undefined
  })

  errors = [...errors, ...handlePastureValidation(pastures)]
  errors = [
    ...errors,
    ...handlePlantCommunityValidation(
      pastures.reduce(
        (communities, pasture) => [...communities, ...pasture.plantCommunities],
        []
      )
    )
  ]

  return errors
}

export const isPlanAmendment = plan => plan && plan.amendmentTypeId
