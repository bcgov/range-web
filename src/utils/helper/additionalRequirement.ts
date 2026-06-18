import uuid from 'uuid-v4';

interface AdditionalRequirementLike {
  id?: string | number;
  createdAt?: string;
}

export const resetAdditionalRequirementId = (
  additionalRequirement: AdditionalRequirementLike,
): AdditionalRequirementLike => ({
  ...additionalRequirement,
  createdAt: undefined,
  id: uuid(),
});
