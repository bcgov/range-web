import * as actionTypes from '../constants/actionTypes';
import { getReferencesFromLocalStorage } from '../utils';
import { REFERENCE_KEY } from '../constants/variables';
import { Zone, User, EntityMap } from '../types';

export interface References {
  [key: string]: unknown[];
}

export interface CommonStoreState {
  references: References;
  zones: EntityMap<Zone>;
  zoneIds: Array<string | number>;
  users: EntityMap<User>;
  userIds: Array<string | number>;
}

interface CommonStoreAction {
  type: string;
  payload: {
    entities?: { zones?: EntityMap<Zone>; users?: EntityMap<User> };
    result?: Array<string | number>;
    id?: string | number;
    [key: string]: unknown;
  };
}

const initialReferences: References = Object.keys(REFERENCE_KEY).reduce(
  (object, key) => ({
    ...object,
    [key]: [],
  }),
  {} as References,
);

const initialState: CommonStoreState = {
  references:
    getReferencesFromLocalStorage && getReferencesFromLocalStorage()
      ? (getReferencesFromLocalStorage() as References)
      : initialReferences,
  zones: {},
  zoneIds: [],
  users: {},
  userIds: [],
};

const storeZones = (state: CommonStoreState, action: CommonStoreAction): CommonStoreState => {
  const { entities, result } = action.payload;
  const zones = entities?.zones ?? {};
  return {
    ...state,
    zones: {
      ...zones,
    },
    zoneIds: [...(result ?? [])],
  };
};

const updateUser = (state: CommonStoreState, action: CommonStoreAction): CommonStoreState => {
  const user = { ...action.payload } as unknown as User;
  return {
    ...state,
    users: {
      ...state.users,
      [user.id]: user,
    },
  };
};

const storeUsers = (state: CommonStoreState, action: CommonStoreAction): CommonStoreState => {
  const { entities, result } = action.payload;
  const users = entities?.users ?? {};
  return {
    ...state,
    users: {
      ...users,
    },
    userIds: [...(result ?? [])],
  };
};

const commonStoreReducer = (state: CommonStoreState = initialState, action: CommonStoreAction): CommonStoreState => {
  switch (action.type) {
    case actionTypes.STORE_REFERENCES:
      return {
        ...state,
        references: {
          ...(action.payload as unknown as References),
        },
      };
    case actionTypes.STORE_ZONES:
      return storeZones(state, action);
    case actionTypes.STORE_USERS:
      return storeUsers(state, action);
    case actionTypes.USER_UPDATED:
      return updateUser(state, action);
    default:
      return state;
  }
};

// private selectors
export const getZones = (state: CommonStoreState): Zone[] =>
  state.zoneIds.map((id) => state.zones[id]);
export const getZonesMap = (state: CommonStoreState): EntityMap<Zone> => state.zones;
export const getReferences = (state: CommonStoreState): References => state.references;
export const getUsers = (state: CommonStoreState): User[] =>
  state.userIds.map((id) => state.users[id]);
export const getUsersMap = (state: CommonStoreState): EntityMap<User> => state.users;

export default commonStoreReducer;
