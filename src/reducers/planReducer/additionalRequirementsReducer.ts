import { STORE_PLAN } from '../../constants/actionTypes';
import { AdditionalRequirement, EntityMap } from '../../types';

export type AdditionalRequirementsState = EntityMap<AdditionalRequirement>;

interface AdditionalRequirementAction {
  type: string;
  payload: {
    entities?: { additionalRequirements?: EntityMap<AdditionalRequirement> };
  };
}

const storeAdditionalRequirements = (
  state: AdditionalRequirementsState,
  action: AdditionalRequirementAction,
): AdditionalRequirementsState => {
  const additionalRequirements = action.payload.entities?.additionalRequirements ?? {};

  return {
    ...state,
    ...additionalRequirements,
  };
};

const additionalRequirementsReducer = (
  state: AdditionalRequirementsState = {},
  action: AdditionalRequirementAction,
): AdditionalRequirementsState => {
  switch (action.type) {
    case STORE_PLAN:
      return storeAdditionalRequirements(state, action);
    default:
      return state;
  }
};

export default additionalRequirementsReducer;
