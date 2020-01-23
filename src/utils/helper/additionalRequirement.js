import uuid from 'uuid-v4'

export const resetAdditionalRequirementId = additionalRequirement => ({
  ...additionalRequirement,
  id: uuid()
})
