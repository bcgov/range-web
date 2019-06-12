import { STORE_PLAN } from '../../constants/actionTypes'

const storePlantCommunities = (state, action) => {
  const { plantCommunities } = action.payload.entities

  return {
    ...state,
    ...plantCommunities
  }
}

const plantCommunitiesReducer = (state = {}, action) => {
  switch (action.type) {
    case STORE_PLAN:
      return storePlantCommunities(state, action)
    default:
      return state
  }
}

export default plantCommunitiesReducer
