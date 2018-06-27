import { STORE_REFERENCES, STORE_ZONES, STORE_USERS, UPDATE_ZONE } from '../constants/actionTypes';

const initialState = {
  references: {},
  zones: {},
  zoneIds: [],
  users: {},
  userIds: [],
};

const updateZone = (state, action) => {
  const zone = action.payload;
  return {
    ...state,
    zones: {
      ...state.zones,
      [zone.id]: zone,
    },
  };
};

const storeZones = (state, action) => {
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

const storeUsers = (state, action) => {
  const { entities, result } = action.payload;
  const { users } = entities;
  return {
    ...state,
    users: {
      ...users,
    },
    userIds: [
      ...result,
    ],
  };
};

const commonStoreReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_REFERENCES:
      return {
        ...state,
        references: {
          ...action.payload,
        },
      };
    case STORE_ZONES:
      return storeZones(state, action);
    case UPDATE_ZONE:
      return updateZone(state, action);
    case STORE_USERS:
      return storeUsers(state, action);
    default:
      return state;
  }
};

// private selectors
export const getZones = state => state.zoneIds.map(id => state.zones[id]);
export const getZonesMap = state => state.zones;
export const getReferences = state => state.references;
export const getUsers = state => state.userIds.map(id => state.users[id]);
export const getUsersMap = state => state.users;

export default commonStoreReducer;
