import { STORE_PLAN, PLANT_COMMUNITY_ADDED } from '../../constants/actionTypes'

const initialPlantCommunity = {
  /*purposeOfAction: 'none',
  aspect: null,
  elevationId: null,
  url: null,
  notes: null,
  approved: false,
  rangeReadinessDay: null,
  rangeReadinessMonth: null,
  rangeReadinessNote: null,
  shrubUse: null,
  plantCommunityActions: [],*/
  indicatorPlants: [],
  monitoringAreas: []
}

const storePlantCommunities = (state, action) => {
  const { plantCommunities } = action.payload.entities

  return {
    ...state,
    ...plantCommunities
  }
}

const addPlantCommunity = (state, action) => {
  const { id } = action.payload

  return {
    ...state,
    [id]: {
      ...initialPlantCommunity,
      ...action.payload
    }
  }
}
const plantCommunitiesReducer = (state = {}, action) => {
  switch (action.type) {
    case STORE_PLAN:
      return storePlantCommunities(state, action)
    case PLANT_COMMUNITY_ADDED:
      return addPlantCommunity(state, action)
    default:
      return state
  }
}

export default plantCommunitiesReducer
