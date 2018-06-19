import { AGREEMENTS } from '../constants/reducerTypes';
import { STORE_AGREEMENTS, SET_AGREEMENT_FILTER } from '../constants/actionTypes';
import { mapObject } from '../utils';

const initialState = {
  agreements: {},
  agreementIds: [],
  filterBy: {
    status: null,
  },
};

const storeAgreement = (state, action) => {
  const { entities, result } = action.payload;
  const { agreements } = entities;
  return {
    ...state,
    agreements: {
      ...agreements,
    },
    agreementIds: [
      ...result,
    ],
    filterBy: {
      artist: null,
    },
  };
};

const setAgreementFilter = (state, action) => (
  {
    ...state,
    filterBy: {
      ...action.payload,
    },
  }
);


const agreementReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_AGREEMENTS:
      return storeAgreement(state, action);
    case SET_AGREEMENT_FILTER:
      return setAgreementFilter(state, action);
    default:
      return state;
  }
};

// private selectors
export const getAgreements = state => mapObject(state[AGREEMENTS].agreements);
export const getAgreementsMap = state => state[AGREEMENTS].agreements;
export const getAgreementIds = state => state[AGREEMENTS].agreementIds;
export const getAgreementFilter = state => state[AGREEMENTS].filterBy;

export default agreementReducer;
