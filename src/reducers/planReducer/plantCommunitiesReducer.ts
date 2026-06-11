import { STORE_PLAN, PLANT_COMMUNITY_ADDED, PLANT_COMMUNITY_UPDATED } from '../../constants/actionTypes';
import { PlantCommunity, EntityMap } from '../../types';

export type PlantCommunitiesState = EntityMap<PlantCommunity>;

interface PlantCommunityAction {
  type: string;
  payload: {
    entities?: { plantCommunities?: EntityMap<PlantCommunity> };
    id?: number;
    plantCommunity?: PlantCommunity;
    [key: string]: unknown;
  };
}

const initialPlantCommunity: Partial<PlantCommunity> = {
  indicatorPlants: [],
  monitoringAreas: [],
  purposeOfAction: 'none',
  plantCommunityActions: [],
};

const storePlantCommunities = (state: PlantCommunitiesState, action: PlantCommunityAction): PlantCommunitiesState => {
  const plantCommunities = action.payload.entities?.plantCommunities ?? {};

  return {
    ...state,
    ...plantCommunities,
  };
};

const addPlantCommunity = (state: PlantCommunitiesState, action: PlantCommunityAction): PlantCommunitiesState => {
  const { id } = action.payload;

  return {
    ...state,
    [id!]: {
      ...initialPlantCommunity,
      ...action.payload,
    } as PlantCommunity,
  };
};

const updatePlantCommunity = (state: PlantCommunitiesState, action: PlantCommunityAction): PlantCommunitiesState => {
  const { plantCommunity } = action.payload;

  return {
    ...state,
    [plantCommunity!.id]: plantCommunity!,
  };
};

const plantCommunitiesReducer = (state: PlantCommunitiesState = {}, action: PlantCommunityAction): PlantCommunitiesState => {
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
