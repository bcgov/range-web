import {
  STORE_AGREEMENTS,
  AGREEMENT_SEARCH_CHANGED
} from '../constants/actionTypes'

const initialState = {
  agreements: {},
  agreementIds: [],
  params: null
}

const storeAgreements = (state, action) => {
  const { entities, result, params } = action.payload
  const { agreements } = entities
  return {
    agreements: {
      ...agreements
    },
    agreementIds: [...result],
    params
  }
}

const storeParams = (state, action) => {
  const params = { ...action.payload }

  return {
    ...state,
    params
  }
}

const agreementReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_AGREEMENTS:
      return storeAgreements(state, action)
    case AGREEMENT_SEARCH_CHANGED:
      return storeParams(state, action)
    default:
      return state
  }
}

// private selectors
export const getAgreements = state =>
  state.agreementIds.map(id => state.agreements[id])
export const getAgreementsMap = state => state.agreements
export const getAgreementIds = state => state.agreementIds
export const getAgreementSearchParams = state => state.params

export default agreementReducer
