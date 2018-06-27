import { STORE_REFERENCE, STORE_ZONE } from '../constants/actionTypes';

const initialState = {
  references: {},
  zones: {},
  zoneIds: [],
};

const storeZone = (state, action) => {
  const { entities, result } = action.payload;
  const { zones } = entities;
  return {
    ...state,
    zones: {
      ...zones,
    },
    zoneIds: [
      ...result,
    ],
  };
};

const commonStoreReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_REFERENCE:
      return {
        ...state,
        references: {
          ...action.payload,
        },
      };
    case STORE_ZONE:
      return storeZone(state, action);
    default:
      return state;
  }
};
// private selectors
export const getZones = state => state.zoneIds.map(id => state.zones[id]);
export const getZonesMap = state => state.zones;
export const getReferences = state => state.references;

export default commonStoreReducer;
