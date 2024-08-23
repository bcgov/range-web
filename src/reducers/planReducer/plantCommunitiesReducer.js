import { STORE_PLAN, PLANT_COMMUNITY_ADDED, PLANT_COMMUNITY_UPDATED } from '../../constants/actionTypes';

const initialPlantCommunity = {
  indicatorPlants: [],
  monitoringAreas: [],
  purposeOfAction: 'none',
  plantCommunityActions: [],
};

const storePlantCommunities = (state, action) => {
  const { plantCommunities } = action.payload.entities;

  return {
    ...state,
    ...plantCommunities,
  };
};

const addPlantCommunity = (state, action) => {
  const { id } = action.payload;

  return {
    ...state,
    [id]: {
      ...initialPlantCommunity,
      ...action.payload,
    },
  };
};

const updatePlantCommunity = (state, action) => {
  const { plantCommunity } = action.payload;

  return {
    ...state,
    [plantCommunity.id]: plantCommunity,
  };
};

const plantCommunitiesReducer = (state = {}, action) => {
  switch (action.type) {
    case STORE_PLAN:
      return storePlantCommunities(state, action);
    case PLANT_COMMUNITY_ADDED:
      return addPlantCommunity(state, action);
    case PLANT_COMMUNITY_UPDATED:
      return updatePlantCommunity(state, action);
    default:
      return state;
  }
};

export default plantCommunitiesReducer;
