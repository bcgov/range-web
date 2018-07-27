import { STORE_AGREEMENTS } from '../constants/actionTypes';

const initialState = {
  agreements: {},
  agreementIds: [],
};

const storeAgreements = (state, action) => {
  const { entities, result } = action.payload;
  const { agreements } = entities;
  return {
    agreements: {
      ...agreements,
    },
    agreementIds: [
      ...result,
    ],
  };
};

const agreementReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_AGREEMENTS:
      return storeAgreements(state, action);
    default:
      return state;
  }
};

// private selectors
export const getAgreements = state => state.agreementIds.map(id => state.agreements[id]);
export const getAgreementsMap = state => state.agreements;
export const getAgreementIds = state => state.agreementIds;
export const getAgreementFilter = state => state.filterBy;

export default agreementReducer;
