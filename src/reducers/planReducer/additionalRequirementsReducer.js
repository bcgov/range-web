import { STORE_PLAN } from '../../constants/actionTypes'

const storeAdditionalRequirements = (state, action) => {
  const { additionalRequirements } = action.payload.entities

  return {
    ...state,
    ...additionalRequirements
  }
}

const additionalRequirementsReducer = (state = {}, action) => {
  switch (action.type) {
    case STORE_PLAN:
      return storeAdditionalRequirements(state, action)
    default:
      return state
  }
}

export default additionalRequirementsReducer
