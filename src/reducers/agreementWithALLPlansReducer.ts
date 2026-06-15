import { STORE_AGREEMENT_WITH_ALL_PLANS } from '../constants/actionTypes';
import { Agreement, EntityMap } from '../types';

export interface AgreementWithAllPlansState {
  agreements: EntityMap<Agreement>;
  agreementIds: Array<string | number>;
}

interface AgreementWithAllPlansAction {
  type: string;
  payload: {
    entities?: { agreements?: EntityMap<Agreement> };
    result?: string | number;
  };
}

const initialState: AgreementWithAllPlansState = {
  agreements: {},
  agreementIds: [],
};

const storeAgreement = (
  state: AgreementWithAllPlansState,
  action: AgreementWithAllPlansAction,
): AgreementWithAllPlansState => {
  const { entities, result: agreementId } = action.payload;
  const agreements = entities?.agreements ?? {};
  const handleAgreementIds = (
    state: AgreementWithAllPlansState,
    agreementId: string | number,
  ): Array<string | number> => {
    if (state.agreementIds.find((id) => id === agreementId)) {
      return [...state.agreementIds];
    }
    return [...state.agreementIds, agreementId];
  };
  return {
    agreements: {
      ...agreements,
    },
    agreementIds: handleAgreementIds(state, agreementId!),
  };
};

const agreementWithAllPlansReducer = (
  state: AgreementWithAllPlansState = initialState,
  action: AgreementWithAllPlansAction,
): AgreementWithAllPlansState => {
  switch (action.type) {
    case STORE_AGREEMENT_WITH_ALL_PLANS:
      return storeAgreement(state, action);
    default:
      return state;
  }
};

// private selectors
export const getAgreements = (state: AgreementWithAllPlansState): Agreement[] =>
  state.agreementIds.map((id) => state.agreements[id]);
export const getAgreementsMap = (state: AgreementWithAllPlansState): EntityMap<Agreement> => state.agreements;
export const getAgreementIds = (state: AgreementWithAllPlansState): Array<string | number> => state.agreementIds;

export default agreementWithAllPlansReducer;
