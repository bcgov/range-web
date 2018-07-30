import { STORE_AGREEMENT_WITH_ALL_PLANS } from '../constants/actionTypes';

const initialState = {
  agreements: {},
  agreementIds: [],
};

const storeAgreement = (state, action) => {
  const { entities, result: agreementId } = action.payload;
  const { agreements } = entities;
  const handleAgreementIds = (state, agreementId) => {
    if (state.agreementIds.find(id => id === agreementId)) {
      return [...state.agreementIds];
    }
    return [...state.agreementIds, agreementId];
  };
  return {
    agreements: {
      ...agreements,
    },
    agreementIds: handleAgreementIds(state, agreementId),
  };
};

const agreementWithAllPlansReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_AGREEMENT_WITH_ALL_PLANS:
      return storeAgreement(state, action);
    default:
      return state;
  }
};

// private selectors
export const getAgreements = state => state.agreementIds.map(id => state.agreements[id]);
export const getAgreementsMap = state => state.agreements;
export const getAgreementIds = state => state.agreementIds;

export default agreementWithAllPlansReducer;
