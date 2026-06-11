import uuid from 'uuid-v4';

interface AdditionalRequirementLike {
  id?: any;
  createdAt?: any;
  [key: string]: any;
}

export const resetAdditionalRequirementId = (additionalRequirement: AdditionalRequirementLike): any => ({
  ...additionalRequirement,
  createdAt: undefined,
  id: uuid(),
});
