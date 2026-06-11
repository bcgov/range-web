import { STORE_AGREEMENTS, AGREEMENT_SEARCH_CHANGED } from '../constants/actionTypes';
import { Agreement, EntityMap } from '../types';

export interface AgreementSearchParams {
  page?: number;
  term?: string;
  [key: string]: unknown;
}

export interface AgreementState {
  agreements: EntityMap<Agreement>;
  agreementIds: Array<string | number>;
  params: AgreementSearchParams | null;
}

interface AgreementAction {
  type: string;
  payload: {
    entities?: { agreements?: EntityMap<Agreement> };
    result?: Array<string | number>;
    params?: AgreementSearchParams;
    [key: string]: unknown;
  };
}

const initialState: AgreementState = {
  agreements: {},
  agreementIds: [],
  params: null,
};

const storeAgreements = (state: AgreementState, action: AgreementAction): AgreementState => {
  const { entities, result, params } = action.payload;
  const agreements = entities?.agreements ?? {};
  return {
    agreements: {
      ...agreements,
    },
    agreementIds: [...(result ?? [])],
    params: params ?? null,
  };
};

const storeParams = (state: AgreementState, action: AgreementAction): AgreementState => {
  const params = { ...action.payload } as AgreementSearchParams;

  return {
    ...state,
    params,
  };
};

const agreementReducer = (state: AgreementState = initialState, action: AgreementAction): AgreementState => {
  switch (action.type) {
    case STORE_AGREEMENTS:
      return storeAgreements(state, action);
    case AGREEMENT_SEARCH_CHANGED:
      return storeParams(state, action);
    default:
      return state;
  }
};

// private selectors
export const getAgreements = (state: AgreementState): Agreement[] =>
  state.agreementIds.map((id) => state.agreements[id]);
export const getAgreementsMap = (state: AgreementState): EntityMap<Agreement> => state.agreements;
export const getAgreementIds = (state: AgreementState): Array<string | number> => state.agreementIds;
export const getAgreementSearchParams = (state: AgreementState): AgreementSearchParams | null => state.params;

export default agreementReducer;
